import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import message from "../../models/message.model"
import webAppsUsers from "../../models/user.model"

export class MessageController {
  listPage(req: Request, res: Response, next: NextFunction) {
    const screenType = req.params.type
    res.render("message/list.ejs", {
      title: "message",
      type: screenType,
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    const screenType = req.params.type
    message
      .findAll({
        where: {status: screenType},
        limit: limit,
        offset: page,
        attributes: {exclude: ["body", "updatedAt"]},
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
  view(req: Request, res: Response, next: NextFunction) {
    const messageId = req.params.id
    message
      .findOne({
        where: {message_id: messageId},
      })
      .then((data) => {
        res.render("message/view.ejs", {
          title: "View message",
          data: data,
        })
      })
      .catch((err) => {})
  }
  async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const messageId = req.params.id;
      await message.update({ status: "read" }, { where: { message_id: messageId } });
      return res.status(httpStatus.OK).json({ msg: "message edited" });
    } catch (err) {
      return res.status(httpStatus.BAD_REQUEST).json({ msg: "Error in Edit message", err: err.errors[0].message || "unexpected error" });
    }
  }
  async lastNewMessage() {
    let data
    await message
      .findAll({
        limit: 4,
        offset: 0,
        where: {status: "unread"},
        attributes: {exclude: ["body", "updatedAt"]},
        order: [["createdAt", "DESC"]],
      })
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
}
