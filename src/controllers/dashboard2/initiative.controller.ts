import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import initiatives from "../../models/initiative.model"
import sequelize from "sequelize"
import initiativesImg from "../../models/initiativeImg.model"
import {CityController} from "./city.controller"
import {SponserController} from "./sponser.controller"
import helpers from "../../helper/helpers"
import path from "path"
import permissions from "../../models/permissions.model"
import page from "../../models/page.model"
import modules from "../../models/module.model"
const { verify } = require("../../helper/token")

export class InitiativeController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/initiatives/list.ejs", {
      title: "Initiative",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const pageIndex = (Number(req.query.page) - 1) * limit
    initiatives
      .findAll({
        limit: limit,
        offset: pageIndex,
        attributes: [
          "init_id",
          "init_en_name",
          "init_ar_name",
          "logo",
          "from_date",
          "to_date",
          "featured",
          "status",
          "deleted",
          [
            sequelize.literal(`(
          SELECT img
          FROM tbl_sponsers
          WHERE
          tbl_sponsers.sponser_id= tbl_initiatives.sponsor_id
          )`),
            "sponsorImg",
          ],
        ],
      })
      .then((data) => {
        initiatives
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
              canEdit = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Edit" && per["tbl_page"]["tbl_module"]["name"] === "Initiative Management").length;
              canAdd = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Add" && per["tbl_page"]["tbl_module"]["name"] === "Initiative Management").length;
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting initiatives", msg: "not found initiative"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting initiatives", msg: "not found initiatives"})
      })
  }
  viewPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/initiatives/view.ejs", {
      title: "Initiative",
    })
  }
  async lastInitiative(lang: string = "en") {
    const initName = lang ? "init_en_name" : "init_ar_name"
    let data
    await initiatives
      .findAll({
        limit: 3,
        offset: 0,
        attributes: [
          [initName, "name"],
          [
            sequelize.literal(`(
            SELECT img
            FROM tbl_initiatives_imgs AS initiativesImg
            WHERE
            initiativesImg.init_id = tbl_initiatives.init_id limit 1
            )`),
            "img",
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(location_id) as totalLocation
            FROM tbl_initiatives_locations
            WHERE
            tbl_initiatives_locations.init_id = tbl_initiatives.init_id
            AND tbl_initiatives_locations.location_status='active'
            AND tbl_initiatives_locations.deleted='no'
            )`),
            "totalLocation",
          ],
          [
            sequelize.literal(`(
              SELECT SUM(carbon_points) as carbonPoint
              FROM tbl_initiatives_trees AS initiativeTrees
              WHERE
              initiativeTrees.init_id_pk = tbl_initiatives.init_id
              AND initiativeTrees.status='active'
              AND initiativeTrees.deleted='no'
            )`),
            "carbonPoint",
          ],
        ],
        order: [["createdAt", "DESC"]],
        raw: true,
      })
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
  /**
   * List of initiatives ( name - from - to )
   */
  async listDateFromTo(lang: string = "en") {
    let data
    await initiatives
      .findAll({
        attributes: ["init_id", "init_en_name", "from_date", "to_date"],
        raw: true,
      })
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }

  async addNew(req: Request, res: Response, next: NextFunction) {
    const logoFile = req.files.logo
    const mainImgFile = req.files.main_img
    if (!helpers.mimetypeImge.includes(logoFile["mimetype"]) || !helpers.mimetypeImge.includes(mainImgFile["mimetype"])) {
      res.status(400).json({msg: "Image should be png or jpg"})
    } else {
      const logoName: string = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(logoFile["name"])}`
      const mainImgName: string = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(mainImgFile["name"])}`
      initiatives
        .create({...req.body})
        .then((data) => {
          const initId = data["init_id"]
          const fileDir: string = `initiative/logo/${initId}/`
          const fileDirMain: string = `initiative/album/${initId}/`
          initiatives.update({logo: `${fileDir}${logoName}`}, {where: {init_id: initId}}).then((d) => {
            helpers.imageProcessing(fileDir, logoName, logoFile["data"])
            initiativesImg.create({init_id: initId, img: `${fileDirMain}${mainImgName}`})
            helpers.imageProcessing(fileDirMain, mainImgName, mainImgFile["data"])
            res.status(201).json({msg: "Error in create new initiatives"})
          })
        })
        .catch((err) => {
          console.log(err)
          res.status(400).json({msg: "Error in create new initiatives", err: "unexpected error"})
        })
    }
  }

  async newPage(req: Request, res: Response, next: NextFunction) {
    const cities = await new CityController().listCity()
    const sponsors = await new SponserController().listSponser()
    res.render("dashboard/views/initiatives/new.ejs", {
      title: "Initiatives new",
      cities,
      sponsors,
    })
  }

  async editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const cities = await new CityController().listCity()
    const sponsors = await new SponserController().listSponser()
    initiatives.findOne({where: {init_id: id}, raw: true}).then((data) => {
      res.render("dashboard/views/initiatives/edit.ejs", {
        title: "Initiative edit",
        data: data,
        cities,
        sponsors,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    initiatives
      .update(req.body, {where: {init_id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "Initiative edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit Initiative", err: "unexpected error"})
      })
  }
  active(req, res: Response, next: NextFunction) {
    const id = req.params.id
    const del = req.query.v == "yes" ? true : false
    const action = req.params.action == "delete" ? {deleted: del ? "yes" : "no"} : {status: del ? "inactive" : "active"}
    initiatives
      .update(action, {where: {init_id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit", err: "unexpected error"})
      })
  }
  async initiativeReport() {
    let data
    await initiatives
      .findAll({
        attributes: [
          "init_ar_name",
          "init_en_name",
          [
            sequelize.literal(`(
            SELECT img
            FROM tbl_sponsers
            WHERE
            tbl_sponsers.sponser_id= tbl_initiatives.sponsor_id
            )`),
            "sponsorImg",
          ],
          // [
          //   sequelize.literal(`(
          //   SELECT COALESCE(COUNT(order_id),0)
          //   FROM tbl_orders
          //   WHERE
          //   tbl_orders.sponser_id= tbl_initiatives.sponsor_id
          //   AND tbl_orders.status = "new"
          //   )`),
          //   "new",
          // ],
          "createdAt",
        ],
        raw: true,
      })
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
  async listAllInit() {
    let data
    await initiatives
      .findAll({
        attributes: ["init_id", "init_ar_name", "init_en_name"],
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
