import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import partnerType from "../../models/partner-type.model"
import { UserPermissionsController } from "./user-permissions.controller"

export class PartnerTypeController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/partner-type/list.ejs", {
      title: "Partner-type",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const pageIndex = (Number(req.query.page) - 1) * limit
    partnerType
      .findAll({
        limit: limit,
        offset: pageIndex,
        attributes: {exclude: ["updatedAt"]},
      })
      .then((data) => {
        partnerType
          .count()
          .then(async (count) => {
            const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Partner Types List");
            const dataInti = {
              total: count,
              limit: limit,
              page: Number(req.query.page),
              pages: Math.ceil(count / limit),
              data,
              canEdit: permissions.canEdit,
              canAdd: permissions.canAdd,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting partner types", msg: "not found partner types"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting partner types", msg: "not found partner types"})
      })
  }
  newPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/partner-type/new.ejs", {
      title: "partner-type new",
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    partnerType
      .create(req.body)
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new partnerType created"})
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in create new partnerType", err: "unexpected error"})
      })
  }
  editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    partnerType.findOne({where: {id: id}, attributes: ["ar_name", "en_name"], raw: true}).then((data) => {
      res.render("dashboard/views/partner-type/edit.ejs", {
        title: "Edit type",
        data: data,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    partnerType
      .update(req.body, {where: {id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "partnerType edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in edit partnerType", err: "unexpected error"})
      })
  }
  async listType() {
    let data
    await partnerType
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
