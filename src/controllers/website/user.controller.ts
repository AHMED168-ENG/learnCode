import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import helpers from "../../helper/helpers";
import IUser from "../../interfaces/user.interface";
import webAppsUsers from "../../models/user.model";
import token from "../../helper/token";
import { TourGuideController } from "../website/guide.controller";
import { Op } from "sequelize";
import { UserController } from "../dashboard/user.controller";
import admin from "../../models/admin.model";
import { OTPController } from "./otp.controller";
import { ItemCatgeory } from "../../enums/item-category.enum";
const { generateToken } = require("../../helper/token") ;
export class UsersController {
  constructor() {}
  public loginPage(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render("dashboard/views/login.ejs", { title: "Login" });
    } catch (error) {
      return res.status(500).json({ err: "unexpected error", msg: "Can't log in user" });
    }
  }
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      let payload: any;
      if (email === process.env.admin_email && password === process.env.admin_password) payload = { user_id: process.env.admin_id, role_id: process.env.admin_role, username: process.env.admin_name, email: process.env.admin_email, phone: process.env.admin_phone };
      else {
        let store, provider, restaurant, hotel;
        const webUser = await new UserController().getUserByEmail(email);
        const tourGuide = await new TourGuideController().getGuide({ [Op.or]: [{ email }, { phone: email }, { password }] });
        const adminUser = await admin.findOne({ where: { email } });
        const user = adminUser || webUser || tourGuide;
        const userPass = user["password"] || user["user_pass"];
        const isMatch = await bcrypt.compare(password, userPass);
        if (!!user && user["email"] !== adminUser["email"]) {
          const user_id = user[!user["user_id"] ? "id" : "user_id"];
          const otherType = new UsersController().getUserType(!!tourGuide, !!store, !!hotel, !!restaurant, !!provider);
          const type = user["user_type"] || otherType;
          const foundOtp = await new OTPController().getOTP(user_id, type);
          if (foundOtp["is_used"] != "yes") return res.status(401).json({ status: 401, user });
        }
        if (user["email"] === email && isMatch) payload = { user_id: user["user_id"] || user["id"], username: user["fullName"] || user["name"], email: user["email"], phone: user["phone"], user_type: webUser ? webUser["user_type"] : null };
        else return res.status(200).json({ status: 201 });
      }
      const token = generateToken(payload);
      return res.cookie("token", `${token}`).status(200).json({ status: 200 });
    } catch (error) {
      return res.status(500).json({ err: "unexpected error", msg: "Can't log in user" });
    }
  }
  public async getRegisterPage(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render("website/views/register.ejs", { title: "User Registeration Page" });
    } catch (error) {
      return res.status(500).json({ msg: "Can't open registeration page", err: error });
    }
  }
  public async signup(req: Request, res: Response, next: NextFunction) {
    if (!helpers.checkFields(req.body, ["user_type", "emailORphone", "user_pass"])) {
      return res.status(httpStatus.BAD_REQUEST).json({ msg: "require field is missing" });
    } else {
      const { user_type, emailORphone } = req.body;
      const userSalt: string = bcrypt.genSaltSync(8);
      const user_pass: string = bcrypt.hashSync(req.body.user_pass, userSalt);
      const conditionLogin = helpers.regularExprEmail(emailORphone) ? {email: emailORphone} : {phone: emailORphone}
      const userData = {user_type, ...conditionLogin, user_pass, userSalt}
      const isEmail = helpers.regularExprEmail(emailORphone) ? "emailVerified" : "phoneVerified"
      webAppsUsers
        .findOne({where: conditionLogin})
        .then((data) => {
          if (!data) {
            webAppsUsers
              .create(userData)
              .then((dataCreated) => {
                const user: IUser = dataCreated.toJSON()
                delete user.user_pass
                delete user.userSalt
                delete user.createdAt
                delete user.updatedAt
                return res.status(httpStatus.CREATED).json({user})
              })
              .catch((err: object) => {
                if (err) {
                  res.status(httpStatus.BAD_REQUEST).json({msg: "Error while Sign up user", err: err["errors"][0]["message"]})
                }
              })
          } else {
            if (data[isEmail] == 0) {
              webAppsUsers
                .update({user_pass, userSalt}, {where: conditionLogin})
                .then(() => res.status(httpStatus.BAD_REQUEST).json({isverified: false, user_id: data["user_id"]}))
            } else if (data["fullName"] == null || data["fullName"].length == 0) {
              res
                .status(httpStatus.BAD_REQUEST)
                .json({isCompleted: false, type: data["user_type"], token: token.generateToken({user_id: data["user_id"], type: "normal"})})
            } else {
              res.status(httpStatus.BAD_REQUEST).json({msg: "user is found you can Login"})
            }
          }
        })
        .catch((err) => res.status(httpStatus.BAD_REQUEST).json({msg: "There is while search for user", err: err.errors[0].message || "error"}))
    }
  }
  private getUserType(isGuide: boolean, isStore?: boolean, isHotel?: boolean, isRestaurant?: boolean, isProvider?: boolean): string {
    try {
      return isGuide ? ItemCatgeory.guide : isStore ? ItemCatgeory.store : isHotel ? ItemCatgeory.hotel : isRestaurant ? ItemCatgeory.restaurant : isProvider ? "provider" : null;
    } catch (error) {
      throw error;
    }
  }
}
