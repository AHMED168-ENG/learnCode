import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Op } from "sequelize";
import { ItemCatgeory } from "../../enums/item-category.enum";
import favourite from "../../models/favourite.model";
import webAppsUsers from "../../models/user.model";
const { verify } = require("../../helper/token");
export class FavouriteController {
  constructor() {}
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
      }
      return categoryName;
    } catch (error) {
      throw error;
    }
  }
}
