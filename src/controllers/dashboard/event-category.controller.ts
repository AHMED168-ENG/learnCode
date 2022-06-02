import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import eventCategory from "../../models/event-category.model";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
export class EventCategoryController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/event-category/list.ejs", { title: "Event Categories" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const categories = await eventCategory.findAll({ limit, offset, attributes: { include: ["id", "ar_name", "en_name"] } }) || [];
      const countStores = await eventCategory.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Events Categories");
      const dataInti = { total: countStores, limit, page: Number(req.query.page), pages: Math.ceil(countStores / limit) + 1, data: categories, canAdd: permissions.canAdd, canEdit: permissions.canEdit };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting categories list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting event category", err: "unexpected error" });
      const data = await eventCategory.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      return res.render("dashboard/views/event-category/view.ejs", { title: "View Event Category Details", data });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get event category data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render("dashboard/views/event-category/new.ejs", { title: "event category new" });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destinations or open new store page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name;
      if (areNull) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await eventCategory.create(req.body);
      return res.status(httpStatus.OK).json({ msg: "New Event Category created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new event category", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting event category", err: "unexpected error" });
      const data = await eventCategory.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      return res.render("dashboard/views/event-category/edit.ejs", { title: "Edit event category", data });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get event category data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await eventCategory.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "event category edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit event category", err: "unexpected error" });
    }
  }
  public async getAllEventCategories() {
    try {
      const activityCategories = await eventCategory.findAll({ attributes: ["id", "ar_name", "en_name"] });
      return activityCategories;
    } catch (error) {
      throw error;
    }
  }
}
