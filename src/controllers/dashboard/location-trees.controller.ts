import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import initiatives from "../../models/initiative.model"
import initiativeLocations from "../../models/initiative-location.model"
import {CountryController} from "./country.controller"
import city from "../../models/city.model"
import {InitiativeController} from "./initiative.controller"
import helpers from "../../helper/helpers"
import path from "path"
import initiativeTrees from "../../models/initiative-trees.model"
import trees from "../../models/trees.model"
import {TreeController} from "./tree.controller"
import country from "../../models/country.model"
import { InitiativesLocationController } from "../api/initiative-location.controller"
const { verify } = require("../../helper/token")
import permissions from "../../models/permissions.model"
import page from "../../models/page.model"
import modules from "../../models/module.model"

export class LocationTreesController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("location-trees/list.ejs", {
      title: "Location trees",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const pageIndex = (Number(req.query.page) - 1) * limit
    initiativeTrees
      .findAll({
        limit: limit,
        offset: pageIndex,
        attributes: { exclude: ["updatedAt"] },
        include: [
          {model: initiatives, attributes: ["init_id", "init_ar_name", "init_en_name", "createdAt"]},
          {model: initiativeLocations, attributes: ["location_id", "location_nameEn", "location_nameAr"]},
          {model: trees, attributes: ["tree_id", "ar_name", "en_name", "img_tree"]},
        ],
      })
      .then((data) => {
        initiativeTrees
          .count()
          .then(async (count) => {
            const payload = verify(req.cookies.token);
            const isHighestAdmin = payload.role_id === "0";
            let userPermissions, canEdit, canAdd;
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
              canEdit = userPermissions.filter((per) => per["tbl_page"]["type"] === "Edit" && per["tbl_page"]["tbl_module"]["name"] === "Trees Location");
              canAdd = userPermissions.filter((per) => per["tbl_page"]["type"] === "Add" && per["tbl_page"]["tbl_module"]["name"] === "Trees Location");
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting initiative trees", msg: "not found trees"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting initiative trees", msg: "not found trees"})
      })
  }
  async newPage(req: Request, res: Response, next: NextFunction) {
    const initiativeLocations = await new InitiativesLocationController().listAllInitLocations();
    const initiatives = await new InitiativeController().listAllInit()
    const trees = await new TreeController().listTrees()
    const countries = await new CountryController().listCountry()
    res.render("location-trees/new.ejs", {
      title: "location-trees new",
      initiatives,
      trees,
      countries,
      initiativeLocations,
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    initiativeTrees
      .create(req.body)
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new tree created"})
      })
      .catch((err) => {
        console.log(err)
        res.status(400).json({msg: "Error in create new tree", err: "unexpected error"})
      })
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const initiativeLocationsData = await new InitiativesLocationController().listAllInitLocations();
      const initiativesData = await new InitiativeController().listAllInit();
      const treesData = await new TreeController().listTrees();
      const countries = await country.findAll({ attributes: { include: ["country_id", "en_name"] } });
      const data = await initiativeTrees.findOne({
        where: { id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          { model: trees, attributes: ["ar_name", "en_name"] },
          { model: initiatives, attributes: ["init_ar_name", "init_en_name"] },
          { model: initiativeLocations, attributes: ["location_nameEn", "location_nameAr"] },
        ],
        raw: true,
      });
      return res.render("location-trees/edit.ejs", { title: "Edit location Trees", data, initiatives: initiativesData, countries, trees: treesData, initiativeLocations: initiativeLocationsData });
    } catch (error) {
      console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Error in Edit tree", err: "unexpected error" });
    }
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    initiativeTrees
      .update(req.body, {where: {id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new tree updated"})
      })
      .catch((err) => {
        console.log(err)
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit tree", err: "unexpected error"})
      })
  }
  active(req, res: Response, next: NextFunction) {
    const id = req.params.id
    const del = req.query.v == "yes" ? true : false
    const action = req.params.action == "delete" ? {deleted: del ? "yes" : "no"} : {status: del ? "inactive" : "active"}
    initiativeTrees
      .update(action, {where: {id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit", err: "unexpected error"})
      })
  }
}
