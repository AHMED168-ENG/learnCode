import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Op } from "sequelize";
import modules from "../../models/module.model";
import page from "../../models/page.model";
import permissions from "../../models/permissions.model";
import role from "../../models/user-roles.model";
export class UserPermissionsController {
  constructor() {}
  public async listPermissions(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const modulesData = await modules.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
      const pagesData = await page.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
      const permissionsData = await permissions.findAll({ where: { role_id: req.params.role_id }, attributes: { exclude: ["role_id", "createdAt", "updatedAt"] } });
      const roles = await role.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
      const modulesArr = [];
      for (const moduleData of modulesData) {
        const filteredPages = pagesData.filter((pageData) => moduleData["id"] === pageData["module_id"]);
        let checked: boolean = false;
        const pages = [];
        for (const page of filteredPages) {
          const permission = permissionsData.find((permission) => permission["page_id"] === page["id"]);
          if (permission) checked = true;
          const perPage = { checked, id: page["id"], type: page["type"], link: page["link"] };
          pages.push(perPage);
        }
        const perModule = { id: moduleData["id"], name: moduleData["name"], pages };
        modulesArr.push(perModule);
      }
      const data = { role_id: req.params.role_id, roles, modules: modulesArr };
      return res.render("user-permissions/list.ejs", { title: "Permissions List", data });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, messgae: "Can't get permissions list page" });
    }
  }
  public async editPermissions(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      if (typeof req.body.checked !== "boolean" && req.body.checked !== "true" && req.body.checked !== "false") {
        return res.status(httpStatus.BAD_REQUEST).json({ messgae: "Bad Request" });
      } else {
        if (req.body.checked === "true") await permissions.create({ role_id: req.params.role_id, page_id: req.params.page_id });
        else await permissions.destroy({ where: { [Op.and]: [{ role_id: req.params.role_id },  { page_id: req.params.page_id }] }});
      }
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, messgae: "Can't edit permissions" });
    }
  }
}