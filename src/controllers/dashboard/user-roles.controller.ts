import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import role from "../../models/user-roles.model";
export class UserRolesController {
  listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("user-roles/list.ejs", { title: "User Roles" });
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    role
      .findAll({
        limit: limit,
        offset: page,
        attributes: {exclude: ["updatedAt"]},
      })
      .then((data) => {
        role
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting user roles", msg: "not found user roles"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting user roles", msg: "not found user roles"})
      })
  }
  newPage(req: Request, res: Response, next: NextFunction) {
    return res.render("user-roles/new.ejs", { title: "user-roles new" });
  }
  addNew(req, res: Response, next: NextFunction) {
    role
      .create(req.body)
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "new user roles created"})
      })
      .catch((err) => {
        res.status(400).json({msg: "Error in create new user roles", err: err.errors[0].message || "unexpected error"})
      })
  }
  editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    role.findOne({where: {id: id}, attributes: { exclude: ["id", "createdAt", "updatedAt"] }, raw: true}).then((data) => {
      res.render("user-roles/edit.ejs", {
        title: "Edit User Roles",
        data: data,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const id = req.params.id
    role
      .update(req.body, {where: {id: id}})
      .then((data) => {
        res.status(httpStatus.OK).json({msg: "user roles edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in edit user roles", err: err.errors[0].message || "unexpected error"})
      })
  }
}
