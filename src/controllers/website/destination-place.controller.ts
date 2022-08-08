import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import destination from "../../models/destination.model";
import place from "../../models/destination_places.model";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { DestinationController } from "./destination.controller";
export class DestinationPlaceController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("website/views/destination-places/list.ejs", { title: "Destination Places" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const places = await place.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "image", "status"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
      }) || [];
      const countPlaces = await place.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Destinations Most Popular Places");
      const module_id = await new ModulesController().getModuleIdByName("Destinations Most Popular Places");
      const dataInti = { total: countPlaces, limit, page: Number(req.query.page), pages: Math.ceil(countPlaces / limit) + 1, data: places, canAdd: permissions.canAdd, canEdit: permissions.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting places list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination place", err: "unexpected error" });
      const data = await place.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Most Popular Places");
      return res.render("website/views/destination-places/view.ejs", { title: "View Destination Place Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination place data in view page", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination place", err: "unexpected error" });
      const destinations = await new DestinationController().getAllDestinations();
      const data = await place.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Most Popular Places");
      return res.render("website/views/destination-places/edit.ejs", { title: "Edit Destination Place", data, destinations, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination place data in edit page", err: "unexpected error" });
    }
  }
  public async getAllDestinationPlaces(lang: string, destination_id?: number) {
    try {
      const where = destination_id ? { destination_id } : {};
      const places = await place.findAll({ where, attributes: ["id", `${lang}_name`, "image"], raw: true });
      return places.map((placeData) => { return { id: placeData["id"], name: placeData[`${lang}_name`], image: placeData["image"] }; });
    } catch (error) {
      throw error;
    }
  }
}
