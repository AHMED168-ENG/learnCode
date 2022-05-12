import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import {Model} from "sequelize/types"
import country from "../../models/country.model"
import modules from "../../models/module.model"
import page from "../../models/page.model"
import permissions from "../../models/permissions.model"
const { verify } = require("../../helper/token")

export class CountryController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/country/list.ejs", {
      title: "Country",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const pageIndex = (Number(req.query.page) - 1) * limit
    country
      .findAll({
        limit: limit,
        offset: pageIndex,
        attributes: {exclude: ["updatedAt"]},
      })
      .then((data) => {
        country
          .count()
          .then(async (count) => {
            const payload = verify(req.cookies.token);
            const isHighestAdmin = payload.role_id === "0";
            let userPermissions, canEdit = true, canAdd = true;
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
              canEdit = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Edit" && per["tbl_page"]["tbl_module"]["name"] === "Countries List").length;
              canAdd = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Add" && per["tbl_page"]["tbl_module"]["name"] === "Countries List").length;
            }
            const dataInti = {
              total: count,
              limit: limit,
              page: Number(req.query.page),
              pages: Math.ceil(count / limit),
              data: data,
              canAdd,
              canEdit,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting countries list", msg: "not found countries"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting countries list", msg: "not found countries"})
      })
  }
  newPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/country/new.ejs", {
      title: "Country new",
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    country
      .create(req.body)
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new country created"})
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in create new country", err: "unexpected error"})
      })
  }
  editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    country.findOne({where: {country_id: id}, attributes: ["ar_name", "en_name", "code"], raw: true}).then((data) => {
      res.render("dashboard/views/country/edit.ejs", {
        title: "Edit Country",
        data: data,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    country
      .update(req.body, {where: {country_id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "country edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in edit country", err: "unexpected error"})
      })
  }
  async listCountry() {
    let data
    await country
      .findAll({
        attributes: {exclude: ["updatedAt"]},
        raw: true,
      })
      .then((d) => {
        if (!d || d.length == 0) {
          data = null
        } else {
          data = d
        }
      })
      .catch((err) => {
        data = []
      })
    return data
  }
}
