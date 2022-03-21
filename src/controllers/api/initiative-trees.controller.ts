import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import trees from "../../models/trees.model"
import initiativeTrees from "../../models/initiative-trees.model"
import sequelize from "sequelize"
import cart from "../../models/cart.model"
import initiativeLocations from "../../models/initiative-location.model"
import city from "../../models/city.model"
export class InitiativesTreesController extends Controller {
  constructor() {
    super()
  }
  locationTrees(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.user_id
    const lang = req["lang"] == "en"
    const treeName = lang ? "en_name" : "ar_name"
    const locationId = req.params.locationId
    const limit = (Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)) || 50
    const page = (Number(req.query.page) - 1) * limit || 0
    const where = {location_id: locationId, status: "active", deleted: "no"}

    const sort: any = req.query.sort == "alpha" ? [trees, treeName, "ASC"] : req.query.sort == "price" ? ["price", "ASC"] : ["id", "ASC"]

    initiativeTrees
      .findAndCountAll({
        limit: limit,
        offset: page,
        where: where,
        attributes: [
          "id",
          "carbon_points",
          "price",
          [sequelize.col("tbl_tree.tree_id"), "treeIdInfo"],
          [sequelize.col("tbl_tree.img_tree"), "img"],
          [sequelize.col(`tbl_tree.${treeName}`), "name"],
          [
            sequelize.literal(`(
          SELECT count(qty) as qty
          FROM tbl_carts
          WHERE
          user_id= ${userId}
          AND tree_id= tbl_initiatives_trees.id
          )`),
            "inCart",
          ],
          [
            sequelize.literal(`(
                tbl_initiatives_trees.target_num
                -
                COALESCE((SELECT SUM(tbl_orders_details.quantity)
                FROM tbl_orders_details ,tbl_orders
                WHERE
                tbl_orders_details.tree_id = tbl_initiatives_trees.id AND
                tbl_orders.status = "inprogress"),0)
                )`),
            "stock",
          ],
        ],
        include: [{model: trees, attributes: []}],
        order: [sort],
        raw: true,
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
        res.status(httpStatus.NOT_FOUND).json({err, msg: "Not found"})
      })
  }
  locationTreeDetails(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.user_id
    const lang = req["lang"] == "en"
    const treeName = lang ? "en_name" : "ar_name"
    const slug = lang ? "slug_en" : "slug_ar"
    const description = lang ? "en_description" : "ar_description"
    const locationName = lang ? "location_nameEn" : "location_nameAr"
    const cityName = lang ? "en_name" : "ar_name"
    const locationTreeId = req.params.locationTreeId
    const where = {id: locationTreeId}

    initiativeTrees
      .findOne({
        where: where,
        attributes: [
          "id",
          "carbon_points",
          "price_points",
          "price",
          "deleted",
          "status",
          [sequelize.col(`tbl_initiatives_location.${locationName}`), "locationName"],
          [sequelize.col(`tbl_initiatives_location.tbl_city.${cityName}`), "city"],
          [sequelize.col("tbl_tree.tree_id"), "treeIdInfo"],
          [sequelize.col("tbl_tree.img_tree"), "img"],
          [sequelize.col(`tbl_tree.${treeName}`), "name"],
          [sequelize.col(`tbl_tree.${slug}`), "slug"],
          [sequelize.col(`tbl_tree.${description}`), "description"],
          [
            sequelize.literal(`(
            SELECT SUM(qty) as qty
            FROM tbl_carts
            WHERE
            user_id= ${userId}
            AND tree_id=${locationTreeId}
          )`),
            "cartQty",
          ],
          [
            sequelize.literal(`(
            SELECT count(qty) as qty
            FROM tbl_carts
            WHERE
            user_id= ${userId}
            AND tree_id=${locationTreeId}
            )`),
            "inCart",
          ],
          [
            sequelize.literal(`(
              tbl_initiatives_trees.target_num
              -
              COALESCE((SELECT SUM(tbl_orders_details.quantity)
              FROM tbl_orders_details ,tbl_orders
              WHERE
              tbl_orders_details.tree_id = tbl_initiatives_trees.id AND
              tbl_orders.status = "inprogress"),0)
              )`),
            "stock",
          ],
        ],
        include: [
          {model: initiativeLocations, attributes: [], include: [{model: city, attributes: []}]},
          {model: trees, attributes: []},
        ],
        raw: true,
      })
      .then((data) => {
        res.status(httpStatus.OK).json(data)
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "Not found"})
      })
  }
}
