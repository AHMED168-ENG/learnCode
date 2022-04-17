import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import sequelize, { Op } from "sequelize"
import city from "../../models/city.model"
import country from "../../models/country.model"
import modules from "../../models/module.model"
import page from "../../models/page.model"
import permissions from "../../models/permissions.model"
import region from "../../models/region.model"
import sector from "../../models/sector.model"
import webAppsUsers from "../../models/user.model"

export class UserController {
  secretFields: string[] = ["user_pass", "userSalt", "updatedAt"]
  logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("token", '', { expires: new Date(0) });
      return res.redirect('/');
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't logout user" });
    }
  }
  async listPermissionsPage(req: Request, res: Response, next: NextFunction) {
    try {
      // const modulesData = await modules.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
      // const pages = await page.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
      // const permissionsData = await permissions.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
      // for (const module of modulesData) {
      //   const pagesData = [];
      //   for (const page of pages) {
      //     const filteredPermissions = permissionsData.filter((permission) => );
      //   }
      // }
      return res.render("user-permissions/list.ejs", { role_id: req.params.role_id, data: "" });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, messgae: "Can't get permissions page" });
    }
  }
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("user/list.ejs", {
      title: "User",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    const userType = { user_type: req.query.type };
    const fromTo = req.query.from != "null" && req.query.to != "null" ? { createdAt: { [Op.and]: [{ [Op.gte]: req.query.from }, { [Op.lte]: req.query.to }] } } : {};
    webAppsUsers
      .findAndCountAll({
        limit: limit,
        offset: page,
        where: { ...userType, ...fromTo },
        attributes: {exclude: [...new UserController().secretFields]},
        include: [
          {model: country, attributes: ["en_name", "ar_name"]},
          {model: city, attributes: ["en_name", "ar_name"]},
          {model: region, attributes: ["en_name", "ar_name"]},
          {model: sector, attributes: ["en_name", "ar_name"]},
        ],
        raw: true,
      })
      .then((data) => {
        const dataPagination = {
          total: data["count"],
          limit: limit,
          page: Number(req.query.page),
          pages: Math.ceil(data["count"] / limit),
          data: data["rows"],
        }
        res.status(httpStatus.OK).json(dataPagination)
      })
      .catch((err) => {
        console.log(err)
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found users"})
      })
  }
  editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const where = {user_id: id}
    webAppsUsers
      .findOne({
        where: where,
        attributes: ["fullName", "user_type", "email", "phone", "user_img", "account_status", "deleted", "createdAt"],
        raw: true,
      })
      .then((data) => {
        res.render("user/edit.ejs", {
          title: "User",
          data: data,
        })
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found user"})
      })
  }
  async userData(userId) {
    let data
    await webAppsUsers
      .findOne({where: {user_id: userId}, attributes: ["fullName"], raw: true})
      .then((d) => {
        if (!d) {
          data = null
        } else {
          data = d
        }
      })
      .catch((err) => {
        data = null
      })
    return data
  }
  async listUser() {
    let data
    await webAppsUsers
      .findAll({
        attributes: ["user_id", "fullName", "phone", "email"],
        where: {
          fullName: {
            [sequelize.Op.ne]: null,
          },
        },
        raw: true,
      })
      .then((d) => {
        if (!d) {
          data = null
        } else {
          data = d
        }
      })
      .catch((err) => {
        data = null
      })
    return data
  }
}
