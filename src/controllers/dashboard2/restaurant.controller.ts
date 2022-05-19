import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import destination from "../../models/destination.model";
import modules from "../../models/module.model";
import page from "../../models/page.model";
import permissions from "../../models/permissions.model";
import restaurant from "../../models/restaurant.model";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { DestinationController } from "./destination.controller";
const { verify } = require("../../helper/token");
export class RestaurantController {
  constructor(private destinationController?: DestinationController) {
    this.destinationController = this.destinationController ? this.destinationController : new DestinationController();
  }
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard2/views/restaurant/list.ejs", { title: "Restaurants" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const restaurants = await restaurant.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "logo", "status"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
      }) || [];
      const countRestaurants = await restaurant.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Destinations Restaurants");
      const dataInti = { total: countRestaurants, limit, page: Number(req.query.page), pages: Math.ceil(countRestaurants / limit) + 1, data: restaurants, canAdd: permissions.canAdd, canEdit: permissions.canEdit };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting restaurants list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting restaurant", err: "unexpected error" });
      const data = await restaurant.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
        raw: true,
      });
      return res.render("dashboard2/views/restaurant/view.ejs", { title: "View restaurant Details", data });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get restaurant data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await this.destinationController.getAllDestinations();
      return res.render("dashboard2/views/restaurant/new.ejs", { title: "restaurant new", destinations });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destinations or open new restaurant page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.files;
      const isNotNumber = !Number(req.body.destination_id);
      if (areNull || isNotNumber) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files.logo;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const createdRestaurant = await restaurant.create(req.body);
      if (createdRestaurant) {
        const fileDir: string = `destinations/restaurants/${createdRestaurant["id"]}/`
        const set = { logo: imgName ? `${fileDir}${imgName}` : null };
        const updatedDestinationPlace = await restaurant.update(set, { where: { id: createdRestaurant["id"] } });
        if (updatedDestinationPlace) {
          if (imgName && img) helpers.imageProcessing(fileDir, imgName, img["data"]);
          return res.status(httpStatus.OK).json({ msg: "New restaurant created" });
        }
      }
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new restaurant", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting restaurant", err: "unexpected error" });
      const destinations = await this.destinationController.getAllDestinations();
      const data = await restaurant.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      return res.render("dashboard2/views/restaurant/edit.ejs", { title: "Edit restaurant", data, destinations });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get restaurant data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files ? req.files.image : null;
      const payload = req.query.status ? { status: req.query.status } : req.body;
      const updatedDestinationStore = await restaurant.update(payload, { where: { id: req.params.id } });
      if (updatedDestinationStore && !req.query.status) {
        const foundDestinationStore = await restaurant.findOne({ where: { id: req.params.id }, attributes: ["logo"], raw: true });
        let imgName: string;
        if (img) {
          helpers.removeFile(foundDestinationStore["logo"]);
          imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        }
        const fileDir: string = `destinations/restaurants/${req.params.id}/`
        const set = { logo: `${fileDir}${imgName}` || fileDir + foundDestinationStore["logo"]};
        const updatedDestWithImages = await restaurant.update(set, { where: { id: req.params.id }});
        if (updatedDestWithImages) { if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]); }
      }
      return res.status(httpStatus.OK).json({ msg: "restaurant edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit restaurant", err: "unexpected error" });
    }
  }
}
