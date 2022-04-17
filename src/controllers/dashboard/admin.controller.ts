import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import admin from "../../models/admin.model"
import helpers from "../../helper/helpers";
import { IAdminUser } from "../../interfaces/IAdminUser";
import bcrypt from "bcrypt";
import role from "../../models/user-roles.model";
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
  async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await role.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
      return res.render("admin/new.ejs", { title: "admin new", data });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, messgae: "Can't get new admin page" });
    }
  }
  async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const createdAdminData: IAdminUser = req.body;
      if (!createdAdminData || ![1, 2].includes(Number(createdAdminData.role_id))) return res.status(httpStatus.BAD_REQUEST).json({ message: "Bad Request" });
      if (!helpers.regularExprEmail(createdAdminData.email)) return res.status(httpStatus.BAD_REQUEST).json({ message: "invalid email" });
      const existedAdmin = await admin.findOne({ where: { email: createdAdminData.email } });
      if (existedAdmin) return res.status(httpStatus.NOT_ACCEPTABLE).json({ message: "This email is already exists" });
      const password = await bcrypt.hash(createdAdminData.password, 10);
      const existedAdminWithPass = await admin.findOne({ where: { password } });
      if (existedAdminWithPass) return res.status(httpStatus.NOT_ACCEPTABLE).json({ message: "This password is already exists" });
      const request = { fullName: createdAdminData.fullName, email: createdAdminData.email, phone: createdAdminData.phone, role_id: createdAdminData.role_id, password };
      await admin.create(request);
      return res.status(httpStatus.OK).json({ msg: "new admin created" });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, messgae: "Can't add admin" });
    }
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await role.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
      const data = await admin.findOne({ where: { id: req.params.id }, attributes: { exclude: ["id", "createdAt", "updatedAt"] }, raw: true });
      return res.render("admin/edit.ejs", { title: "Edit admin", data, roles });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, message: "Can't get admin data for edit page" });
    }
  }
  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedAdminData: IAdminUser = req.body;
      if (!updatedAdminData || ![1, 2].includes(Number(updatedAdminData.role_id))) return res.status(httpStatus.BAD_REQUEST).json({ message: "Bad Request" });
      if (updatedAdminData.email && !helpers.regularExprEmail(updatedAdminData.email)) return res.status(httpStatus.BAD_REQUEST).json({ message: "invalid email" });
      if (updatedAdminData.password) {
        const password: string = await bcrypt.hash(updatedAdminData.password, 5);
        req.body.password = password;
      }
      await admin.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "admin edited" });
    } catch (error) {
      console.log(`error: ${error}`)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, message: "Can't update admin data" });
    }
  }
}
