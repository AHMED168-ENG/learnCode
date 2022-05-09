import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import initiatives from "../../models/initiative.model"
import initiativeLocations from "../../models/initiative-location.model"
import {CountryController} from "./country.controller"
import city from "../../models/city.model"
import {InitiativeController} from "./initiative.controller"
import helpers from "../../helper/helpers"
import path from "path"
import modules from "../../models/module.model"
import page from "../../models/page.model"
import permissions from "../../models/permissions.model"
const { verify } = require("../../helper/token")

export class LocationController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("location/list.ejs", {
      title: "Location",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const pageIndex = (Number(req.query.page) - 1) * limit
    initiativeLocations
      .findAll({
        limit: limit,
        offset: pageIndex,
        attributes: {exclude: ["updatedAt"]},
        include: [
          {model: initiatives, attributes: ["init_id", "init_ar_name", "init_en_name", "createdAt"]},
          {model: city, attributes: ["city_id", "en_name", "ar_name"]},
        ],
      })
      .then((data) => {
        initiativeLocations
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
              canEdit = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Edit" && per["tbl_page"]["tbl_module"]["name"] === "Locations Management").length;
              canAdd = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Add" && per["tbl_page"]["tbl_module"]["name"] === "Locations Management").length;
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting initiative locations", msg: "not found Locations"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting initiative locations", msg: "not found Locations"})
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
    const imgName: string = imgFile ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgFile.name)}` : null
    const imgvrFile = req.files.imgvr
    const imgvrName: string = imgvrFile ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgvrFile.name)}` : null
    req.body.imgvr = ""
    initiativeLocations
      .create(req.body)
      .then((data) => {
        const location_id = data["location_id"]
        const fileDir: string = `locations/${location_id}/`
        const set = {img: imgName ? `${fileDir}${imgName}` : null, imgvr: imgvrName ? `${fileDir}${imgvrName}` : null}
        initiativeLocations
          .update(set, {where: {location_id: location_id}})
          .then((d) => {
            if (imgName && imgFile) helpers.imageProcessing(fileDir, imgName, imgFile.data)
            if (imgvrName && imgvrFile) helpers.imageProcessing(fileDir, imgvrName, imgvrFile.data)
            res.status(httpStatus.OK).json({msg: "new Location created"})
          })
          .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "Internal Server Error"}))
      })
      .catch((err) => {
        console.log(err)
        res.status(400).json({msg: "Error in create new Location", err: "unexpected error"})
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
  async viewPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const initiatives = await new InitiativeController().listAllInit()
    const countries = await new CountryController().listCountry()
    initiativeLocations.findOne({where: {location_id: id}, raw: true}).then((data) => {
      res.render("location/view.ejs", {
        title: "Location Details",
        data: data,
        initiatives,
        countries,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    const imgFile = req.files ? req.files.img : null
    const imgVRFile = req.files ? req.files.imgvr : null
    initiativeLocations
      .update(req.body, {where: {location_id: id}})
      .then((data) => {
        if (imgFile || imgVRFile) {
          initiativeLocations.findOne({where: {location_id: id}, attributes: ["img", "imgvr"], raw: true}).then((d) => {
            let imgName: string, imgVRName: string;
            if (imgFile) {
              helpers.removeFile(d["img"])
              imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgFile.name)}`
            }
            if (imgVRFile) {
              helpers.removeFile(d["imgvr"]);
              imgVRName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgVRFile.name)}`
            }
            const fileDir: string = `locations/${id}/`
            const set = {img: imgName ? `${fileDir}${imgName}` : null, imgvr: imgVRName ? `${fileDir}${imgVRName}` : null};
            initiativeLocations.update(set, {where: {location_id: id}}).then((d) => {
              if (imgFile && imgName) helpers.imageProcessing(fileDir, imgName, imgFile.data)
              if (imgVRFile && imgVRName) helpers.imageProcessing(fileDir, imgVRName, imgVRFile.data)
              res.status(httpStatus.OK).json({msg: "new location updated"})
            })
          })
        } else {
          res.status(httpStatus.OK).json({msg: "location edited"})
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit location", err: "unexpected error"})
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
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit", err: "unexpected error"})
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
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit location", err: "unexpected error"})
      })
  }
}
