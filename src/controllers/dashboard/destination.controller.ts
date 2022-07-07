import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import sequelize from "sequelize";
import path from "path";
import helpers from "../../helper/helpers";
import destination from "../../models/destination.model";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import city from "../../models/city.model";
import { CityController } from "./city.controller";
import { UserController } from "./user.controller";
export class DestinationsController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/destinations/list.ejs", { title: "Destination" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const destinations = await destination.findAll({
        limit,
        offset,
        attributes: ["id", "en_title", "ar_title", "image"],
        include: [{ model: city, attributes: ["ar_name", "en_name"] }],
        raw: true,
      }) || [];
      const countDestinations = await destination.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Destinations Management");
      const module_id = await new ModulesController().getModuleIdByName("Destinations Management");
      const dataInti = { total: countDestinations, limit, page: Number(req.query.page), pages: Math.ceil(countDestinations / limit) + 1, data: destinations, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting destinations list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination", err: "unexpected error" });
      const data = await destination.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: city, attributes: ["ar_name", "en_name"] }],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Management");
      return res.render("dashboard/views/destinations/view.ejs", { title: "View Destination Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    const citiesData = await new CityController().listCity();
    const cities = citiesData.map((cityData) => { return { id: cityData.city_id, name: `${cityData.en_name} - ${cityData.ar_name}` }; });
    return res.render("dashboard/views/destinations/new.ejs", { title: "Destination new", cities });
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_title || !req.body.en_title || !req.files;
      const areNotNumbers = !Number(req.body.location_lat) || !Number(req.body.location_long);
      if (areNull || areNotNumbers) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files.image;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const file = req.files.file;
      const fileName: string = file ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(file["name"])}` : null;
      const createdDestination = await destination.create(req.body);
      if (createdDestination) {
        const fileDir: string = `destinations/${createdDestination["id"]}/`
        const set = { image: imgName ? `${fileDir}${imgName}` : null, file: fileName ? `${fileDir}${fileName}` : null };
        const updatedDestination = await destination.update(set, { where: { id: createdDestination["id"] } });
        if (updatedDestination) {
          if (imgName && img) helpers.imageProcessing(fileDir, imgName, img["data"]);
          if (fileName && file) helpers.imageProcessing(fileDir, fileName, file["data"]);
          return res.status(httpStatus.OK).json({ msg: "New Destination created" });
        }
      }
      return res.status(httpStatus.OK).json({ msg: "new destination created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new destination", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination", err: "unexpected error" });
      const data = await destination.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Management");
      const citiesData = await new CityController().listCity();
      const cities = citiesData.map((cityData) => { return { id: cityData.city_id, name: `${cityData.en_name} - ${cityData.ar_name}` }; });
      return res.render("dashboard/views/destinations/edit.ejs", { title: "Edit Destination", data, cities, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files ? req.files.image : null;
      const file = req.files ? req.files.file : null;
      const updatedDestination = await destination.update(req.body, { where: { id: req.params.id } });
      if (updatedDestination) {
        const foundDestination = await destination.findOne({ where: { id: req.params.id }, attributes: ["image", "file"], raw: true });
        let fileName: string, imgName: string;
        if (img) {
          helpers.removeFile(foundDestination["image"]);
          imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        }
        if (file) {
          helpers.removeFile(foundDestination["file"]);
          fileName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(file["name"])}`
        }
        const fileDir: string = `destinations/${req.params.id}/`;
        const set = { image: `${fileDir}${imgName}` || fileDir + foundDestination["image"], file: `${fileDir}${fileName}` || fileDir + foundDestination["file"]};
        const updatedDestWithImages = await destination.update(set, { where: { id: req.params.id }});
        if (updatedDestWithImages) {
          if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]);
          if (file && fileName) helpers.imageProcessing(fileDir, fileName, file["data"]);
        }
      }
      return res.status(httpStatus.OK).json({ msg: "destination edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit destination", err: "unexpected error" });
    }
  }
  public async getAllDestinations(query?: string) {
    try {
      const where = query ? { id: Number(query) } : {};
      const destinations = await destination.findAll({ where, attributes: ["id", "ar_title", "en_title"], raw: true });
      return destinations;
    } catch (error) {
      throw error;
    }
  }
  public async countAllRelatedToDestination(id: number) {
    try {
      const filterQuery = `destination_id="${id}"`;
      const data = await destination.findOne({
        attributes: [
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM tbl_events WHERE ${filterQuery})`), "events"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM tbl_activities WHERE ${filterQuery})`), "activities"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM tbl_trips WHERE ${filterQuery})`), "trips"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM tbl_packages WHERE ${filterQuery})`), "packages"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM tbl_providers WHERE ${filterQuery})`), "providers"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM tbl_stores WHERE ${filterQuery})`), "stores"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM tbl_restaurants WHERE ${filterQuery})`), "restaurants"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM tbl_memberships WHERE ${filterQuery})`), "memberships"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM tbl_destination_stores WHERE ${filterQuery})`), "destination stores"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM tbl_destination_places WHERE ${filterQuery})`), "destination places"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM tbl_hotels WHERE ${filterQuery})`), "hotels"],
        ],
        raw: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async findAndCountAllRegisteredUsersWithDestinations(from?: any, to?: any) {
    try {
      const destinations = await destination.findAll({});
      const mappedDestinations = destinations.map((destinationData) => { return { id: destinationData["id"], name: `${destinationData["en_title"]} - ${destinationData["ar_title"]}`, city: destinationData["city_id"] }; });
      const usersWithDestinations = await new UserController().getAllUsers(from, to);
      const response = [];
      for (const mappedDestination of mappedDestinations) {
        const filteredUsers = usersWithDestinations.filter((user) => mappedDestination.city === user["city_id"]);
        response.push({ id: mappedDestination.id, name: mappedDestination.name, users: filteredUsers });
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}
