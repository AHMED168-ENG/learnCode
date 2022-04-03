import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import partner from "../../models/partner.model"
import partnerType from "../../models/partner-type.model"

export class PartnerController extends Controller {
  constructor() {
    super()
  }
  list(req: Request, res: Response, next: NextFunction) {
    const ar_en = req["lang"] == "en" ? "en_name" : "ar_name"
    partnerType
      .findAll({attributes: [[ar_en, "name"]], include: [{model: partner, attributes: [[ar_en, "name"], "img"]}]})
      .then((data) => {
        res.status(httpStatus.ACCEPTED).json({data})
      })
      .catch(() => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "error in get"})
      })
  }
}
