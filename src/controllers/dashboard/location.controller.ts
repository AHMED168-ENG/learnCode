import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import initiatives from "../../models/initiative.model"
import initiativeLocations from "../../models/initiative-location.model"
import {CountryController} from "./country.controller"
import city from "../../models/city.model"
import {InitiativeController} from "./initiative.controller"
import helpers from "../../helper/helpers"
import path from "path"

export class LocationController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("location/list.ejs", {
      title: "Location",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    initiativeLocations
      .findAll({
        limit: limit,
        offset: page,
        attributes: {exclude: ["updatedAt"]},
        include: [
          {model: initiatives, attributes: ["init_id", "init_ar_name", "init_en_name", "createdAt"]},
          {model: city, attributes: ["city_id", "en_name", "ar_name"]},
        ],
      })
      .then((data) => {
        initiativeLocations
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err, msg: "not found Location"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found Location"})
      })
  }
  async newPage(req: Request, res: Response, next: NextFunction) {
    const initiatives = await new InitiativeController().listAllInit()
    const countries = await new CountryController().listCountry()
    res.render("location/new.ejs", {
      title: "Location new",
      initiatives,
      countries,
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    const imgFile = req.files.img
    const imgName: string = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgFile.name)}`
    initiativeLocations
      .create(req.body)
      .then((data) => {
        const location_id = data["location_id"]
        const fileDir: string = `locations/${location_id}/`
        initiativeLocations
          .update({img: `${fileDir}${imgName}`}, {where: {location_id: location_id}})
          .then((d) => {
            helpers.imageProcessing(fileDir, imgName, imgFile.data)
            res.status(httpStatus.OK).json({msg: "new Location created"})
          })
          .catch(() => res.status(httpStatus.OK).json({msg: "new Location created"}))
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in create new Location", err: err.errors[0].message || "unexpected error"})
      })
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const initiatives = await new InitiativeController().listAllInit()
    const countries = await new CountryController().listCountry()
    initiativeLocations.findOne({where: {location_id: id}, raw: true}).then((data) => {
      res.render("location/edit.ejs", {
        title: "Edit Location",
        data: data,
        initiatives,
        countries,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    const imgFile = req.files ? req.files.img : null
    initiativeLocations
      .update(req.body, {where: {location_id: id}})
      .then((data) => {
        if (imgFile) {
          initiativeLocations.findOne({where: {location_id: id}, attributes: ["img"], raw: true}).then((d) => {
            helpers.removeFile(d["img"])
            const imgName: string = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgFile.name)}`
            const fileDir: string = `locations/${id}/`
            initiativeLocations.update({img: `${fileDir}${imgName}`}, {where: {location_id: id}}).then((d) => {
              helpers.imageProcessing(fileDir, imgName, imgFile.data)
              res.status(httpStatus.OK).json({msg: "new location updated"})
            })
          })
        } else {
          res.status(httpStatus.OK).json({msg: "location edited"})
        }
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit location", err: err.errors[0].message || "unexpected error"})
      })
  }
  active(req, res: Response, next: NextFunction) {
    const id = req.params.id
    const del = req.query.v == "yes" ? true : false
    const action = req.params.action == "delete" ? {deleted: del ? "yes" : "no"} : {location_status: del ? "inactive" : "active"}
    initiativeLocations
      .update(action, {where: {location_id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit", err: err.errors[0].message || "unexpected error"})
      })
  }
  async listLocationByInit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    initiativeLocations
      .findAll({where: {location_id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json(data)
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit location", err: err.errors[0].message || "unexpected error"})
      })
  }
}
