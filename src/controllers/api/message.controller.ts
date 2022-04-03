import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import message from "../../models/message.model"
import webAppsUsers from "../../models/user.model"

export class MessageController {
  send(req: Request, res: Response, next: NextFunction) {
    const body = {name: req.body.name, email: req.body.email, body: req.body.body.replace(/(\r\n|\n|\r)/gm, "")}
    message
      .create({...body})
      .then((data) => {
        res.status(httpStatus.ACCEPTED).json(data)
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "error"})
      })
  }
}
