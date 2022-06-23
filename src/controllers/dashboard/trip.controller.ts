import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import destination from "../../models/destination.model";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { ModulesController } from "../dashboard/modules.controller";
import webAppsUsers from "../../models/user.model";
import transportation from "../../models/transportation.model";
import trip from "../../models/trip.model";
import { DestinationController } from "./destination.controller";
import helpers from "../../helper/helpers";
import path from "path";
import admin from "../../models/admin.model";
import { UserController } from "./user.controller";
import { AdminController } from "./admin.controller";
import { Op } from "sequelize";
const { verify } = require("../../helper/token");
export class TripController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/trip/list.ejs", { title: "Trips" });
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
          { model: admin, attributes: ["fullName"] },
        ],
      }) || [];
      const countTrips = await trip.count() || 0;
      const module_id = await new ModulesController().getModuleIdByName("Trips Management");
      const dataInti = { total: countTrips, limit, page: Number(req.query.page), pages: Math.ceil(countTrips / limit) + 1, data, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting trips list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting trip", err: "unexpected error" });
      let data = await trip.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          { model: destination, attributes: ["ar_title", "en_title"] },
          { model: webAppsUsers, attributes: ["fullName", "email", "phone"] },
          { model: admin, attributes: ["fullName", "email", "phone"] },
          // { model: transportation, attributes: ["ar_description", "en_description"] },
        ],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Trips Management");
      data['from'] = helpers.getFullTime(data['from']);
      data['to'] = helpers.getFullTime(data['to']);
      data["adminName"] = !data["web_apps_user"]?.fullName && !data["admin"]?.fullName ? process.env.admin_name : null;
      data["adminEmail"] = !data["web_apps_user"]?.email && !data["admin"]?.email ? process.env.admin_email : null;
      data["adminPhone"] = !data["web_apps_user"]?.phone && !data["admin"]?.phone ? process.env.admin_phone : null;
      return res.render("dashboard/views/trip/view.ejs", { title: "View trip Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get trip data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await new DestinationController().getAllDestinations();
      return res.render("dashboard/views/trip/new.ejs", { title: "Trip new", destinations });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get trip new page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.body.destination_id || !req.body.length || !req.body.from || !req.body.to || !req.files;
      const areNotNumbers = !Number(req.body.destination_id);
      if (areNull || areNotNumbers) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files.image;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const payload = verify(req.cookies.token);
      const webUser = await new UserController().getUserByEmail(payload.email);
      const admin = await new AdminController().getAdminByEmail(payload.email);
      const isUserExists = webUser || admin;
      if (!isUserExists && payload.role_id != process.env.admin_role) return res.status(404).json({ msg: "Not Found", err: "unexpected error" });
      if (webUser) req.body.user_id = payload.user_id;
      if (admin) req.body.admin_id = payload.user_id;
      const createdTrip = await trip.create(req.body);
      if (createdTrip) {
        const fileDir: string = `trips/${createdTrip["id"]}/`
        const set = { image: imgName ? `${fileDir}${imgName}` : null };
        const updatedTrip = await trip.update(set, { where: { id: createdTrip["id"] } });
        if (updatedTrip) {
          if (imgName && img) helpers.imageProcessing(fileDir, imgName, img["data"]);
          return res.status(httpStatus.OK).json({ msg: "New Trip created" });
        }
      }
      return res.status(httpStatus.OK).json({ msg: "new trip created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new trip", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting trip", err: "unexpected error" });
      let data = await trip.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const destinations = await new DestinationController().getAllDestinations();
      const module_id = await new ModulesController().getModuleIdByName("Trips Management");
      data['from'] = helpers.getFullTime(data['from']);
      data['to'] = helpers.getFullTime(data['to']);
      return res.render("dashboard/views/trip/edit.ejs", { title: "Edit Trip", data, destinations, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get trip data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files ? req.files.image : null;
      const payload = req.query.status ? { status: req.query.status } : req.body;
      const updatedTrip = await trip.update(payload, { where: { id: req.params.id } });
      if (updatedTrip && img) {
        const foundTrip = await trip.findOne({ where: { id: req.params.id }, attributes: ["image"], raw: true });
        let imgName: string;
        if (img) {
          helpers.removeFile(foundTrip["image"]);
          imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        }
        const fileDir: string = `trips/${req.params.id}/`
        const set = { image: `${fileDir}${imgName}` || fileDir + foundTrip["image"] };
        const updatedDestWithImages = await trip.update(set, { where: { id: req.params.id }});
        if (updatedDestWithImages) {
          if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]);
        }
      }
      return res.status(httpStatus.OK).json({ msg: "trip edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit trip", err: "unexpected error" });
    }
  }
  public async getAllTrips(userId?: number) {
    try {
      const where = userId ? { [Op.or]: { user_id: userId, admin_id: userId } } : {};
      return await trip.findAll({ where, attributes: ["id", "ar_name", "en_name", "from"] });
    } catch (error) {
      throw error;
    }
  }
}
