import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import destination from "../../models/destination.model";
import { ModulesController } from "../dashboard/modules.controller";
import { MediaController } from "../dashboard/media.controller";
export class DestinationController {
  constructor() {}
  public async listPage(req: Request, res: Response, next: NextFunction) {
    const module_id = await new ModulesController().getModuleIdByName("Destinations Management");
    return res.render("website/views/destinations/list.ejs", { title: "Destination", module_id });
  }
  public async list(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const limit = Number(req.query.limit) > 20 ? 20 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const destinations = await destination.findAll({ limit, offset, attributes: ["id", "ar_title", "en_title", "image"] }) || [];
      const countDestinations = await destination.count() || 0;
      const lang = req.query && req.query.lang === "ar" ? "ar" : "en";
      const data = destinations.map((destination) => { return { id: destination["id"], image: destination["image"], title: destination[`${lang}_title`] }; });
      const dataInti = { total: countDestinations, limit, page: Number(req.query.page), pages: Math.ceil(countDestinations / limit) + 1, data };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting destinations list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination", err: "unexpected error" });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Management");
      const dest = await destination.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const lang = req["lang"] === "ar" ? "ar" : "en";
      const albums = await new MediaController().getAllMedia(module_id, dest["id"]);
      const data = {
        id: dest["id"],
        image: dest["image"],
        file: dest["file"],
        location_lat: dest["location_lat"],
        location_long: dest["location_long"],
        title: dest[`${lang}_title`],
        description: dest[`${lang}_description`],
        when_visit: dest[`${lang}_when_visit`],
        what_wear: dest[`${lang}_what_wear`],
        trans_desc: dest[`${lang}_trans_desc`],
        travel_regulation: dest[`${lang}_travel_regulation`],
        images: albums.images,
        videos: albums.videos,
      };
      return res.render("website/views/destinations/view.ejs", { title: "View Destination Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination data in view page", err: "unexpected error" });
    }
  }
  public async getAllDestinations() {
    try {
      const destinations = await destination.findAll({ attributes: ["id", "ar_title", "en_title"] });
      return destinations;
    } catch (error) {
      throw error;
    }
  }
}
