import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import helpers from "../../helper/helpers";
import IUser from "../../interfaces/user.interface";
import webAppsUsers from "../../models/user.model";
import token from "../../helper/token";
export class UsersController {
  constructor() {}
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
}
