import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Op } from "sequelize";
import { ItemCatgeory } from "../../enums/item-category.enum";
import favourite from "../../models/favourite.model";
import webAppsUsers from "../../models/user.model";
import { ActivityController } from "./activity.controller";
import { DestinationPlaceController } from "./destination-place.controller";
import { DestinationStoreController } from "./destination-store.controller";
import { DestinationController } from "./destination.controller";
import { EventController } from "./event.controller";
import { TourGuideController } from "./guide.controller";
import { HotelController } from "./hotel.controller";
import { MembershipController } from "./membership.controller";
import { PackageController } from "./package.controller";
import { RestaurantController } from "./restaurant.controller";
import { TripsController } from "./trip.controller";
const { verify } = require("../../helper/token");
export class FavouriteController {
  constructor() {}
  public async getMyFavourites(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const payload = verify(req.cookies.token);
      if (!payload.user_type) return res.status(httpStatus.UNAUTHORIZED).json({ msg: "unauthorized" });
      const myFavourites = await new FavouriteController().getAllFavourites(payload.user_id, payload.user_type);
      const lang = req["lang"] === "ar" ? "ar" : "en";
      const categories = myFavourites.map((fav) => { return fav["category"]; });
      const allDestinations = await new DestinationController().getAllDestinations() || [];
      const allEvents = await new EventController().getAllEvents() || [];
      const allActivities = await new ActivityController().getAllActivities(lang) || [];
      const allPackages = await new PackageController().getAllDestinationPackages(lang) || [];
      const allTrips = await new TripsController().getAllTrips() || [];
      const allTourguides = await new TourGuideController().getAllGuides() || [];
      const allRestaurants = await new RestaurantController().getAllDestinationRestaurants(lang) || [];
      const allHotels = await new HotelController().getAllDestinationHotels(lang) || [];
      const allPlaces = await new DestinationPlaceController().getAllDestinationPlaces(lang) || [];
      const allStores = await new DestinationStoreController().getAllDestinationStores(lang) || [];
      const allMemberships = await new MembershipController().getAllMemberships(lang) || [];
      let destinations = [], events = [], places = [], stores = [], hotels = [], restaurants = [], trips = [], activities = [], guides = [], packages = [], memberships = [];
      const mappedFavourites = [];
      for (const category of categories) {
        const filteredItems = myFavourites.filter((fav) => fav["category"] === category).map((favCat) => { return favCat["item_id"]; });
        mappedFavourites.push({ category, itemsIds: filteredItems });
      }
      for (const mappedFavourite of mappedFavourites) {
        if (mappedFavourite.category === ItemCatgeory.destination) destinations = allDestinations.filter((dest) => mappedFavourite.itemsIds.includes(dest["id"]) && mappedFavourite.category === ItemCatgeory.destination);
        if (mappedFavourite.category === ItemCatgeory.place) places = allPlaces.filter((p) => mappedFavourite.itemsIds.includes(p["id"]) && mappedFavourite.category === ItemCatgeory.place);
        if (mappedFavourite.category === ItemCatgeory.store) stores = allStores.filter((s) => mappedFavourite.itemsIds.includes(s["id"]) && mappedFavourite.category === ItemCatgeory.store);
        if (mappedFavourite.category === ItemCatgeory.package) packages = allPackages.filter((packageData) => mappedFavourite.itemsIds.includes(packageData["id"]) && mappedFavourite.category === ItemCatgeory.package);
        if (mappedFavourite.category === ItemCatgeory.event) events = allEvents.filter((e) => mappedFavourite.itemsIds.includes(e["id"]) && mappedFavourite.category === ItemCatgeory.event);
        if (mappedFavourite.category === ItemCatgeory.hotel) hotels = allHotels.filter((h) => mappedFavourite.itemsIds.includes(h["id"]) && mappedFavourite.category === ItemCatgeory.hotel);
        if (mappedFavourite.category === ItemCatgeory.guide) guides = allTourguides.filter((g) => mappedFavourite.itemsIds.includes(g["id"]) && mappedFavourite.category === ItemCatgeory.guide);
        if (mappedFavourite.category === ItemCatgeory.restaurant) restaurants = allRestaurants.filter((r) => mappedFavourite.itemsIds.includes(r["id"]) && mappedFavourite.category === ItemCatgeory.restaurant);
        if (mappedFavourite.category === ItemCatgeory.membership) memberships = allMemberships.filter((ms) => mappedFavourite.itemsIds.includes(ms["id"]) && mappedFavourite.category === ItemCatgeory.membership);
        if (mappedFavourite.category === ItemCatgeory.trip) trips = allTrips.filter((t) => mappedFavourite.itemsIds.includes(t["id"]) && mappedFavourite.category === ItemCatgeory.trip);
        if (mappedFavourite.category === ItemCatgeory.activity) activities = allActivities.filter((a) => mappedFavourite.itemsIds.includes(a["id"]) && mappedFavourite.category === ItemCatgeory.activity);
      }
      const data = { destinations, events, places, stores, hotels, restaurants, trips, activities, guides, packages, memberships };
      return res.render("website/views/my-favourites.ejs", { title: "My Favourites", data, myFavourites });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Can't get my favourites data", err: error });
    }
  }
  public async getFavourites(queryCategory: string, user_id?: number, user_type?: string, queryItem?: number, fromTo?: any): Promise<any> {
    try {
      const conditions = [];
      const category = new FavouriteController().getCategory(queryCategory);
      conditions.push({ category });
      if (!!queryItem) conditions.push({ item_id: queryItem });
      if (!!user_id) conditions.push({ user_id });
      if (!!user_type) conditions.push({ user_type });
      if (!!fromTo) conditions.push([{ createdAt: { [Op.gte]: fromTo.from } }, { createdAt: { [Op.lte]: fromTo.to } }]);
      return await favourite.findAll({
        where: { [Op.and]: conditions },
        attributes: { exclude: ["updatedAt"] },
        include: [{ model: webAppsUsers, attributes: ["fullName", "email", "phone"] }],
        raw: true,
      }) || [];
    } catch (error) {
      throw error;
    }
  }
  public async getAllFavourites(user_id: number, user_type: string) {
    try {
      return await favourite.findAll({ where: { [Op.and]: [{ user_id }, { user_type }] }, attributes: ["id", "item_id", "category"], raw: true });
    } catch (error) {
      throw error;
    }
  }
  public async getFavourite(user_id: number, item_id: number, user_type: string, category: string) {
    try {
      return await favourite.findOne({ where: { [Op.and]: [{ user_id }, { item_id }, { category }, { user_type }] }, attributes: ["id"], raw: true });
    } catch (error) {
      throw error;
    }
  }
  public async updateFavourite(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.body.item_id || !req.body.checked) return res.status(httpStatus.BAD_REQUEST).json("Bad Request");
      const payload = verify(req.cookies.token);
      const category = new FavouriteController().getCategory(req.body.category);
      const request = { item_id: req.body.item_id, category, user_type: payload.user_type, user_id: payload.user_id };
      if (req.body.checked == "true") await favourite.create(request);
      else await favourite.destroy({ where: { [Op.and]: [{ item_id: request.item_id }, { user_id: request.user_id }, { user_type: request.user_type }, { category: request.category }] }});
      return res.status(httpStatus.OK).json({ msg: "Favourite of this item is updated successfully" });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Can't add or remove to/from favourite", err: error });
    }
  }
  private getCategory(category: string): string {
    try {
      let categoryName: string;
      switch(category) {
        case ItemCatgeory.hotel : categoryName = ItemCatgeory.hotel;
                                  break;
        case ItemCatgeory.destination : categoryName = ItemCatgeory.destination;
                                  break;
        case ItemCatgeory.event : categoryName = ItemCatgeory.event;
                                  break;
        case ItemCatgeory.membership : categoryName = ItemCatgeory.membership;
                                  break;
        case ItemCatgeory.restaurant : categoryName = ItemCatgeory.restaurant;
                                  break;
        case ItemCatgeory.place : categoryName = ItemCatgeory.place;
                                  break;
        case ItemCatgeory.store : categoryName = ItemCatgeory.store;
                                  break;
        case ItemCatgeory.trip : categoryName = ItemCatgeory.trip;
                                  break;
        case ItemCatgeory.guide : categoryName = ItemCatgeory.guide;
                                  break;
        case ItemCatgeory.package : categoryName = ItemCatgeory.package;
                                  break;
        case ItemCatgeory.activity : categoryName = ItemCatgeory.activity;
                                  break;
      }
      return categoryName;
    } catch (error) {
      throw error;
    }
  }
}
