import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import {Model} from "sequelize/types"
import FAQ from "../../models/faq.model"

export class FAQController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("faq/list.ejs", {
      title: "faq",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    FAQ.findAll({
      limit: limit,
      offset: page,
      attributes: {exclude: ["updatedAt"]},
    })
      .then((data) => {
        FAQ.count()
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting FAQs", msg: "not found"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found"})
      })
  }
  newPage(req: Request, res: Response, next: NextFunction) {
    res.render("faq/new.ejs", {
      title: "faq new",
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    FAQ.create(req.body)
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new faq created"})
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in create new faq", err: err.errors[0].message || "unexpected error"})
      })
  }
  editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    FAQ.findOne({where: {id}, raw: true}).then((data) => {
      res.render("faq/edit.ejs", {
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
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in edit", err: err.errors[0].message || "unexpected error"})
      })
  }
  viewPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    FAQ.findOne({where: {id}, raw: true}).then((data) => {
      res.render("faq/view.ejs", {
        title: "View FAQ",
        data: data,
      })
    })
  }
}
