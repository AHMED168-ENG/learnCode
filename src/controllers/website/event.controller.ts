import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import destination from "../../models/destination.model";
import { DestinationController } from "./destination.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { ModulesController } from "../dashboard/modules.controller";
import city from "../../models/city.model";
import events from "../../models/event.model";
import { CityController } from "../dashboard/city.controller";
import eventCategory from "../../models/event-category.model";
import { EventCategoryController } from "./event-category.controller";
import audienceCategory from "../../models/audience-category.model";
import { AudienceCategoryController } from "./audience-category.controller";
import { Op } from "sequelize";
import { MediaController } from "../dashboard/media.controller";
const { verify } = require("../../helper/token");
export class EventController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("website/views/event/list.ejs", { title: "Events" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const data = await events.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "image", "status"] },
        include: [
          { model: destination, attributes: ["ar_title", "en_title"] },
          { model: eventCategory, attributes: ["ar_name", "en_name"] },
          { model: audienceCategory, attributes: ["ar_name", "en_name"] },
          { model: city, attributes: ["ar_name", "en_name"] },
        ],
      }) || [];
      const countEvents = await events.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Events Management");
      const module_id = await new ModulesController().getModuleIdByName("Events Management");
      const dataInti = { total: countEvents, limit, page: Number(req.query.page), pages: Math.ceil(countEvents / limit) + 1, data, canAdd: permissions.canAdd, canEdit: permissions.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting events list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting event", err: "unexpected error" });
      let data = await events.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          { model: destination, attributes: ["ar_title", "en_title"] },
          { model: eventCategory, attributes: ["ar_name", "en_name"] },
          { model: audienceCategory, attributes: ["ar_name", "en_name"] },
          { model: city, attributes: ["ar_name", "en_name"] },
        ],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Events Management");
      const album = await new MediaController().getAllMedia(module_id, data["id"]);
      data['from'] = helpers.getFullTime(data['from']);
      data['to'] = helpers.getFullTime(data['to']);
      return res.render("website/views/event/view.ejs", { title: "View event Details", data, images: album.images });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get event data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await new DestinationController().getAllDestinations();
      const eventCategories = await new EventCategoryController().getAllEventCategories();
      const cities = await new CityController().listCity();
      const audienceCategories = await new AudienceCategoryController().getAllAudienceCategories();
      return res.render("website/views/event/new.ejs", { title: "event new", destinations, eventCategories, audienceCategories, cities });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destinations or open new event page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.body.audience || !req.body.from || !req.body.to || !req.files;
      const isNotNumber = !Number(req.body.destination_id);
      if (areNull || isNotNumber) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files.image;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const createdEvent = await events.create(req.body);
      if (createdEvent) {
        const fileDir: string = `events/${createdEvent["id"]}/`
        const set = { image: imgName ? `${fileDir}${imgName}` : null };
        const updatedEvent = await events.update(set, { where: { id: createdEvent["id"] } });
        if (updatedEvent) {
          if (imgName && img) helpers.imageProcessing(fileDir, imgName, img["data"]);
          return res.status(httpStatus.OK).json({ msg: "New event created" });
        }
      }
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new event", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting event", err: "unexpected error" });
      const destinations = await new DestinationController().getAllDestinations();
      const eventCategories = await new EventCategoryController().getAllEventCategories();
      const audienceCategories = await new AudienceCategoryController().getAllAudienceCategories();
      const cities = await new CityController().listCity();
      const module_id = await new ModulesController().getModuleIdByName("Events Management");
      let data = await events.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      data['from'] = helpers.getFullTime(data['from']);
      data['to'] = helpers.getFullTime(data['to']);
      return res.render("website/views/event/edit.ejs", { title: "Edit event", data, destinations, eventCategories, audienceCategories, cities, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get event data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files ? req.files.image : null;
      const payload = req.query.status ? { status: req.query.status } : req.body;
      const updatedEvent = await events.update(payload, { where: { id: req.params.id } });
      if (updatedEvent && !req.query.status) {
        const foundEvent = await events.findOne({ where: { id: req.params.id }, attributes: ["image"], raw: true });
        let imgName: string;
        if (img) {
          helpers.removeFile(foundEvent["image"]);
          imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        }
        const fileDir: string = `events/${req.params.id}/`
        const set = { image: `${fileDir}${imgName}` || fileDir + foundEvent["image"]};
        const updatedEventWithImages = await events.update(set, { where: { id: req.params.id }});
        if (updatedEventWithImages) { if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]); }
      }
      return res.status(httpStatus.OK).json({ msg: "event edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit event", err: "unexpected error" });
    }
  }
  public async getCalendar(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = verify(req.cookies.token);
      const userId = payload.role_id !== process.env.admin_role ? payload.user_id : null;
      const data = await new EventController().getAllEvents(userId);
      return res.render("website/views/event/list.ejs", { title: "Calendar", data });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in getting calendar trips", err: "unexpected error" });
    }
  }
  public async getAllEvents(userId: number) {
    try {
      const where = userId ? { [Op.or]: { user_id: userId, admin_id: userId } } : {};
      return await events.findAll({ where, attributes: ["id", "ar_name", "en_name", "from"], raw: true });
    } catch (error) {
      throw error;
    }
  }
}
