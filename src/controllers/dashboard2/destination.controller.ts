import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import destination from "../../models/destination.model";
import modules from "../../models/module.model";
import page from "../../models/page.model";
import permissions from "../../models/permissions.model";
const { verify } = require("../../helper/token");
export class DestinationController {
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard2/views/destination/list.ejs", { title: "Destination" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const destinations = await destination.findAll({ limit, offset, attributes: { exclude: ["country_id", "updatedAt"] } });
      if (!destinations.length) return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting destinations", msg: "not found destinations" });
      const countDestinations = await destination.count();
      if (!countDestinations) return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while counting destinations", msg: "not found destinations" });
      const payload = verify(req.cookies.token);
      const isHighestAdmin = payload.role_id === "0";
      let userPermissions, canEdit = true, canAdd = true;
      if (!isHighestAdmin) {
        userPermissions = await permissions.findAll({
          where: { role_id: payload.role_id },
          attributes: { exclude: ["role_id", "page_id", "createdAt", "updatedAt"] },
          include: [{ model: page, attributes: ["type"], include: [{ model: modules, attributes: ["name"] }] }],
        });
        canEdit = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Edit" && per["tbl_page"]["tbl_module"]["name"] === "Destinations Management").length;
        canAdd = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Add" && per["tbl_page"]["tbl_module"]["name"] === "Destinations Management").length;
      }
      const dataInti = { total: countDestinations, limit: limit, page: Number(req.query.page), pages: Math.ceil(countDestinations / limit), data: destinations, canAdd, canEdit };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting destinations list", msg: "Internal Server Error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard2/views/destination/new.ejs", { title: "Destination new" });
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_title || !req.body.en_title || !req.body.location_lat || !req.body.location_long || !req.files;
      const areNotNumbers = !Number(req.body.location_lat) || !Number(req.body.location_long);
      if (areNull || areNotNumbers) return res.status(400).json({ msg: "Error in create new destination", err: "unexpected error" });
      await destination.create(req.body);
      return res.status(httpStatus.OK).json({ msg: "new destination created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new destination", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination", err: "unexpected error" });
      const data = await destination.findOne({ where: { id: req.params.id }, attributes: ["country_id", "ar_name", "en_name", "code"], raw: true });
      return res.render("dashboard2/views/destination/edit.ejs", { title: "Edit Destination", data });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_title || !req.body.en_title || !req.body.location_lat || !req.body.location_long || !req.files;
      const areNotNumbers = !Number(req.body.location_lat) || !Number(req.body.location_long);
      if (!req.params.id || areNull || areNotNumbers) return res.status(400).json({ msg: "Error in update destination", err: "unexpected error" });
      await destination.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "destination edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit destination", err: "unexpected error" });
    }
  }
}
