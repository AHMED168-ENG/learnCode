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
const { verify } = require("../../helper/token")

export class UserController {
  secretFields: string[] = ["user_pass", "userSalt", "updatedAt"]
  logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("token", '', { expires: new Date(0) });
      return res.redirect('/');
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "There is something wrong while logout this user", msg: "Can't logout user" });
    }
  }
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("user/list.ejs", {
      title: "User",
    })
  }
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const pageIndex = (Number(req.query.page) - 1) * limit;
      const userType = { user_type: req.query.type };
      const search = req.query.search != "null" && req.query.search != "" ? {
        [Op.or]: [
          { fullName: { [Op.like]: `%${req.query.search}%` } },
          { gender: { [Op.like]: `%${req.query.search}%` } },
          { email: { [Op.like]: `%${req.query.search}%` } },
        ],
      } : {};
      const fromTo = req.query.from != "null" && req.query.to != "null" ? { createdAt: { [Op.and]: [{ [Op.gte]: req.query.from }, { [Op.lte]: req.query.to }] } } : {};
      const data = await webAppsUsers.findAndCountAll({
        limit,
        offset: pageIndex,
        where: { ...userType, ...fromTo, ...search },
        attributes: { exclude: [...new UserController().secretFields] },
        include: [
          { model: country, attributes: ["en_name", "ar_name"] },
          { model: city, attributes: ["en_name", "ar_name"] },
          { model: region, attributes: ["en_name", "ar_name"] },
          { model: sector, attributes: ["en_name", "ar_name"] },
        ],
        raw: true,
      });
      const payload = verify(req.cookies.token);
      const isHighestAdmin = payload.role_id === "0";
      let userPermissions, canEdit = true;
      if (!isHighestAdmin) {
        userPermissions = await permissions.findAll({
          where: { role_id: payload.role_id },
          attributes: { exclude: ["role_id", "page_id", "createdAt", "updatedAt"] },
          include: [{
            model: page,
            attributes: ["type"],
            include: [{ model: modules, attributes: ["name"] }],
          }],
        });
        canEdit = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Edit" && per["tbl_page"]["tbl_module"]["name"] === "Users - Clients").length;
      }
      const dataPagination = { total: data["count"], limit, page: Number(req.query.page), pages: Math.ceil(data["count"] / limit), data: data["rows"], canEdit };
      return res.status(httpStatus.OK).json(dataPagination);
    } catch (err) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting users list", msg: "Can't find Users" });
    }
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
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while opening edit page", msg: "not found user"})
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
