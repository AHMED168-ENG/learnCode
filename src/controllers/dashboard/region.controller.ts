import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import city from "../../models/city.model"
import country from "../../models/country.model"
import region from "../../models/region.model"
import {CountryController} from "./country.controller"

export class RegionController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("region/list.ejs", {
      title: "Region",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    region
      .findAll({
        limit: limit,
        offset: page,
        attributes: {exclude: ["city_id_pk", "country_id_pk", "updatedAt"]},
        include: [
          {model: city, attributes: ["city_id", "en_name", "ar_name"]},
          {model: country, attributes: ["country_id", "en_name", "ar_name"]},
        ],
      })
      .then((data) => {
        region
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting regions", msg: "not found regions"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting regions", msg: "not found regions"})
      })
  }
  async newPage(req: Request, res: Response, next: NextFunction) {
    const countries = await new CountryController().listCountry()
    res.render("region/new.ejs", {
      title: "Region new",
      countries,
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    region
      .create(req.body)
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new region created"})
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in region new city", err: err.errors[0].message || "unexpected error"})
      })
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const countries = await new CountryController().listCountry()
    region.findOne({where: {region_id: id}, raw: true}).then((data) => {
      res.render("region/edit.ejs", {
        title: "Edit region",
        data: data,
        countries,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    region
      .update(req.body, {where: {region_id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "region edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit region", err: err.errors[0].message || "unexpected error"})
      })
  }
  async listRegionByCity(req, res: Response, next: NextFunction) {
    const id = req.params.id
    region
      .findAll({
        attributes: ["region_id", "en_name", "ar_name"],
        where: {city_id: id},
      })
      .then((data) => {
        res.status(httpStatus.OK).json(data)
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit region", err: err.errors[0].message || "unexpected error"})
      })
  }
}
