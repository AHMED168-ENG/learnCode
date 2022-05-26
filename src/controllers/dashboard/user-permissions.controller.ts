import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Op } from "sequelize";
import modules from "../../models/module.model";
import page from "../../models/page.model";
import permissions from "../../models/permissions.model";
import { ModulesController } from "./modules.controller";
import { PagesController } from "./pages.controller";
import { UserRolesController } from "./user-roles.controller";
const { verify } = require("../../helper/token");
export class UserPermissionsController {
  constructor() {}
  public async listPermissions(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const modulesData = await new ModulesController().getModules();
      const pagesData = await new PagesController().getPages();
      const permissionsData = await permissions.findAll({ where: { role_id: req.params.role_id }, attributes: { exclude: ["role_id", "createdAt", "updatedAt"] } });
      const roles = await new UserRolesController().getRoles();
      const modulesArr = [];
      for (const moduleData of modulesData) {
        const filteredPages = pagesData.filter((pageData) => moduleData["id"] === pageData["module_id"]);
        const pages = [];
        for (const page of filteredPages) {
          let checked = false;
          const permission = permissionsData.find((permission) => permission["page_id"] === page["id"]);
          if (permission) checked = true;
          const perPage = { checked, id: page["id"], type: page["type"], link: page["link"] };
          pages.push(perPage);
        }
        const perModule = { id: moduleData["id"], name: moduleData["name"], pages };
        modulesArr.push(perModule);
      }
      const data = { role_id: req.params.role_id, roles, modules: modulesArr };
      return res.render("dashboard/views/user-permissions/list.ejs", { title: "Permissions List", data });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, messgae: "Can't get permissions list page" });
    }
  }
  public async editPermissions(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.body.checked || !req.body.page_id) return res.status(httpStatus.BAD_REQUEST).json({ messgae: "Bad Request" });
      if (req.body.checked === "true") await permissions.create({ role_id: req.params.role_id, page_id: req.body.page_id });
      else await permissions.destroy({ where: { [Op.and]: [{ role_id: req.params.role_id },  { page_id: req.body.page_id }] }});
      return res.status(200).json({ msg: "Permissions are updated successfully" });
    } catch (error) {
      console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, messgae: "Can't edit permissions" });
    }
  }
  public async getUserPermissions(token: string, moduleName: string) {
    try {
      const payload = verify(token);
      const isHighestAdmin = payload.role_id === "0";
      let userPermissions, canEdit = true, canAdd = true;
      if (!isHighestAdmin) {
        userPermissions = await permissions.findAll({
          where: { role_id: payload.role_id },
          attributes: { exclude: ["role_id", "page_id", "createdAt", "updatedAt"] },
          include: [{ model: page, attributes: ["type"], include: [{ model: modules, attributes: ["name"] }] }],
        });
        canEdit = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Edit" && per["tbl_page"]["tbl_module"]["name"] === moduleName).length;
        canAdd = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Add" && per["tbl_page"]["tbl_module"]["name"] === moduleName).length;
      }
      return { canAdd, canEdit };
    } catch (error) {
      throw error;
    }
  }
}
