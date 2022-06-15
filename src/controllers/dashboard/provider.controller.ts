import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import destination from "../../models/destination.model";
import provider from "../../models/provider.model";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { DestinationController } from "./destination.controller";
export class ProviderController {
  constructor(private destinationController?: DestinationController) {
    this.destinationController = this.destinationController ? this.destinationController : new DestinationController();
  }
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/provider/list.ejs", { title: "Providers" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const providers = await provider.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "logo"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
      }) || [];
      const countProviders = await provider.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Providers Management");
      const module_id = await new ModulesController().getModuleIdByName("Providers Management");
      const dataInti = { total: countProviders, limit, page: Number(req.query.page), pages: Math.ceil(countProviders / limit) + 1, data: providers, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting providers list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting provider", err: "unexpected error" });
      const data = await provider.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Providers Management");
      return res.render("dashboard/views/provider/view.ejs", { title: "View provider Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get provider data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await new DestinationController().getAllDestinations();
      return res.render("dashboard/views/provider/new.ejs", { title: "provider new", destinations });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destinations or open new provider page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.files;
      const isNotNumber = !Number(req.body.destination_id);
      if (areNull || isNotNumber) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files.logo;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const createdProvider = await provider.create(req.body);
      if (createdProvider) {
        const fileDir: string = `providers/${createdProvider["id"]}/`
        const set = { logo: imgName ? `${fileDir}${imgName}` : null };
        const updatedProvider = await provider.update(set, { where: { id: createdProvider["id"] } });
        if (updatedProvider) {
          if (imgName && img) helpers.imageProcessing(fileDir, imgName, img["data"]);
          return res.status(httpStatus.OK).json({ msg: "New provider created" });
        }
      }
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new provider", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting provider", err: "unexpected error" });
      const destinations = await new DestinationController().getAllDestinations();
      const data = await provider.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Providers Management");
      return res.render("dashboard/views/provider/edit.ejs", { title: "Edit provider", data, destinations, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get provider data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files ? req.files.logo : null;
      const updatedProvider = await provider.update(req.body, { where: { id: req.params.id } });
      if (updatedProvider && !req.query.status) {
        const foundProvider = await provider.findOne({ where: { id: req.params.id }, attributes: ["logo"], raw: true });
        let imgName: string;
        if (img) {
          helpers.removeFile(foundProvider["logo"]);
          imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        }
        const fileDir: string = `providers/${req.params.id}/`
        const set = { logo: `${fileDir}${imgName}` || fileDir + foundProvider["logo"] };
        const updatedProviderWithImages = await provider.update(set, { where: { id: req.params.id }});
        if (updatedProviderWithImages) { if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]); }
      }
      return res.status(httpStatus.OK).json({ msg: "provider edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit provider", err: "unexpected error" });
    }
  }
  public async getAllProviders() {
    try {
      return await provider.findAll({ attributes: ["id", "ar_name", "en_name"] });
    } catch (error) {
      throw error;
    }
  }
}
