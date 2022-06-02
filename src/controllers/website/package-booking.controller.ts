import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import promo from "../../models/promo.model";
import webAppsUsers from "../../models/user.model";
import packageBooking from "../../models/package-booking.model";
import packages from "../../models/package.model";
export class PackageBookingController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("website/views/package-booking/list.ejs", { title: "Package Bookings" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const data = await packageBooking.findAll({
        limit,
        offset,
        where: { package_id: req.params.package_id },
        attributes: { include: ["id", "request", "status", "pay_type"] },
        include: [
          { model: promo, attributes: ["promo_name", "percent"] },
          { model: webAppsUsers, attributes: ["user_id", "fullName"] },
          { model: packages, attributes: ["ar_name", "en_name"] },
        ],
      }) || [];
      const countBookings = await packageBooking.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Package Booking Management");
      const module_id = await new ModulesController().getModuleIdByName("Package Booking Management");
      const dataInti = { total: countBookings, limit, page: Number(req.query.page), pages: Math.ceil(countBookings / limit) + 1, data, canAdd: permissions.canAdd, canEdit: permissions.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      console.log(error)
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting package bookings list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting package booking", err: "unexpected error" });
      const data = await packageBooking.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["updatedAt"] },
        include: [
          { model: promo, attributes: ["promo_name", "percent"] },
          { model: webAppsUsers, attributes: ["fullName", "email", "phone", "user_type"] },
          { model: packages, attributes: ["ar_name", "en_name"] },
        ],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Package Booking Management");
      return res.render("website/views/package-booking/view.ejs", { title: "View package booking Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get package booking data in view page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id || (!req.query.status && !req.query.request)) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const payload = req.query.status ? { status: req.query.status } : req.query.request ? { request: req.query.request } : req.body;
      await packageBooking.update(payload, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "package booking edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit package booking", err: "unexpected error" });
    }
  }
}
