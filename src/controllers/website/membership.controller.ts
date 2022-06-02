import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import destination from "../../models/destination.model";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { ModulesController } from "../dashboard/modules.controller";
import membership from "../../models/membership.model";
export class MembershipController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("website/views/membership/list.ejs", { title: "Events" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const data = await membership.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "image"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
      }) || [];
      const countMemberships = await membership.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Memberships Management");
      const module_id = await new ModulesController().getModuleIdByName("Memberships Management");
      const dataInti = { total: countMemberships, limit, page: Number(req.query.page), pages: Math.ceil(countMemberships / limit) + 1, data, canAdd: permissions.canAdd, canEdit: permissions.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting memberships list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting membership", err: "unexpected error" });
      const data = await membership.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Memberships Management");
      return res.render("website/views/membership/view.ejs", { title: "View membership Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get membership data in view page", err: "unexpected error" });
    }
  }
}
