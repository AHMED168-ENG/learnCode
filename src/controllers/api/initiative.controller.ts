import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import initiatives from "../../models/initiative.model"
import sequelize from "sequelize"
import city from "../../models/city.model"
import initiativesImg from "../../models/initiativeImg.model"
import favouriteInitiative from "../../models/initiative-favourite.model"

export class IinitiativeController extends Controller {
  notRequireFild = ["updatedAt", "createdAt"]
  constructor() {
    super()
  }
  list(req: Request, res: Response, next: NextFunction) {
    const ar_en = req["lang"] == "en" ? "init_en_name" : "init_ar_name"
    const ar_enCity = req["lang"] == "en" ? "en_name" : "ar_name"

    const limit = (Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)) || 50
    const page = (Number(req.query.page) - 1) * limit || 0
    const cities = req.query.cities ? String(req.query.cities).split(",").map(Number) : []
    const where = cities.length > 0 ? {city_id: cities} : {}
    const attributes: any = new IinitiativeController().selectionFields(ar_en, req.user.user_id)
    initiatives
      .findAndCountAll({
        limit: limit,
        offset: page,
        where: where,
        include: [{model: city, attributes: {include: [[ar_enCity, "name"]], exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]}}],
        attributes: [...attributes],
      })
      .then((data) => {
        const dataPagination = {
          total: data.count,
          limit: limit,
          page: Number(req.query.page),
          pages: Math.ceil(data.count / limit),
          data: data.rows,
        }
        res.status(httpStatus.OK).json(dataPagination)
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({msg: "not found initiatives"})
      })
  }
  initiativeDetails(req: Request, res: Response, next: NextFunction) {
    const initId = req.params.id
    const lang = req["lang"] == "en"
    const cityName = lang ? "en_name" : "ar_name"
    const initName = lang ? "init_en_name" : "init_ar_name"
    const initslug = lang ? "slug_en" : "slug_ar"
    const initDescription = lang ? "init_en_description" : "init_ar_description"
    initiatives
      .findOne({
        where: {init_id: initId},
        attributes: [
          [initName, "name"],
          [initDescription, "description"],
          [initslug, "slug"],
          "from_date",
          "to_date",
          "logo",
          [
            sequelize.literal(`(
              SELECT SUM(target_num) as target_num
              FROM tbl_initiatives_trees AS initiativeTrees
              WHERE
              initiativeTrees.init_id_pk = tbl_initiatives.init_id
              AND initiativeTrees.status='active'
              AND initiativeTrees.deleted='no'
            )`),
            "treesCount",
          ],
          [
            sequelize.literal(`(
              SELECT SUM(carbon_points) as carbonPoint
              FROM tbl_initiatives_trees AS initiativeTrees
              WHERE
              initiativeTrees.init_id_pk = tbl_initiatives.init_id
              AND initiativeTrees.status='active'
              AND initiativeTrees.deleted='no'
            )`),
            "carbonPoint",
          ],
          [
            sequelize.literal(`(
          SELECT img
          FROM tbl_sponsers
          WHERE
          tbl_sponsers.sponser_id= tbl_initiatives.sponsor_id
          )`),
            "sponsorImg",
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(*)
            FROM tbl_initiatives_favourites
            WHERE
            user_id=${req.user.user_id}
            AND init_id = tbl_initiatives.init_id
            )`),
            "favorite",
          ],
          [
            sequelize.literal(`(
              COALESCE((SELECT SUM(tbl_orders_details.quantity)
              FROM tbl_orders_details ,tbl_orders
              WHERE
              tbl_orders_details.initiative_id = tbl_initiatives.init_id AND
              tbl_orders.status = "inprogress"),0)
              )`),
            "used",
          ],
        ],
        include: [
          {model: city, attributes: {include: [[cityName, "name"]], exclude: ["code", "en_name", "ar_name", "createdAt", "updatedAt"]}},
          {model: initiativesImg, attributes: {exclude: ["init_id", "img_id", "createdAt", "updatedAt"]}},
        ],
      })
      .then((data) => {
        res.status(httpStatus.OK).json(data)
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({msg: "not found initiative"})
      })
  }

  featuredInitiatives(req: Request, res: Response, next: NextFunction) {
    const ar_en = req["lang"] == "en" ? "init_en_name" : "init_ar_name"
    const cityId = req.params.cityId
    const attributes: any = new IinitiativeController().selectionFields(ar_en, req.user.user_id)
    initiatives
      .findAll({
        limit: 5,
        where: {city_id: cityId},
        include: [{model: city, attributes: {exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]}}],
        attributes: [...attributes],
      })
      .then((data) => {
        res.status(httpStatus.OK).json(data)
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({msg: "not found initiatives"})
      })
  }
  relatedInitiatives(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    const ar_en = req["lang"] == "en" ? "init_en_name" : "init_ar_name"
    const initId = req.params.initId
    const attributes: any = new IinitiativeController().selectionFields(ar_en, req.user.user_id)
    const where = {
      init_id: {
        [sequelize.Op.not]: initId,
      },
    }
    initiatives
      .findAndCountAll({
        limit: limit,
        offset: page,
        where: where,
        include: [{model: city, attributes: {exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]}}],
        attributes: [...attributes],
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
        res.status(httpStatus.NOT_FOUND).json({msg: "not found initiatives"})
      })
  }
  favourite(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.user_id
    const ar_en = req["lang"] == "en" ? "init_en_name" : "init_ar_name"
    const attributes: any = new IinitiativeController().selectionFields(ar_en, req.user.user_id)

    initiatives
      .findAll({
        where: {"$tbl_initiatives_favourites.user_id$": userId},
        attributes: [...attributes],
        include: [{model: favouriteInitiative, attributes: [], required: true}],
      })
      .then((data) => {
        res.status(httpStatus.OK).json(data)
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found initiatives"})
      })
  }
  private selectionFields(nameField, userId) {
    return [
      "init_id",
      [nameField, "name"],
      "logo",
      [
        sequelize.literal(`(
        SELECT SUM(target_num) as target_num
        FROM tbl_initiatives_trees AS initiativeTrees
        WHERE
        initiativeTrees.init_id_pk = tbl_initiatives.init_id
        AND initiativeTrees.status='active'
        AND initiativeTrees.deleted='no'
      )`),
        "treesCount",
      ],
      [
        sequelize.literal(`(
      SELECT img
      FROM tbl_initiatives_imgs AS initiativesImg
      WHERE
      initiativesImg.init_id = tbl_initiatives.init_id limit 1
      )`),
        "img",
      ],
      [
        sequelize.literal(`(
        SELECT SUM(carbon_points) as carbonPoint
        FROM tbl_initiatives_trees AS initiativeTrees
        WHERE
        initiativeTrees.init_id_pk = tbl_initiatives.init_id
        AND initiativeTrees.status='active'
        AND initiativeTrees.deleted='no'
      )`),
        "carbonPoint",
      ],
      [
        sequelize.literal(`(
      SELECT img
      FROM tbl_sponsers
      WHERE
      tbl_sponsers.sponser_id= tbl_initiatives.sponsor_id
      )`),
        "sponsorImg",
      ],
      [
        sequelize.literal(`(
      SELECT COUNT(*)
      FROM tbl_initiatives_favourites
      WHERE
      user_id=${userId}
      AND init_id = tbl_initiatives.init_id
      )`),
        "favorite",
      ],
      [
        sequelize.literal(`(
          COALESCE((SELECT SUM(tbl_orders_details.quantity)
          FROM tbl_orders_details ,tbl_orders
          WHERE
          tbl_orders_details.initiative_id = tbl_initiatives.init_id AND
          tbl_orders.status = "inprogress"),0)
          )`),
        "used",
      ],
    ]
  }
}
