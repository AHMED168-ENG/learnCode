import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import destination from "../../models/destination.model";
import destinationStore from "../../models/destination_stores.model";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { DestinationController } from "./destination.controller";
export class DestinationStoreController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard2/views/destination-stores/list.ejs", { title: "Destination Stores" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const stores = await destinationStore.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "logo", "status"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
      }) || [];
      const countStores = await destinationStore.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Destinations Stores Management");
      const module_id = await new ModulesController().getModuleIdByName("Destinations Stores Management");
      const dataInti = { total: countStores, limit, page: Number(req.query.page), pages: Math.ceil(countStores / limit) + 1, data: stores, canAdd: permissions.canAdd, canEdit: permissions.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting stores list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination store", err: "unexpected error" });
      const data = await destinationStore.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Stores Management");
      return res.render("dashboard2/views/destination-stores/view.ejs", { title: "View Destination store Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination store data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await new DestinationController().getAllDestinations();
      return res.render("dashboard2/views/destination-stores/new.ejs", { title: "Destination store new", destinations });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destinations or open new store page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.files;
      const isNotNumber = !Number(req.body.destination_id);
      if (areNull || isNotNumber) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files.logo;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const createdDestinationPlace = await destinationStore.create(req.body);
      if (createdDestinationPlace) {
        const fileDir: string = `destinations/stores/${createdDestinationPlace["id"]}/`
        const set = { logo: imgName ? `${fileDir}${imgName}` : null };
        const updatedDestinationPlace = await destinationStore.update(set, { where: { id: createdDestinationPlace["id"] } });
        if (updatedDestinationPlace) {
          if (imgName && img) helpers.imageProcessing(fileDir, imgName, img["data"]);
          return res.status(httpStatus.OK).json({ msg: "New Destination Store created" });
        }
      }
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new destination store", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination store", err: "unexpected error" });
      const destinations = await new DestinationController().getAllDestinations();
      const data = await destinationStore.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Stores Management");
      return res.render("dashboard2/views/destination-stores/edit.ejs", { title: "Edit Destination store", data, destinations, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination store data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files ? req.files.logo : null;
      const payload = req.query.status ? { status: req.query.status } : req.body;
      const updatedDestinationStore = await destinationStore.update(payload, { where: { id: req.params.id } });
      if (updatedDestinationStore && !req.query.status) {
        const foundDestinationStore = await destinationStore.findOne({ where: { id: req.params.id }, attributes: ["logo"], raw: true });
        let imgName: string;
        if (img) {
          helpers.removeFile(foundDestinationStore["logo"]);
          imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        }
        const fileDir: string = `destinations/stores/${req.params.id}/`
        const set = { logo: `${fileDir}${imgName}` || fileDir + foundDestinationStore["logo"] };
        const updatedDestWithImages = await destinationStore.update(set, { where: { id: req.params.id }});
        if (updatedDestWithImages) { if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]); }
      }
      return res.status(httpStatus.OK).json({ msg: "destination store edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit destination store", err: "unexpected error" });
    }
  }
}
