import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import destination from "../../models/destination.model";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { ModulesController } from "../dashboard/modules.controller";
import webAppsUsers from "../../models/user.model";
import transportation from "../../models/transportation.model";
import trip from "../../models/trip.model";
import { DestinationsController } from "../dashboard/destination.controller";
import helpers from "../../helper/helpers";
import { UserController } from "../dashboard/user.controller";
import { AdminController } from "../dashboard/admin.controller";
import path from "path";
import admin from "../../models/admin.model";
import { TripActivityController } from "./trip-activity.controller";
import { ActivityController } from "./activity.controller";
import { Op } from "sequelize";
import { GuideTripController } from "./guide-trip.controller";
import { TourGuideController } from "./guide.controller";
const { verify } = require("../../helper/token");
export class TripsController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("website/views/trip/list.ejs", { title: "Trips" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const lang = req["lang"] && req["lang"] === "ar" ? "ar" : "en";
      const trips = await trip.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "image"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
      }) || [];
      const data = trips.map((t) => {
        return {
          id: t["id"],
          name: t[`${lang}_name`],
          image: t["image"],
          destination: t["tbl_destination"][`${lang}_title`],
        };
      });
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
      let data = await trip.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          { model: destination, attributes: ["ar_title", "en_title", "location_lat", "location_long"] },
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
      const lang = req["lang"] && req["lang"] === "ar" ? "ar" : "en";
      const tripActivities = await new TripActivityController().list(lang, Number(req.params.id), data["from"], data["to"]);
      const tripGuides = await new GuideTripController().getTourguidesWithTrip(data["id"]);
      return res.render("website/views/trip/view.ejs", { title: "View trip Details", data, module_id, tripActivities, tripGuides });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get trip data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await new DestinationsController().getAllDestinations();
      const lang = req["lang"] && req["lang"] === "ar" ? "ar" : "en";
      const activities = await new ActivityController().getAllActivities(lang);
      const guides = await new TourGuideController().getAllGuides();
      return res.render("website/views/trip/new.ejs", { title: "Plan Your Trip", destinations, activities, guides });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get trip new page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.body.destination_id || !req.body.length || !req.body.from || !req.body.to || !req.body.activitiesDays || !req.body.guides || !req.files;
      const activitiesDays = JSON.parse(req.body.activitiesDays);
      const guides = JSON.parse(req.body.guides);
      const isNotArray = !Array.isArray(activitiesDays) || !Array.isArray(guides);
      const areNotNumbers = !Number(req.body.destination_id);
      let invaliditemsInArray;
      for (const activityDay of activitiesDays) invaliditemsInArray = activityDay["activities"].filter((activity) => !Number(activity));
      invaliditemsInArray = guides.filter((guide) => !Number(guide));
      if (areNull || areNotNumbers || isNotArray || invaliditemsInArray.length) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files.image;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const payload = verify(req.cookies.token);
      const webUser = await new UserController().getUserByEmail(payload.email);
      const admin = await new AdminController().getAdminByEmail(payload.email);
      const isUserExists = webUser || admin;
      if (!isUserExists && payload.role_id != process.env.admin_role) return res.status(404).json({ msg: "Not Found", err: "unexpected error" });
      req.body.user_id = webUser ? payload.user_id : null;
      req.body.admin_id = admin ? payload.user_id : null;
      const tripToCreate = req.body;
      delete tripToCreate.activitiesDays;
      const createdTrip = await trip.create(tripToCreate);
      const createdTripActivities = createdTrip ? await new TripActivityController().addTripActivities(createdTrip["id"], activitiesDays, req.body.from) : undefined;
      const createdGuides = createdTrip && createdTripActivities ? await new GuideTripController().addTripGuides(createdTrip["id"], guides) : undefined;
      if (createdTripActivities && createdGuides) {
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
      return res.status(500).json({ msg: "Error in create new trip", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting trip", err: "unexpected error" });
      let data = await trip.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const destinations = await new DestinationsController().getAllDestinations();
      const lang = req["lang"] && req["lang"] === "ar" ? "ar" : "en";
      const activities = await new ActivityController().getAllActivities(lang);
      const tripActivities = await new TripActivityController().list(lang, Number(req.params.id), data["from"], data["to"]);
      const guides = await new TourGuideController().getAllGuides();
      const tripGuides = await new GuideTripController().getTourguidesWithTrip(data["id"]);
      data['from'] = helpers.getFullTime(data['from']);
      data['to'] = helpers.getFullTime(data['to']);
      return res.render("website/views/trip/edit.ejs", { title: "Edit Trip", data, destinations, tripActivities, activities, guides, tripGuides });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get trip data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const activitiesDays = JSON.parse(req.body.activitiesDays);
      const guides = JSON.parse(req.body.guides);
      const tripToUpdate = req.body;
      delete tripToUpdate.activitiesDays;
      delete tripToUpdate.guides;
      const payload = req.query.status ? { status: req.query.status } : tripToUpdate;
      if (payload && payload !== {}) await trip.update(payload, { where: { id: req.params.id } });
      const img = req.files ? req.files.image : null;
      const foundTrip = await trip.findOne({ where: { id: req.params.id }, attributes: ["id", "image", "from"], raw: true });
      if (img) {
        let imgName: string;
        helpers.removeFile(foundTrip["image"]);
        imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        const fileDir: string = `trips/${req.params.id}/`
        const set = { image: `${fileDir}${imgName}` || fileDir + foundTrip["image"] };
        const updatedDestWithImages = await trip.update(set, { where: { id: req.params.id }});
        if (updatedDestWithImages) {
          if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]);
        }
      }
      if (activitiesDays.addedActivities && activitiesDays.addedActivities.length) {
        await new TripActivityController().addTripActivities(foundTrip["id"], activitiesDays.addedActivities, foundTrip["from"]);
      }
      if (activitiesDays.removedActivities && activitiesDays.removedActivities.length) {
        await new TripActivityController().removeTripActivity(activitiesDays.removedActivities);
      }
      if (guides.addedGuides && guides.addedGuides.length) {
        await new GuideTripController().addTripGuides(foundTrip["id"], guides.addedGuides);
      }
      if (guides.removedGuides && guides.removedGuides.length) {
        await new GuideTripController().removeTripGuide(guides.removedGuides);
      }
      return res.status(httpStatus.OK).json({ msg: "trip edited" });
    } catch (error) {
      console.log(error)
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit trip", err: "unexpected error" });
    }
  }
  public async getAllTrips(userId?: number) {
    try {
      const where = !!userId ? { [Op.or]: { user_id: userId, admin_id: userId } } : {};
      return await trip.findAll({ where, attributes: ["id", "ar_name", "en_name", "from"], raw: true });
    } catch (error) {
      throw error;
    }
  }
}
