import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import destination from "../../models/destination.model";
import hotel from "../../models/hotel.model";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { DestinationsController } from "./destination.controller";
export class HotelController {
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/hotel/list.ejs", { title: "Hotels" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const hotels = await hotel.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "logo"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
      }) || [];
      const countHotels = await hotel.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Destinations Hotels");
      const module_id = await new ModulesController().getModuleIdByName("Destinations Hotels");
      const dataInti = { total: countHotels, limit, page: Number(req.query.page), pages: Math.ceil(countHotels / limit) + 1, data: hotels, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      console.log(error)
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting hotels list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting hotel", err: "unexpected error" });
      const data = await hotel.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Hotels");
      return res.render("dashboard/views/hotel/view.ejs", { title: "View hotel Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get hotel data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await new DestinationsController().getAllDestinations();
      return res.render("dashboard/views/hotel/new.ejs", { title: "hotel new", destinations });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destinations or open new hotel page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.files;
      const isNotNumber = !Number(req.body.destination_id);
      if (areNull || isNotNumber) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files.logo;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const createdHotel = await hotel.create(req.body);
      if (createdHotel) {
        const fileDir: string = `destinations/hotels/${createdHotel["id"]}/`
        const set = { logo: imgName ? `${fileDir}${imgName}` : null };
        const updatedHotel = await hotel.update(set, { where: { id: createdHotel["id"] } });
        if (updatedHotel) {
          if (imgName && img) helpers.imageProcessing(fileDir, imgName, img["data"]);
          return res.status(httpStatus.OK).json({ msg: "New hotel created" });
        }
      }
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new hotel", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting hotel", err: "unexpected error" });
      const destinations = await new DestinationsController().getAllDestinations();
      const data = await hotel.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Hotels");
      return res.render("dashboard/views/hotel/edit.ejs", { title: "Edit hotel", data, destinations, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get hotel data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files ? req.files.image : null;
      const updatedHotel = await hotel.update(req.body, { where: { id: req.params.id } });
      if (updatedHotel && !req.query.status) {
        const foundHotel = await hotel.findOne({ where: { id: req.params.id }, attributes: ["logo"], raw: true });
        let imgName: string;
        if (img) {
          helpers.removeFile(foundHotel["logo"]);
          imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        }
        const fileDir: string = `destinations/hotels/${req.params.id}/`
        const set = { logo: `${fileDir}${imgName}` || fileDir + foundHotel["logo"]};
        const updatedHotelWithImages = await hotel.update(set, { where: { id: req.params.id }});
        if (updatedHotelWithImages) { if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]); }
      }
      return res.status(httpStatus.OK).json({ msg: "hotel edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit hotel", err: "unexpected error" });
    }
  }
}
