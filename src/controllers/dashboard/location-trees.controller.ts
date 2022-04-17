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

export class LocationTreesController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("location-trees/list.ejs", {
      title: "Location trees",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    initiativeTrees
      .findAll({
        limit: limit,
        offset: page,
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err, msg: "not found tree"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found tree"})
      })
  }
  async newPage(req: Request, res: Response, next: NextFunction) {
    const initiatives = await new InitiativeController().listAllInit()
    const trees = await new TreeController().listTrees()
    const countries = await new CountryController().listCountry()
    res.render("location-trees/new.ejs", {
      title: "location-trees new",
      initiatives,
      trees,
      countries,
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    initiativeTrees
      .create(req.body)
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new tree created"})
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in create new tree", err: err.errors[0].message || "unexpected error"})
      })
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const initiatives = await new InitiativeController().listAllInit();
      const trees = await new TreeController().listTrees();
      const countries = await country.findAll({ attributes: { include: ["country_id", "en_name"] } });
      const data = await initiativeTrees.findOne({ where: { id }, raw: true });
      return res.render("location-trees/edit.ejs", { title: "Edit location Trees", data, initiatives, countries, trees });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Error in Edit tree", err: error.errors[0].message || "unexpected error" });
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
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit tree", err: err.errors[0].message || "unexpected error"})
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
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit", err: err.errors[0].message || "unexpected error"})
      })
  }
}
