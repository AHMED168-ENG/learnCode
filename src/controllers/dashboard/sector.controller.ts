import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import sector from "../../models/sector.model"
import { UserPermissionsController } from "./user-permissions.controller"

export class SectorController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/sector/list.ejs", {
      title: "sector",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const pageIndex = (Number(req.query.page) - 1) * limit
    sector
      .findAll({
        limit: limit,
        offset: pageIndex,
        attributes: {exclude: ["updatedAt"]},
      })
      .then((data) => {
        sector
          .count()
          .then(async (count) => {
            const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Entity Sectors");
            const dataInti = {
              total: count,
              limit: limit,
              page: Number(req.query.page),
              pages: Math.ceil(count / limit),
              data: data,
              canEdit: permissions.canEdit,
              canAdd: permissions.canAdd,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting sectors", msg: "not found sectors"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting sectors", msg: "not found sectors"})
      })
  }
  newPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/sector/new.ejs", {
      title: "sector new",
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    sector
      .create(req.body)
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new sector created"})
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in create new sector", err: "unexpected error"})
      })
  }
  editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    sector.findOne({where: {sector_id: id}, attributes: ["ar_name", "en_name"], raw: true}).then((data) => {
      res.render("dashboard/views/sector/edit.ejs", {
        title: "Edit sector",
        data: data,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    sector
      .update(req.body, {where: {sector_id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "sector edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in edit sector", err: "unexpected error"})
      })
  }
}
