import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import sector from "../../models/sector.model"

export class SectorController extends Controller {
  constructor() {
    super()
  }
  list(req: Request, res: Response, next: NextFunction) {
    const ar_en = req["lang"] == "en" ? "en_name" : "ar_name"
    sector
      .findAll({attributes: {include: [[ar_en, "name"]], exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]}})
      .then((sectors) => {
        res.status(httpStatus.ACCEPTED).json(sectors)
      })
      .catch(() => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "error in get sectors"})
      })
  }
}
