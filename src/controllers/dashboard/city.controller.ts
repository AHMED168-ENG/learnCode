import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import city from "../../models/city.model"
import country from "../../models/country.model"
import {CountryController} from "./country.controller"

export class CityController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("city/list.ejs", {
      title: "City",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    city
      .findAll({
        limit: limit,
        offset: page,
        attributes: {exclude: ["country_id", "updatedAt"]},
        include: [{model: country, attributes: ["country_id", "en_name", "ar_name", "createdAt"]}],
      })
      .then((data) => {
        city
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting cities", msg: "not found city"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting cities", msg: "not found city"})
      })
  }
  async newPage(req: Request, res: Response, next: NextFunction) {
    const countries = await new CountryController().listCountry()
    res.render("city/new.ejs", {
      title: "City new",
      countries,
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    city
      .create(req.body)
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new city created"})
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in create new city", err: err.errors[0].message || "unexpected error"})
      })
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const countries = await new CountryController().listCountry()
    city.findOne({where: {city_id: id}, attributes: ["country_id", "ar_name", "en_name", "code"], raw: true}).then((data) => {
      res.render("city/edit.ejs", {
        title: "Edit City",
        data: data,
        countries,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    city
      .update(req.body, {where: {city_id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "city edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit city", err: err.errors[0].message || "unexpected error"})
      })
  }
  async listCityByCountry(req, res: Response, next: NextFunction) {
    const id = req.params.id
    city
      .findAll({where: {country_id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json(data)
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit city", err: err.errors[0].message || "unexpected error"})
      })
  }
  async listCity() {
    let data
    await city
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
