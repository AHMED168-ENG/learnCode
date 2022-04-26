import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import city from "../../models/city.model"
import partnerType from "../../models/partner-type.model"
import partner from "../../models/partner.model"
import path from "path"
import helpers from "../../helper/helpers"
import {PartnerTypeController} from "./partner-type.controller"

export class PartnerController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("partner/list.ejs", {
      title: "Partner",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    partner
      .findAll({
        limit: limit,
        offset: page,
        include: [{model: partnerType}],
      })
      .then((data) => {
        partner
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting partners", msg: "not found"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting partners", msg: "not found"})
      })
  }
  async newPage(req: Request, res: Response, next: NextFunction) {
    const types = await new PartnerTypeController().listType()
    res.render("partner/new.ejs", {
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
      res.render("partner/edit.ejs", {
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
