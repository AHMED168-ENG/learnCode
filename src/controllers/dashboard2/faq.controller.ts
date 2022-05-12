import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import {Model} from "sequelize/types"
import FAQ from "../../models/faq.model"
import modules from "../../models/module.model"
import page from "../../models/page.model"
import permissions from "../../models/permissions.model"
const { verify } = require("../../helper/token")

export class FAQController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/faq/list.ejs", {
      title: "faq",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const pageIndex = (Number(req.query.page) - 1) * limit
    FAQ.findAll({
      limit: limit,
      offset: pageIndex,
      attributes: {exclude: ["updatedAt"]},
    })
      .then((data) => {
        FAQ.count()
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
              canEdit = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Edit" && per["tbl_page"]["tbl_module"]["name"] === "FAQ").length;
              canAdd = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Add" && per["tbl_page"]["tbl_module"]["name"] === "FAQ").length;
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting FAQs", msg: "not found"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found"})
      })
  }
  newPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/faq/new.ejs", {
      title: "faq new",
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    FAQ.create(req.body)
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new faq created"})
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in create new faq", err: "unexpected error"})
      })
  }
  editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    FAQ.findOne({where: {id}, raw: true}).then((data) => {
      res.render("dashboard/views/faq/edit.ejs", {
        title: "Edit FAQ",
        data: data,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    FAQ.update(req.body, {where: {id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in edit", err: "unexpected error"})
      })
  }
  viewPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    FAQ.findOne({where: {id}, raw: true}).then((data) => {
      res.render("dashboard/views/faq/view.ejs", {
        title: "View FAQ",
        data: data,
      })
    })
  }
}
