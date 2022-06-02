import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import destination from "../../models/destination.model";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { ModulesController } from "../dashboard/modules.controller";
import webAppsUsers from "../../models/user.model";
import transportation from "../../models/transportation.model";
import trip from "../../models/trip.model";
export class TripController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("website/views/trip/list.ejs", { title: "Trips" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const data = await trip.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "image"] },
        include: [
          { model: destination, attributes: ["ar_title", "en_title"] },
          { model: webAppsUsers, attributes: ["fullName"] },
        ],
      }) || [];
      const countTrips = await trip.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Trips Management");
      const module_id = await new ModulesController().getModuleIdByName("Trips Management");
      const dataInti = { total: countTrips, limit, page: Number(req.query.page), pages: Math.ceil(countTrips / limit) + 1, data, canAdd: permissions.canAdd, canEdit: permissions.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting trips list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting trip", err: "unexpected error" });
      const data = await trip.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          { model: destination, attributes: ["ar_title", "en_title"] },
          { model: webAppsUsers, attributes: ["fullName", "email", "phone"] },
          { model: transportation, attributes: ["ar_description", "en_description"] },
        ],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Trips Management");
      return res.render("website/views/trip/view.ejs", { title: "View trip Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get trip data in view page", err: "unexpected error" });
    }
  }
}
