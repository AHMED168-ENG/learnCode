import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import audienceCategory from "../../models/audience-category.model";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
export class AudienceCategoryController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/audience-category/list.ejs", { title: "Audience Categories" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const categories = await audienceCategory.findAll({ limit, offset, attributes: { exclude: ["createdAt", "updatedAt"] } }) || [];
      const countCategories = await audienceCategory.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Audience Categories");
      const dataInti = { total: countCategories, limit, page: Number(req.query.page), pages: Math.ceil(countCategories / limit) + 1, data: categories, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting categories list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting audience category", err: "unexpected error" });
      const data = await audienceCategory.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      return res.render("dashboard/views/audience-category/view.ejs", { title: "View Audience Category Details", data });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get audience category data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render("dashboard/views/audience-category/new.ejs", { title: "audience category new" });
    } catch (error) {
      return res.status(500).json({ msg: "Can't open new audience page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name;
      if (areNull) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await audienceCategory.create(req.body);
      return res.status(httpStatus.OK).json({ msg: "New Audience Category created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new audience category", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting audience category", err: "unexpected error" });
      const data = await audienceCategory.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      return res.render("dashboard/views/audience-category/edit.ejs", { title: "Edit audience category", data });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get audience category data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await audienceCategory.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "audience category edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit audience category", err: "unexpected error" });
    }
  }
  public async getAllAudienceCategories() {
    try {
      const audienceCategories = await audienceCategory.findAll({ attributes: ["id", "ar_name", "en_name"] });
      return audienceCategories;
    } catch (error) {
      throw error;
    }
  }
}
