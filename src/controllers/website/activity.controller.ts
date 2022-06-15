import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import destination from "../../models/destination.model";
import activity from "../../models/activity.model";
import { ActivityCategoryController } from "./activity-category.controller";
import activityCategory from "../../models/activity-category.model";
import { ModulesController } from "../dashboard/modules.controller";
import { Op } from "sequelize";
import { MediaController } from "../dashboard/media.controller";
export class ActivityController {
  constructor() {}
  public async listPage(req: Request, res: Response, next: NextFunction) {
    const categories = await new ActivityCategoryController().getAllActivityCategories();
    return res.render("website/views/activity/list.ejs", { title: "Activities", categories, activity_category_id: req.query.category, destination_id: req.query.destination_id });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const where = req.query.destination_id ? { destination_id: req.query.destination_id } : {};
      const activities = await activity.findAll({
        limit,
        offset,
        where,
        attributes: { include: ["id", "ar_name", "en_name", "image"] },
        include: [{ model: activityCategory, attributes: ["ar_name", "en_name"] }],
      }) || [];
      const countActivities = await activity.count() || 0;
      const lang = req.query && req.query.lang === "ar" ? "ar" : "en";
      const data = activities.map((act) => { return { id: act["id"], image: act["image"], name: act[`${lang}_name`], category: act["tbl_activity_category"][`${lang}_name`] }; });
      const dataInti = { total: countActivities, limit, page: Number(req.query.page), pages: Math.ceil(countActivities / limit) + 1, data };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting activities list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting activity", err: "unexpected error" });
      const activityData = await activity.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          { model: activityCategory, attributes: ["ar_name", "en_name"] },
          { model: destination, attributes: ["location_lat", "location_long"] }
        ],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Activities");
      const albums = await new MediaController().getAllMedia(module_id, activityData["id"]);
      const relatedActivities = await new ActivityController().getRelatedActivities(activityData["destination_id"], activityData["id"]);
      const lang = req["lang"] === "ar" ? "ar" : "en";
      const data = {
        id: activityData["id"],
        image: activityData["image"],
        name: activityData[`${lang}_name`],
        description: activityData[`${lang}_description`],
        category: activityData[`tbl_activity_category.${lang}_name`],
        lat: activityData[`tbl_destination.location_lat`],
        long: activityData[`tbl_destination.location_long`],
        activities: relatedActivities,
        images: albums.images,
        videos: albums.videos,
      };
      return res.render("website/views/activity/view.ejs", { title: "View activity Details", data });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get activity data in view page", err: "unexpected error" });
    }
  }
  public async getAllActivities(lang: string) {
    try {
      const activities = await activity.findAll({ attributes: ["id", `${lang}_name`, "image"], include: [{ model: activityCategory, attributes: [`${lang}_name`] }] });
      return activities.map((act) => { return { id: act["id"], name: act[`${lang}_name`], image: act["image"], category: act["tbl_activity_category"][`${lang}_name`] } });;
    } catch (error) {
      throw error;
    }
  }
  private async getRelatedActivities(destination_id: string, activity_id: string) {
    try {
      return await activity.findAll({ where: { [Op.and]: { destination_id, id: { [Op.ne]: activity_id } } }, attributes: ["id", "ar_name", "en_name"] });
    } catch (error) {
      throw error;
    }
  }
}
