import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import region from "../../models/region.model"

export class RegionController extends Controller {
  constructor() {
    super()
  }
  byCountryAndCity(req: Request, res: Response, next: NextFunction) {
    const ar_en = req["lang"] == "en" ? "en_name" : "ar_name"
    const countryId = req.params.countryId
    const cityId = req.params.cityId
    region
      .findAll({
        where: {country_id: countryId, city_id: cityId},
        attributes: {include: [[ar_en, "name"]], exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]},
      })
      .then((regions) => {
        res.status(httpStatus.ACCEPTED).json(regions)
      })
      .catch(() => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "error in get regions"})
      })
  }
}
