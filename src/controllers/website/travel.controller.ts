import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import essentials from "../../models/travel.model";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
export class TravelController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("website/views/travel/list.ejs", { title: "Travel Essentials" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await essentials.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } }) || [];
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Travel Essentials");
      const dataInti = { data, canAdd: permissions.canAdd, canEdit: permissions.canEdit };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting travel essentials list", msg: "Internal Server Error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render("website/views/travel/new.ejs", { title: "travel essentials new" });
    } catch (error) {
      return res.status(500).json({ msg: "Can't open new store page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.body.ar_text || !req.body.en_text;
      if (areNull) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await essentials.create(req.body);
      return res.status(httpStatus.OK).json({ msg: "New Travel Essentials created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new travel essentials", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting travel essentials", err: "unexpected error" });
      const data = await essentials.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      return res.render("website/views/travel/edit.ejs", { title: "Edit travel essentials", data });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get travel essentials data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await essentials.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "travel essentials edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit travel essentials", err: "unexpected error" });
    }
  }
}
