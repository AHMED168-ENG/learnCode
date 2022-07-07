import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import destination from "../../models/destination.model";
import place from "../../models/destination_places.model";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { DestinationsController } from "./destination.controller";
export class DestinationPlaceController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/destination-places/list.ejs", { title: "Destination Places" });
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
      const dataInti = { total: countPlaces, limit, page: Number(req.query.page), pages: Math.ceil(countPlaces / limit) + 1, data: places, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit, module_id };
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
      return res.render("dashboard/views/destination-places/view.ejs", { title: "View Destination Place Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination place data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await new DestinationsController().getAllDestinations();
      return res.render("dashboard/views/destination-places/new.ejs", { title: "Destination Place new", destinations });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destinations or open new place page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.files;
      const isNotNumber = !Number(req.body.destination_id);
      if (areNull || isNotNumber) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files.image;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const createdDestinationPlace = await place.create(req.body);
      if (createdDestinationPlace) {
        const fileDir: string = `destinations/places/${createdDestinationPlace["id"]}/`
        const set = { image: imgName ? `${fileDir}${imgName}` : null };
        const updatedDestinationPlace = await place.update(set, { where: { id: createdDestinationPlace["id"] } });
        if (updatedDestinationPlace) {
          if (imgName && img) helpers.imageProcessing(fileDir, imgName, img["data"]);
          return res.status(httpStatus.OK).json({ msg: "New Destination Place created" });
        }
      }
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new destination place", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination place", err: "unexpected error" });
      const destinations = await new DestinationsController().getAllDestinations();
      const data = await place.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Most Popular Places");
      return res.render("dashboard/views/destination-places/edit.ejs", { title: "Edit Destination Place", data, destinations, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination place data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files ? req.files.image : null;
      const payload = req.query.status ? { status: req.query.status } : req.body;
      const updatedDestinationPlace = await place.update(payload, { where: { id: req.params.id } });
      if (updatedDestinationPlace && !req.query.status) {
        const foundDestinationPlace = await place.findOne({ where: { id: req.params.id }, attributes: ["image"], raw: true });
        let imgName: string;
        if (img) {
          helpers.removeFile(foundDestinationPlace["image"]);
          imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        }
        const fileDir: string = `destinations/places/${req.params.id}/`
        const set = { image: `${fileDir}${imgName}` || fileDir + foundDestinationPlace["image"] };
        const updatedDestWithImages = await place.update(set, { where: { id: req.params.id }});
        if (updatedDestWithImages) { if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]); }
      }
      return res.status(httpStatus.OK).json({ msg: "destination place edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit destination place", err: "unexpected error" });
    }
  }
}
