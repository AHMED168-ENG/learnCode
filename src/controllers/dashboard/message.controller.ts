import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import message from "../../models/message.model"
import webAppsUsers from "../../models/user.model"

export class MessageController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("message/list.ejs", {
      title: "message",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    message
      .findAll({
        limit: limit,
        offset: page,
        attributes: {exclude: ["updatedAt"]},
        include: [{model: webAppsUsers, attributes: ["fullName", "user_img"]}],
      })
      .then((data) => {
        message
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err, msg: "not found message"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found message"})
      })
  }
  async lastNewMessage() {
    let data
    await message
      .findAll({
        limit: 4,
        offset: 0,
        where: {status: "unread"},
        attributes: {exclude: ["body", "updatedAt"]},
        include: [{model: webAppsUsers, attributes: ["fullName", "user_img"]}],
      })
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
}
