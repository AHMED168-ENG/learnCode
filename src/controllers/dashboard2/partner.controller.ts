import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import city from "../../models/city.model"
import partnerType from "../../models/partner-type.model"
import partner from "../../models/partner.model"
import path from "path"
import helpers from "../../helper/helpers"
import {PartnerTypeController} from "./partner-type.controller"
import modules from "../../models/module.model"
import page from "../../models/page.model"
import permissions from "../../models/permissions.model"
const { verify } = require("../../helper/token")

export class PartnerController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/partner/list.ejs", {
      title: "Partners",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const pageIndex = (Number(req.query.page) - 1) * limit
    partner
      .findAll({
        limit: limit,
        offset: pageIndex,
        include: [{model: partnerType}],
      })
      .then((data) => {
        partner
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
              canEdit = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Edit" && per["tbl_page"]["tbl_module"]["name"] === "Partners List").length;
              canAdd = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Add" && per["tbl_page"]["tbl_module"]["name"] === "Partners List").length;
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
          .catch((err) => {
            console.log(err)
            res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting partners", msg: "not found"})
          })
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting partners", msg: "not found"})
      })
  }
  async newPage(req: Request, res: Response, next: NextFunction) {
    const types = await new PartnerTypeController().listType()
    res.render("dashboard/views/partner/new.ejs", {
      title: "Partner new",
      types,
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    const imgFile = req.files.img
    const imgName: string = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgFile.name)}`
    const fileDir: string = `partner/`
    helpers.imageProcessing(fileDir, imgName, imgFile.data)

    partner
      .create({...req.body, img: `${fileDir}${imgName}`})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new Partner created"})
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in create new Partner", err: "unexpected error"})
      })
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const types = await new PartnerTypeController().listType()
    partner.findOne({where: {id: id}, raw: true}).then((data) => {
      res.render("dashboard/views/partner/edit.ejs", {
        title: "Edit Partner",
        data: data,
        types,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    partner
      .update(req.body, {where: {id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "Partner edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit Partner", err: "unexpected error"})
      })
  }
}
