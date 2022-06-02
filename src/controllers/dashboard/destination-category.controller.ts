import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import activityCategory from "../../models/activity-category.model";
import destinationCategory from "../../models/destination-category.model";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
export class DestinationCategoryController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/destination-category/list.ejs", { title: "Destination Interest Categories" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const categories = await destinationCategory.findAll({ limit, offset, attributes: { include: ["id", "ar_name", "en_name"] } }) || [];
      const countCategories = await destinationCategory.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Destinations Interests categories");
      const dataInti = { total: countCategories, limit, page: Number(req.query.page), pages: Math.ceil(countCategories / limit) + 1, data: categories, canAdd: permissions.canAdd, canEdit: permissions.canEdit };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting categories list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination category", err: "unexpected error" });
      const data = await destinationCategory.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      return res.render("dashboard/views/destination-category/view.ejs", { title: "View Destination Interest Category Details", data });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination category data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render("dashboard/views/destination-category/new.ejs", { title: "destination category new" });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destinations or open new store page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name;
      if (areNull) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await destinationCategory.create(req.body);
      return res.status(httpStatus.OK).json({ msg: "New Destination Interest Category created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new destination category", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination category", err: "unexpected error" });
      const data = await destinationCategory.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      return res.render("dashboard/views/destination-category/edit.ejs", { title: "Edit destination category", data });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination category data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await destinationCategory.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "destination category edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit destination category", err: "unexpected error" });
    }
  }
  public async getAllActivityCategories() {
    try {
      const activityCategories = await destinationCategory.findAll({ attributes: ["id", "ar_name", "en_name"] });
      return activityCategories;
    } catch (error) {
      throw error;
    }
  }
}
