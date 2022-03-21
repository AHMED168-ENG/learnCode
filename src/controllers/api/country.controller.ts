import country from "../../models/country.model"
import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"

export class CountryController extends Controller {
  constructor() {
    super()
  }
  list(req: Request, res: Response, next: NextFunction) {
    const ar_en = req["lang"] == "en" ? "en_name" : "ar_name"
    country
      .findAll({attributes: {include: [[ar_en, "name"]], exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]}})
      .then((countries) => {
        res.status(httpStatus.ACCEPTED).json(countries)
      })
      .catch(() => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "error in get countries"})
      })
  }
}
