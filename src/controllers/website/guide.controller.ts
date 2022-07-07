import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import helpers from "../../helper/helpers";
import city from "../../models/city.model";
import guide from "../../models/guide.model";
import bcrypt from "bcrypt";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { ModulesController } from "../dashboard/modules.controller";
import { GuideRatingController } from "./guide-rating.controller";
import { UserController } from "../dashboard/user.controller";
import { GuideFollowController } from "./follow-guide.controller";
import { GuideTripController } from "./guide-trip.controller";
import { Op } from "sequelize";
import { OTPController } from "./otp.controller";
import { FavouriteController } from "./favourite.controller";
import { ItemCatgeory } from "../../enums/item-category.enum";
const { verify } = require("../../helper/token");
export class TourGuideController {
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("website/views/guide/list.ejs", { title: "Tour Guide" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const tourGuides = await guide.findAll({
        limit,
        offset,
        attributes: { exclude: ["ar_description", "en_description", "createdAt", "updatedAt", "password", "file", "city_id"] },
        include: [{ model: city, attributes: ["ar_name", "en_name"] }],
      }) || [];
      const countGuides = await guide.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Tourist Guide Management");
      const module_id = await new ModulesController().getModuleIdByName("Tourist Guide Management");
      const dataInti = { total: countGuides, limit, page: Number(req.query.page), pages: Math.ceil(countGuides / limit) + 1, data: tourGuides, canAdd: permissions.canAdd, canEdit: permissions.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting tourGuides list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting tour guide", err: "unexpected error" });
      const data = await guide.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        include: [{ model: city, attributes: ["ar_name", "en_name"] }],
        raw: true,
      });
      const payload = verify(req.cookies.token);
      const user = await new UserController().getUserByEmail(payload.email);
      let rating, follow, favourite, favouriteTrips;
      if (!!user) {
        rating = await new GuideRatingController().getGuideRating(payload.user_id, data["id"]);
        follow = await new GuideFollowController().getFollow(payload.user_id, data["id"]);
        favourite = await new FavouriteController().getFavourite(payload.user_id, data["id"], payload.user_type, ItemCatgeory.guide);
        favouriteTrips = await new FavouriteController().getFavourites(ItemCatgeory.trip, payload.user_id, payload.user_type);
      }
      const trips = await new GuideTripController().getTripsWithGuide(data["id"]);
      const module_id = await new ModulesController().getModuleIdByName("Tourist Guide Management");
      return res.render("website/views/guide/view.ejs", { title: "View Tour Guide Details", data, rating, follow, trips, favourite, module_id, isWebUser: user, favouriteTrips });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get tour guide data in view page", err: "unexpected error" });
    }
  }
  public async getRegisterPage(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render("website/views/guide/new.ejs", { title: "User Registeration Page" });
    } catch (error) {
      return res.status(500).json({ msg: "Can't open registeration page", err: error });
    }
  }
  public async signup(req: Request, res: Response, next: NextFunction) {
    try {
      if (!helpers.checkFields(req.body, ["gender", "emailORphone", "password", "name", "city_id"])) {
        return res.status(httpStatus.BAD_REQUEST).json({ msg: "require field is missing" });
      } else {
        const { gender, name, username, city_id, ar_description, en_description, emailORphone } = req.body;
        const salt: string = bcrypt.genSaltSync(8);
        const password: string = bcrypt.hashSync(req.body.password, salt);
        const conditionLogin = helpers.regularExprEmail(emailORphone) ? { email: emailORphone } : { phone: emailORphone };
        const isEmail = helpers.regularExprEmail(emailORphone) ? "emailVerified" : "phoneVerified";
        const foundGuide = await guide.findOne({ where: conditionLogin, raw: true });
        const payload = { name, gender, username, city_id, ar_description, en_description, ...conditionLogin, password };
        if (!foundGuide) await guide.create(payload);
        else {
          if (foundGuide[isEmail] == 0) await guide.update({ password }, { where: conditionLogin });
          else if (foundGuide["name"] == null || foundGuide["name"].length == 0) return res.status(httpStatus.BAD_REQUEST).json({ isverified: false, user_id: foundGuide["id"] });
          else return res.status(400).json({ msg: "user is found you can Login" });
        }
        return res.status(201).json({ msg: "Tour guide is registered successfully" });
      }
    } catch (error) {
      return res.status(500).json({ msg: "Can't be registered as a tourguide", err: error });
    }
  }
  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, emailORphone, password, type } = req.body;
      const userSalt: string = bcrypt.genSaltSync(8);
      const user_pass: string = bcrypt.hashSync(password, userSalt);
      const conditionLogin = helpers.regularExprEmail(emailORphone) ? { email: emailORphone } : { phone: emailORphone };
      const userData = { password: user_pass };
      const user = await new TourGuideController().getGuide({ [Op.or]: [{ email: emailORphone }, { phone: emailORphone }] });
      const foundOtp = await new OTPController().getOTP(user["id"], type);
      if (foundOtp["value"] == otp && foundOtp["emailORphone"] == emailORphone && foundOtp["is_used"] == "yes") {
        const updatedGuide = await guide.update(userData, { where: conditionLogin });
        if (updatedGuide) {
          await new OTPController().deleteOTP(user["id"], type);
          return res.status(httpStatus.ACCEPTED).json({ msg: "password changed", status: true });
        }
      } else return res.status(httpStatus.BAD_REQUEST).json({ msg: "error happened", status: httpStatus.BAD_REQUEST });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "error happened", status: false });
    }
  }
  public async getAllGuides() {
    try {
      return await guide.findAll({ attributes: ["id", "name", "username", "image"], raw: true }) || [];
    } catch (error) {
      throw error;
    }
  }
  public async getGuide(where: any) {
    try {
      return await guide.findOne({ where, attributes: ["id", "name", "email"], raw: true });
    } catch (error) {
      throw error;
    }
  }
}
