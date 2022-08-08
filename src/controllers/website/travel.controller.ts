import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import essentials from "../../models/travel.model";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
export class TravelController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("website/views/travel/list.ejs", { title: "Travel Essentials" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await essentials.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } }) || [];
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Travel Essentials");
      const dataInti = { data, canAdd: permissions.canAdd, canEdit: permissions.canEdit };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting travel essentials list", msg: "Internal Server Error" });
    }
  }
}
