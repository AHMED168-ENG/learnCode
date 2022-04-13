import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import admin from "../../models/admin.model"
import helpers from "../../helper/helpers";
import { IAdminUser } from "../../interfaces/IAdminUser";

export class AdminController {
  loginPage(req: Request, res: Response, next: NextFunction) {
    return res.render("login.ejs", { title: "Login" });
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
  async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const createdAdminData: IAdminUser = req.body;
      if (!createdAdminData || ![1, 2].includes(createdAdminData.role_id)) return res.status(httpStatus.BAD_REQUEST).json({ message: "Bad Request" });
      if (!helpers.regularExprEmail(createdAdminData.email)) return res.status(httpStatus.BAD_REQUEST).json({ message: "invalid email" });
      const existedAdmin = await admin.findOne({ where: { email: createdAdminData.email } });
      if (existedAdmin) return res.status(httpStatus.NOT_ACCEPTABLE).json({ message: "This email is already exists" });
      await admin.create(req.body);
      return res.status(httpStatus.OK).json({ msg: "new admin created" });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, messgae: "Can't add admin" });
    }
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await admin.findOne({ where: { admin_id: req.params.id }, attributes: ["ar_name", "en_name"], raw: true });
      return res.render("admin/edit.ejs", { title: "Edit admin", data });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, message: "Can't get admin data for edit page" });
    }
  }
  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const createdAdminData: IAdminUser = req.body;
      if (!createdAdminData || ![1, 2].includes(createdAdminData.role_id)) return res.status(httpStatus.BAD_REQUEST).json({ message: "Bad Request" });
      if (!helpers.regularExprEmail(createdAdminData.email)) return res.status(httpStatus.BAD_REQUEST).json({ message: "invalid email" });
      await admin.update(req.body, { where: { admin_id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "admin edited" });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, message: "Can't update admin data" });
    }
  }
}
