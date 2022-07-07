import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import destination from "../../models/destination.model";
import { ModulesController } from "../dashboard/modules.controller";
import { MediaController } from "../dashboard/media.controller";
import { ActivityController } from "./activity.controller";
import { DestinationPlaceController } from "./destination-place.controller";
import { RestaurantController } from "./restaurant.controller";
import { HotelController } from "./hotel.controller";
import { DestinationStoreController } from "./destination-store.controller";
import { PackageController } from "./package.controller";
import { Op } from "sequelize";
import { DestinationTransportationController } from "../dashboard/destination-transportation.controller";
import { FavouriteController } from "./favourite.controller";
import { ItemCatgeory } from "../../enums/item-category.enum";
import city from "../../models/city.model";
import { UserController } from "../dashboard/user.controller";
const { verify } = require("../../helper/token");
export class DestinationController {
  constructor() {}
  public async listPage(req: Request, res: Response, next: NextFunction) {
    const module_id = await new ModulesController().getModuleIdByName("Destinations Management");
    return res.render("website/views/destinations/list.ejs", { title: "Destination", module_id });
  }
  public async list(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const limit = Number(req.query.limit) > 20 ? 20 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const destinations = await destination.findAll({ limit, offset, attributes: ["id", "ar_title", "en_title", "image"] }) || [];
      const countDestinations = await destination.count() || 0;
      const lang = req.query && req.query.lang === "ar" ? "ar" : "en";
      const data = destinations.map((destination) => { return { id: destination["id"], image: destination["image"], title: destination[`${lang}_title`] }; });
      const payload = verify(req.cookies.token);
      const user = await new UserController().getUserByEmail(payload.email);
      let favourites;
      if (user) favourites = await new FavouriteController().getFavourites(ItemCatgeory.destination, payload.user_id, payload.user_type);
      const dataInti = { total: countDestinations, limit, page: Number(req.query.page), pages: Math.ceil(countDestinations / limit) + 1, data, favourites, user };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting destinations list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination", err: "unexpected error" });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Management");
      const dest = await destination.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: city, attributes: ["ar_name", "en_name"] }],
        raw: true,
      });
      const where = {
        [Op.and]: [
          { id: { [Op.ne]: req.params.id } },
          { location_lat: { [Op.gte]: dest["location_lat"] - 0.25 } },
          { location_lat: { [Op.lte]: dest["location_lat"] + 0.25 } },
          { location_long: { [Op.gte]: dest["location_long"] - 0.25 } },
          { location_long: { [Op.lte]: dest["location_long"] + 0.25 } },
        ],
      };
      const nearDestinations = await new DestinationController().getAllDestinations(where);
      const lang = req["lang"] === "ar" ? "ar" : "en";
      const albums = module_id ? await new MediaController().getAllMedia(module_id, dest["id"]) : undefined;
      const activities = await new ActivityController().getAllActivities(lang, dest["id"]);
      const places = await new DestinationPlaceController().getAllDestinationPlaces(lang, dest["id"]);
      const restaurants = await new RestaurantController().getAllDestinationRestaurants(lang, dest["id"]);
      const hotels = await new HotelController().getAllDestinationHotels(lang, dest["id"]);
      const destinationStores = await new DestinationStoreController().getAllDestinationStores(lang, dest["id"]);
      const packages = await new PackageController().getAllDestinationPackages(lang, dest["id"]);
      const transportations = await new DestinationController().getCityTransportations(dest["city_id"]);
      const payload = verify(req.cookies.token);
      const user = await new UserController().getUserByEmail(payload.email);
      let favourite, favourites;
      if (user) {
        favourite = await new FavouriteController().getFavourite(payload.user_id, dest["id"], payload.user_type, ItemCatgeory.destination);
        favourites = await new FavouriteController().getAllFavourites(payload.user_id, payload.user_type);
      }
      // const city = await helpers.getCityLocation(dest["location_lat"], dest["location_long"]);
      const data = {
        id: dest["id"],
        image: dest["image"],
        city: { id: dest["city_id"], name: dest[`tbl_city.${lang}_name`] },
        file: dest["file"],
        location_lat: dest["location_lat"],
        location_long: dest["location_long"],
        title: dest[`${lang}_title`],
        description: dest[`${lang}_description`],
        when_visit: dest[`${lang}_when_visit`],
        what_wear: dest[`${lang}_what_wear`],
        trans_desc: dest[`${lang}_trans_desc`],
        travel_regulation: dest[`${lang}_travel_regulation`],
        images: albums?.images,
        videos: albums?.videos,
        activities,
        places,
        restaurants,
        hotels,
        destinationStores,
        packages,
        nearDestinations,
        transportations,
        favourites,
        favourite,
        user,
      };
      return res.render("website/views/destinations/view.ejs", { title: "View Destination Details", data, module_id });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Error in get destination data in view page", err: "unexpected error" });
    }
  }
  public async getAllDestinations(where: any = {}) {
    try {
      const destinations = await destination.findAll({ where, attributes: ["id", "ar_title", "en_title"], raw: true });
      return destinations;
    } catch (error) {
      throw error;
    }
  }
  public async getAllDestinationTransportations(destinationIds: number[]) {
    try {
      const destTrans = await new DestinationTransportationController().getAllDestinationTransportations(destinationIds);
      const data = destTrans.map((dt) => { return { id: dt["tbl_transportation.id"], name: dt["tbl_transportation.name"], type: dt["tbl_transportation.type"] }; });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async getCityTransportations(city_id: number) {
    try {
      const destinationsCity = await destination.findAll({ where: { city_id }, attributes: ["id"], raw: true }) || [];
      const destinationsIds = destinationsCity.map((destinationCity) => { return destinationCity["id"]; });
      return await new DestinationController().getAllDestinationTransportations(destinationsIds);
    } catch (error) {
      throw error;
    }
  }
}
