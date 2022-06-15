import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import admin from "../../models/admin.model"
import helpers from "../../helper/helpers";
import { IAdminUser } from "../../interfaces/IAdminUser";
import bcrypt from "bcrypt";
import role from "../../models/user-roles.model";
import { UserPermissionsController } from "./user-permissions.controller";
import { UserController } from "./user.controller";
const { generateToken, verify } = require("../../helper/token") ;
export class AdminController {
  loginPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/login.ejs", { title: "Login" });
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      let payload: any, webUser: any;
      if (email === process.env.admin_email && password === process.env.admin_password) payload = { user_id: process.env.admin_id, role_id: process.env.admin_role, username: process.env.admin_name, email: process.env.admin_email, phone: process.env.admin_phone };
      else {
        webUser = await new UserController().getUserByEmail(email);
        const adminUser = await admin.findOne({ where: { email } });
        const user = adminUser || webUser;
        const isMatch = await bcrypt.compare(password, user["password"]);
        if (user["email"] === email && isMatch) payload = { user_id: user["id"], role_id: user["role_id"], username: user["fullName"], email: user["email"], phone: user["phone"] };
        else return res.status(200).json({ status: 201 });
      }
      const token = generateToken(payload);
      return res.cookie("token", `${token}`).status(200).json({ status: 200, webUser });
    } catch (error) {
      return res.status(500).json({ err: "unexpected error", msg: "Can't log in user" });
    }
  }
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/admin/list.ejs", {
      title: "admin",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const pageIndex = (Number(req.query.page) - 1) * limit
    admin
      .findAll({
        limit: limit,
        offset: pageIndex,
        attributes: {exclude: ["role_id", "password", "updatedAt"]},
        include: [{ model: role, attributes: ["name"] }],
      })
      .then((data) => {
        admin
          .count()
          .then(async (count) => {
            const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Sahlan Admins");
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting admins list", msg: "not found admin"}))
      })
      .catch((err) => {
        console.log(err)
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting admins list", msg: "not found admin"})
      })
  }
  async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await role.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
      return res.render("dashboard/views/admin/new.ejs", { title: "admin new", data });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "There is something wrong while opening page", msg: "Can't get new admin page" });
    }
  }
  async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const createdAdminData: IAdminUser = req.body;
      const roles = await role.findAll();
      const rolesIds = [];
      for (const roleObj of roles) rolesIds.push(roleObj["id"]);
      if (!createdAdminData || !rolesIds.includes(Number(createdAdminData.role_id))) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
      if (!helpers.regularExprEmail(createdAdminData.email)) return res.status(httpStatus.BAD_REQUEST).json({ msg: "invalid email" });
      const existedAdmin = await admin.findOne({ where: { email: createdAdminData.email } });
      const existedAdminInUsersModel = await new UserController().getUserByEmail(createdAdminData.email);
      if (existedAdmin || existedAdminInUsersModel) return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "This user is already exists with this email" });
      const password = await bcrypt.hash(createdAdminData.password, 10);
      const existedAdminWithPass = await admin.findOne({ where: { password } });
      if (existedAdminWithPass) return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "This password is already exists" });
      const request = { fullName: createdAdminData.fullName, email: createdAdminData.email, phone: createdAdminData.phone, role_id: createdAdminData.role_id, password };
      await admin.create(request);
      return res.status(httpStatus.OK).json({ msg: "new admin created" });
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "There is some wrong while adding admin", msg: "Can't add admin" });
    }
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await role.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
      const data = await admin.findOne({ where: { id: req.params.id }, attributes: { exclude: ["id", "createdAt", "updatedAt"] }, raw: true });
      return res.render("dashboard/views/admin/edit.ejs", { title: "Edit admin", data, roles });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "There is something wrong while opening page", msg: "Can't get admin data for edit page" });
    }
  }
  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedAdminData: IAdminUser = req.body;
      const roles = await role.findAll();
      const rolesIds = [];
      for (const roleObj of roles) rolesIds.push(roleObj["id"]);
      if (!updatedAdminData || !rolesIds.includes(Number(updatedAdminData.role_id))) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
      if (updatedAdminData.email && !helpers.regularExprEmail(updatedAdminData.email)) return res.status(httpStatus.BAD_REQUEST).json({ msg: "invalid email" });
      if (updatedAdminData.password) {
        const password: string = await bcrypt.hash(updatedAdminData.password, 5);
        req.body.password = password;
      }
      await admin.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "admin edited" });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "There is something wrong while updating admin", msg: "Can't update admin data" });
    }
  }
  public async getAdminByEmail(email: string) {
    try {
      return await admin.findOne({ where: { email }, attributes: ["fullName"] });
    } catch (error) {
      throw error;
    }
  }
}
