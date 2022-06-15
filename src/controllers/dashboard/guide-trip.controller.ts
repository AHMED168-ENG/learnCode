import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { UserPermissionsController } from "./user-permissions.controller";
import { ModulesController } from "./modules.controller";
import trip from "../../models/trip.model";
import { TripController } from "./trip.controller";
import guideTrip from "../../models/guide-trip.model";
export class GuideTripController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/guide-trip/list.ejs", { title: "Tour Guide Trips" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const where = { guide_id: req.params.guide_id };
      const data = await guideTrip.findAll({ limit, offset, where, attributes: ["id", "trip_id"], include: [{ model: trip, attributes: ["ar_name", "en_name"] }] }) || [];
      const countTrips = await guideTrip.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Trips Management");
      const module_id = await new ModulesController().getModuleIdByName("Trips Management");
      const dataInti = { total: countTrips, limit, page: Number(req.query.page), pages: Math.ceil(countTrips / limit) + 1, data, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting trips list", msg: "Internal Server Error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const trips = await new TripController().getAllTrips();
      return res.render("dashboard/views/guide-trip/new.ejs", { title: "Tour Guide Trip new", trips });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get tour guide new page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNotNumbers = !Number(req.body.trip_id) || !Number(req.params.guide_id);
      if (areNotNumbers) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const payload = { guide_id: Number(req.params.guide_id), trip_id: Number(req.body.trip_id) };
      await guideTrip.create(payload);
      return res.status(httpStatus.OK).json({ msg: "new tour guide trip created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new tour guide trip", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!Number(req.params.id) || !Number(req.params.guide_id)) return res.status(404).json({ msg: "Error in getting tour guide", err: "unexpected error" });
      const data = await guideTrip.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const trips = await new TripController().getAllTrips();
      return res.render("dashboard/views/guide-trip/edit.ejs", { title: "Edit Tour Guide", data, trips, guide_id: req.params.guide_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get tour guide data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id || !Number(req.body.trip_id) || !Number(req.params.guide_id)) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await guideTrip.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "tour guide trip edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit tour guide", err: "unexpected error" });
    }
  }
}
