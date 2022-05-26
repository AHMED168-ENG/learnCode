import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import destination from "../../models/destination.model";
import packages from "../../models/package.model";
import provider from "../../models/provider.model";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { DestinationController } from "./destination.controller";
import { ProviderController } from "./provider.controller";
export class PackageController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard2/views/package/list.ejs", { title: "Packages" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const data = await packages.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "image", "status"] },
        include: [
          { model: destination, attributes: ["ar_title", "en_title"] },
          { model: provider, attributes: ["ar_name", "en_name"] },
        ],
      }) || [];
      const countStores = await packages.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Packages Management");
      const module_id = await new ModulesController().getModuleIdByName("Packages Management");
      const dataInti = { total: countStores, limit, page: Number(req.query.page), pages: Math.ceil(countStores / limit) + 1, data, canAdd: permissions.canAdd, canEdit: permissions.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting packages list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting package", err: "unexpected error" });
      const data = await packages.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          { model: destination, attributes: ["ar_title", "en_title"] },
          { model: provider, attributes: ["ar_name", "en_name"] },
        ],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Packages Management");
      return res.render("dashboard2/views/package/view.ejs", { title: "View Package Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get package data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await new DestinationController().getAllDestinations();
      const providers = await new ProviderController().getAllProviders();
      return res.render("dashboard2/views/package/new.ejs", { title: "Package new", destinations, providers });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destinations or open new package page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.files;
      const isNotNumber = !Number(req.body.destination_id);
      if (areNull || isNotNumber) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files.image;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const createdPackage = await packages.create(req.body);
      if (createdPackage) {
        const fileDir: string = `packages/${createdPackage["id"]}/`
        const set = { image: imgName ? `${fileDir}${imgName}` : null };
        const updatedPackage = await packages.update(set, { where: { id: createdPackage["id"] } });
        if (updatedPackage) {
          if (imgName && img) helpers.imageProcessing(fileDir, imgName, img["data"]);
          return res.status(httpStatus.OK).json({ msg: "New Package created" });
        }
      }
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new package", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting package", err: "unexpected error" });
      const destinations = await new DestinationController().getAllDestinations();
      const providers = await new ProviderController().getAllProviders();
      const data = await packages.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Packages Management");
      return res.render("dashboard2/views/package/edit.ejs", { title: "Edit Package", data, destinations, providers, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get package data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files ? req.files.image : null;
      const payload = req.query.status ? { status: req.query.status } : req.body;
      const updatedPackage = await packages.update(payload, { where: { id: req.params.id } });
      if (updatedPackage && !req.query.status) {
        const foundPackage = await packages.findOne({ where: { id: req.params.id }, attributes: ["image"], raw: true });
        let imgName: string;
        if (img) {
          helpers.removeFile(foundPackage["image"]);
          imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        }
        const fileDir: string = `packages/${req.params.id}/`
        const set = { image: `${fileDir}${imgName}` || fileDir + foundPackage["image"] };
        const updatedDestWithImages = await packages.update(set, { where: { id: req.params.id }});
        if (updatedDestWithImages) { if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]); }
      }
      return res.status(httpStatus.OK).json({ msg: "package edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit package", err: "unexpected error" });
    }
  }
}
