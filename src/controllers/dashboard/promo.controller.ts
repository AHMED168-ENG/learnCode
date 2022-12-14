import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import promo from "../../models/promo.model"
import webAppsUsers from "../../models/user.model"
import { UserPermissionsController } from "./user-permissions.controller"
import {UserController} from "./user.controller"

export class PromoController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/promo/list.ejs", {
      title: "Promo",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const pageIndex = (Number(req.query.page) - 1) * limit
    promo
      .findAll({
        limit: limit,
        offset: pageIndex,
        attributes: {exclude: ["updatedAt"]},
        include: [{model: webAppsUsers, attributes: ["fullName"]}],
      })
      .then((data) => {
        promo
          .count()
          .then(async (count) => {
            const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Promo Codes");
            const dataInti = {
              total: count,
              limit: limit,
              page: Number(req.query.page),
              pages: Math.ceil(count / limit),
              data: data,
              canAdd: permissions.canAdd,
              canEdit: permissions.canEdit,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting promo codes", msg: "not found promo"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting promo codes", msg: "not found promo"})
      })
  }
  async newPage(req: Request, res: Response, next: NextFunction) {
    const users = await new UserController().listUser()
    res.render("dashboard/views/promo/new.ejs", {
      title: "Promo new",
      users: users,
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    promo
      .create(req.body)
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new promo created"})
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in create promo", err: "unexpected error"})
      })
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const users = await new UserController().listUser()
    promo.findOne({where: {promo_id: id}, raw: true}).then((data) => {
      res.render("dashboard/views/promo/edit.ejs", {
        title: "Edit promo",
        data: data,
        users: users,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    promo
      .update(req.body, {where: {promo_id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "promo edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit promo", err: "unexpected error"})
      })
  }
  active(req, res: Response, next: NextFunction) {
    const id = req.params.id
    const del = req.query.v == "yes" ? true : false
    const action = req.params.action == "delete" ? {deleted: del ? "yes" : "no"} : {status: del ? "inactive" : "active"}
    promo
      .update(action, {where: {promo_id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "promo edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit promo", err: "unexpected error"})
      })
  }
}
