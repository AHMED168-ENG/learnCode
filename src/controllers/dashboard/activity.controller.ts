import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import destination from "../../models/destination.model";
import activity from "../../models/activity.model";
import { ActivityCategoryController } from "./activity-category.controller";
import { DestinationsController } from "./destination.controller";
import activityCategory from "../../models/activity-category.model";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { ModulesController } from "../dashboard/modules.controller";
export class ActivityController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/activity/list.ejs", { title: "Activities" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const activities = await activity.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "image", "status"] },
        include: [
          { model: destination, attributes: ["ar_title", "en_title"] },
          { model: activityCategory, attributes: ["ar_name", "en_name"] },
        ],
      }) || [];
      const countActivities = await activity.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Destinations Activities");
      const module_id = await new ModulesController().getModuleIdByName("Destinations Activities");
      const dataInti = { total: countActivities, limit, page: Number(req.query.page), pages: Math.ceil(countActivities / limit) + 1, data: activities, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting activities list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting activity", err: "unexpected error" });
      const data = await activity.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          { model: destination, attributes: ["ar_title", "en_title"] },
          { model: activityCategory, attributes: ["ar_name", "en_name"] },
        ],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Activities");
      return res.render("dashboard/views/activity/view.ejs", { title: "View activity Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get activity data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await new DestinationsController().getAllDestinations();
      const activityCategories = await new ActivityCategoryController().getAllActivityCategories();
      return res.render("dashboard/views/activity/new.ejs", { title: "activity new", destinations, activityCategories });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destinations or open new activity page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.files;
      const isNotNumber = !Number(req.body.destination_id);
      if (areNull || isNotNumber) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files.image;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const createdActivity = await activity.create(req.body);
      if (createdActivity) {
        const fileDir: string = `destinations/activities/${createdActivity["id"]}/`
        const set = { image: imgName ? `${fileDir}${imgName}` : null };
        const updatedActivity = await activity.update(set, { where: { id: createdActivity["id"] } });
        if (updatedActivity) {
          if (imgName && img) helpers.imageProcessing(fileDir, imgName, img["data"]);
          return res.status(httpStatus.OK).json({ msg: "New activity created" });
        }
      }
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new activity", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting activity", err: "unexpected error" });
      const destinations = await new DestinationsController().getAllDestinations();
      const activityCategories = await new ActivityCategoryController().getAllActivityCategories();
      const data = await activity.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Activities");
      return res.render("dashboard/views/activity/edit.ejs", { title: "Edit activity", data, destinations, activityCategories, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get activity data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files ? req.files.image : null;
      const payload = req.query.status ? { status: req.query.status } : req.body;
      const updatedActivity = await activity.update(payload, { where: { id: req.params.id } });
      if (updatedActivity && !req.query.status) {
        const foundActivity = await activity.findOne({ where: { id: req.params.id }, attributes: ["image"], raw: true });
        let imgName: string;
        if (img) {
          helpers.removeFile(foundActivity["image"]);
          imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        }
        const fileDir: string = `destinations/activities/${req.params.id}/`
        const set = { image: `${fileDir}${imgName}` || fileDir + foundActivity["image"]};
        const updatedActivityWithImages = await activity.update(set, { where: { id: req.params.id }});
        if (updatedActivityWithImages) { if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]); }
      }
      return res.status(httpStatus.OK).json({ msg: "activity edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit activity", err: "unexpected error" });
    }
  }
}
