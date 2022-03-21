import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import {Model, where} from "sequelize/types"
import city from "../../models/city.model"
import country from "../../models/country.model"
import region from "../../models/region.model"
import sector from "../../models/sector.model"
import webAppsUsers from "../../models/user.model"

export class UserController {
  secretFields: string[] = ["user_pass", "userSalt", "updatedAt"]
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("user/list.ejs", {
      title: "User",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    const where = {user_type: req.query.type}
    webAppsUsers
      .findAndCountAll({
        limit: limit,
        offset: page,
        where: where,
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
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found user"})
      })
  }
  editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const where = {user_id: id}
    webAppsUsers
      .findOne({
        where: where,
        attributes: ["fullName","user_type", "email", "phone", "user_img", "account_status", "deleted", "createdAt"],
        raw: true,
      })
      .then((data) => {
        res.render("user/edit.ejs", {
          title: "User",
          data:data
        })
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found user"})
      })
  }
}
