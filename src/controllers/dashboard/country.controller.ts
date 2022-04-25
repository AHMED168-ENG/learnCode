import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import {Model} from "sequelize/types"
import country from "../../models/country.model"

export class CountryController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("country/list.ejs", {
      title: "Country",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    country
      .findAll({
        limit: limit,
        offset: page,
        attributes: {exclude: ["updatedAt"]},
      })
      .then((data) => {
        country
          .count()
          .then((count) => {
            const dataInti = {
              total: count,
              limit: limit,
              page: Number(req.query.page),
              pages: Math.ceil(count / limit),
              data: data,
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
    res.render("country/new.ejs", {
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
        res.status(400).json({msg: "Error in create new country", err: err.errors[0].message || "unexpected error"})
      })
  }
  editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    country.findOne({where: {country_id: id}, attributes: ["ar_name", "en_name", "code"], raw: true}).then((data) => {
      res.render("country/edit.ejs", {
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
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in edit country", err: err.errors[0].message || "unexpected error"})
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
