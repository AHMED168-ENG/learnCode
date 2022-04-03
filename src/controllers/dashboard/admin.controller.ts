import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import admin from "../../models/admin.model"

export class AdminController {
  loginPage(req: Request, res: Response, next: NextFunction) {
    res.render("login.ejs", {title: "Login"})
  }
  login(req: Request, res: Response, next: NextFunction) {
    const {email, password} = req.body
    const token = Buffer.from("aaaaaaaaaaaaaaaaaa").toString("base64")
    // console.log(Buffer.from(req.cookies.token, "base64").toString())
    // res.cookie("token", `${token}`).status(200).json({status: 200})
    if (email == "admin@admin.com" && password == "admin") {
      res.cookie("token", `${token}`).status(200).json({status: 200})
    } else {
      res.status(200).json({status: 201})
    }
  }
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("admin/list.ejs", {
      title: "admin",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    admin
      .findAll({
        limit: limit,
        offset: page,
        attributes: {exclude: ["updatedAt"]},
      })
      .then((data) => {
        admin
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err, msg: "not found admin"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found admin"})
      })
  }
  newPage(req: Request, res: Response, next: NextFunction) {
    res.render("admin/new.ejs", {
      title: "admin new",
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    admin
      .create(req.body)
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new admin created"})
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in create new admin", err: err.errors[0].message || "unexpected error"})
      })
  }
  editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    admin.findOne({where: {admin_id: id}, attributes: ["ar_name", "en_name"], raw: true}).then((data) => {
      res.render("admin/edit.ejs", {
        title: "Edit admin",
        data: data,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    admin
      .update(req.body, {where: {admin_id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "admin edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in edit admin", err: err.errors[0].message || "unexpected error"})
      })
  }
}
