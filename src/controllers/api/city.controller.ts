import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import city from "../../models/city.model"
import httpStatus from "http-status"
import {Model} from "sequelize/types"

export class CityController extends Controller {
  constructor() {
    super()
  }
  byCountry(req: Request, res: Response, next: NextFunction) {
    const ar_en = req["lang"] == "en" ? "en_name" : "ar_name"
    const countryId = req.params.countryId
    city
      .findAll({where: {country_id: countryId}, attributes: {include: [[ar_en, "name"]], exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]}})
      .then((cities) => {
        res.status(httpStatus.ACCEPTED).json(cities)
      })
      .catch((err) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "error in get cities"})
      })
  }
  async homelist(lang: string): Promise<Model<any, any>[] | null> {
    const ar_en = lang == "en" ? "en_name" : "ar_name"
    let data: Model<any, any>[] | null
    await city
      .findAll({attributes: {include: [[ar_en, "name"]], exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]}})
      .then((d) => {
        if (!d || d.length == 0) {
          data = null
        } else {
          data = d
        }
      })
      .catch((err) => {
        data = null
      })
    return data
  }
}
