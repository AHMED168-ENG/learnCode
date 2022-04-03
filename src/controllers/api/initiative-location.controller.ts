import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import initiativeLocations from "../../models/initiative-location.model"
import sequelize from "sequelize"
import city from "../../models/city.model"
export class InitiativesLocationController extends Controller {
  constructor() {
    super()
  }
  list(req: Request, res: Response, next: NextFunction) {
    const initId = req.query.init ? {init_id: req.query.init} : {}
    const lang = req["lang"] == "en"
    const cityName = lang ? "en_name" : "ar_name"
    const locationName = lang ? "location_nameEn" : "location_nameAr"

    const limit = (Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)) || 50
    const page = (Number(req.query.page) - 1) * limit || 0
    const cities = req.query.cities ? String(req.query.cities).split(",").map(Number) : []
    const where = cities.length > 0 ? {city_id: cities, ...initId} : {...initId}
    const attributes: any = new InitiativesLocationController().selectionFields()

    initiativeLocations
      .findAndCountAll({
        limit: limit,
        offset: page,
        where: where,
        attributes: ["location_id", [locationName, "location_name"], ...attributes],
        include: [{model: city, attributes: {include: [[cityName, "name"]], exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]}}],
      })
      .then((data) => {
        const dataPagination = {
          total: data["count"],
          limit: limit,
          page: Number(req.query.page),
          pages: Math.ceil(data["count"] / limit),
          data: data["rows"],
        }
        res.status(httpStatus.OK).json(dataPagination)
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found Locations"})
      })
  }
  details(req: Request, res: Response, next: NextFunction) {
    const locationId = req.params.id
    const lang = req["lang"] == "en"
    const cityName = lang ? "en_name" : "ar_name"
    const locationName = lang ? "location_nameEn" : "location_nameAr"
    const about = lang ? "aboutEn" : "aboutAr"
    const attributes: any = new InitiativesLocationController().selectionFields()
    initiativeLocations
      .findOne({
        where: {location_id: locationId},
        attributes: ["location_id", [locationName, "location_name"], [about, "about"], ...attributes],
        include: [{model: city, attributes: {include: [[cityName, "name"]], exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]}}],
      })
      .then((data) => {
        res.status(httpStatus.OK).json(data)
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found Locations"})
      })
  }

  async WhereLikeToPlant(lang: string) {
    const ar_en_city = lang == "en" ? "en_name" : "ar_name"
    const locationName = lang ? "location_nameEn" : "location_nameAr"
    const attributes: any = new InitiativesLocationController().selectionFields()
    let data
    await initiativeLocations
      .findAll({
        limit: 5,
        attributes: ["location_id", [locationName, "location_name"], ...attributes],
        include: [{model: city, attributes: {include: [[ar_en_city, "name"]], exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]}}],
      })
      .then((d) => (data = d))
      .catch((e) => {
        data = null
      })
    return data
  }

  private selectionFields() {
    return [
      "img",
      "caverArea",
      "location_lat",
      "location_long",
      [
        sequelize.literal(`(
        SELECT MIN(price) as fromPrice
        FROM tbl_initiatives_trees AS initiativeTrees
        WHERE
        initiativeTrees.location_id = tbl_initiatives_locations.location_id
        AND initiativeTrees.status='active'
        AND initiativeTrees.deleted='no'
    )`),
        "fromPriceTree",
      ],
      [
        sequelize.literal(`(
        SELECT SUM(target_num) as target_num
        FROM tbl_initiatives_trees AS initiativeTrees
        WHERE
        initiativeTrees.location_id = tbl_initiatives_locations.location_id
        AND initiativeTrees.status='active'
        AND initiativeTrees.deleted='no'
    )`),
        "treesCount",
      ],
      [
        sequelize.literal(`(
        SELECT SUM(carbon_points) as carbon_points
        FROM tbl_initiatives_trees AS initiativeTrees
        WHERE
        initiativeTrees.location_id = tbl_initiatives_locations.location_id
        AND initiativeTrees.status='active'
        AND initiativeTrees.deleted='no'
    )`),
        "carbonPoints",
      ],
      [
        sequelize.literal(`(
          COALESCE((SELECT SUM(tbl_orders_details.quantity)
          FROM tbl_orders_details ,tbl_orders
          WHERE
          tbl_orders_details.location_id = tbl_initiatives_locations.location_id AND
          tbl_orders.status = "inprogress"),0)
          )`),
        "used",
      ],
    ]
  }
}

// {model: city, attributes: {include: [[ar_en_city, "name"]], exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]}},

// attributes: [[sequelize.fn("min", sequelize.col("price")), "minPrice"]],
// order: [[initiativeTrees,"price", "asc"]],

// through: {
//   where: {
//     location_id: sequelize.literal("tbl_initiatives_locations.location_id"),
//   },
//   attributes: [],
// },
