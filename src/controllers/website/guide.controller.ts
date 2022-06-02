import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import city from "../../models/city.model";
import guide from "../../models/guide.model";
import { CityController } from "../dashboard/city.controller";
import bcrypt from "bcrypt";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { ModulesController } from "../dashboard/modules.controller";
export class TourGuideController {
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("website/views/guide/list.ejs", { title: "Tour Guide" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const tourGuides = await guide.findAll({
        limit,
        offset,
        attributes: { exclude: ["ar_description", "en_description", "createdAt", "updatedAt", "password", "file", "city_id"] },
        include: [{ model: city, attributes: ["ar_name", "en_name"] }],
      }) || [];
      const countGuides = await guide.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Tourist Guide Management");
      const module_id = await new ModulesController().getModuleIdByName("Tourist Guide Management");
      const dataInti = { total: countGuides, limit, page: Number(req.query.page), pages: Math.ceil(countGuides / limit) + 1, data: tourGuides, canAdd: permissions.canAdd, canEdit: permissions.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      console.log(error)
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting tourGuides list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting tour guide", err: "unexpected error" });
      const data = await guide.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        include: [{ model: city, attributes: ["ar_name", "en_name"] }],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Tourist Guide Management");
      return res.render("website/views/guide/view.ejs", { title: "View Tour Guide Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get tour guide data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const cities = await new CityController().listCity();
      return res.render("website/views/guide/new.ejs", { title: "Tour Guide new", cities });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get tour guide new page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.name || !req.body.phone || !req.body.email || !req.body.password || !req.body.gender || !req.files;
      const areNotNumbers = !Number(req.body.city_id);
      if (areNull || areNotNumbers || !helpers.regularExprEmail(req.body.email)) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const existedGuide = await guide.findOne({ where: { email: req.body.email } });
      if (existedGuide) return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "This email is already exists" });
      const password = await bcrypt.hash(req.body.password, 10);
      const existedGuideWithPass = await guide.findOne({ where: { password } });
      if (existedGuideWithPass) return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "This password is already exists" });
      const img = req.files.image;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const file = req.files.file;
      const fileName: string = file ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(file["name"])}` : null;
      const createdGuide = await guide.create(req.body);
      if (createdGuide) {
        const fileDir: string = `tourGuides/${createdGuide["id"]}/`
        const set = { image: imgName ? `${fileDir}${imgName}` : null, file: fileName ? `${fileDir}${fileName}` : null };
        const updatedGuide = await guide.update(set, { where: { id: createdGuide["id"] } });
        if (updatedGuide) {
          if (imgName && img) helpers.imageProcessing(fileDir, imgName, img["data"]);
          if (fileName && file) helpers.imageProcessing(fileDir, fileName, file["data"]);
          return res.status(httpStatus.OK).json({ msg: "New Tour Guide created" });
        }
      }
      return res.status(httpStatus.OK).json({ msg: "new tour guide created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new tour guide", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting tour guide", err: "unexpected error" });
      const data = await guide.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const cities = await new CityController().listCity();
      const module_id = await new ModulesController().getModuleIdByName("Tourist Guide Management");
      return res.render("website/views/guide/edit.ejs", { title: "Edit Tour Guide", data, cities, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get tour guide data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id || (req.body.email && !helpers.regularExprEmail(req.body.email))) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      if (req.body.email) {
        const existedGuide = await guide.findOne({ where: { email: req.body.email } });
        if (existedGuide) return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "This email is already exists" });
      }
      if (req.body.password) {
        const password = await bcrypt.hash(req.body.password, 10);
        const existedGuideWithPass = await guide.findOne({ where: { password } });
        if (existedGuideWithPass) return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "This password is already exists" });
      }
      const img = req.files ? req.files.image : null;
      const file = req.files ? req.files.file : null;
      const payload = req.query.status ? { status: req.query.status } : req.body;
      const updatedGuide = await guide.update(payload, { where: { id: req.params.id } });
      if (updatedGuide) {
        const foundDestination = await guide.findOne({ where: { id: req.params.id }, attributes: ["image", "file"], raw: true });
        let fileName: string, imgName: string;
        if (img) {
          helpers.removeFile(foundDestination["image"]);
          imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        }
        if (file) {
          helpers.removeFile(foundDestination["file"]);
          fileName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(file["name"])}`
        }
        const fileDir: string = `tourGuides/${req.params.id}/`
        const set = { image: `${fileDir}${imgName}` || fileDir + foundDestination["image"], file: `${fileDir}${imgName}` || fileDir + foundDestination["file"]};
        const updatedDestWithImages = await guide.update(set, { where: { id: req.params.id }});
        if (updatedDestWithImages) {
          if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]);
          if (file && fileName) helpers.imageProcessing(fileDir, fileName, file["data"]);
        }
      }
      return res.status(httpStatus.OK).json({ msg: "tour guide edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit tour guide", err: "unexpected error" });
    }
  }
}
