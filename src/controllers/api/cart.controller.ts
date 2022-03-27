import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import cart from "../../models/cart.model"
import initiativeTrees from "../../models/initiative-trees.model"
import trees from "../../models/trees.model"
import sequelize from "sequelize"
import initiativeLocations from "../../models/initiative-location.model"
import city from "../../models/city.model"

export class CartController extends Controller {
  constructor() {
    super()
  }
  addOrUpdate(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.user_id
    const qty = req.body.qty
    const treeId = req.body.treeId
    const where = {user_id: userId, tree_id: treeId}
    if (Number(treeId) <= 0 || Number(qty) <= 0) {
      res.status(httpStatus.BAD_REQUEST).json({msg: "QTY should be greater than `zero` "})
    } else {
      cart
        .findOrCreate({
          where: where,
          defaults: {...where, qty},
        })
        .then((data) => {
          if (!data[1]) {
            cart
              .update({qty}, {where: where})
              .then(() => {
                res.status(httpStatus.OK).json({msg: "update successfully"})
              })
              .catch((err) => {
                res.status(httpStatus.NOT_FOUND).json({msg: "Error happend"})
              })
          } else {
            res.status(httpStatus.OK).json({msg: "Add successfully"})
          }
        })
        .catch((err) => {
          res.status(httpStatus.NOT_FOUND).json({msg: "Error happend"})
        })
    }
  }
  remove(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.user_id
    const treeId = req.params.treeId
    const where = {user_id: userId, tree_id: treeId}
    cart
      .destroy({where: where})
      .then(() => {
        res.status(httpStatus.OK).json({msg: "Remove successfully"})
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({msg: "Error happend"})
      })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const lang = req["lang"] == "en"
    const langName = lang ? "en_name" : "ar_name"
    const locationName = lang ? "location_nameEn" : "location_nameAr"
    const userId = req.user.user_id
    cart
      .findAll({
        where: {user_id: userId},
        attributes: [
          "id",
          "qty",
          [sequelize.col("tbl_initiatives_tree.id"), "treeId"],
          [sequelize.col("tbl_initiatives_tree.carbon_points"), "carbon"],
          [sequelize.col("tbl_initiatives_tree.price"), "price"],
          [sequelize.col("tbl_initiatives_tree.status"), "status"],
          [sequelize.col("tbl_initiatives_tree.deleted"), "deleted"],
          [sequelize.col("tbl_initiatives_tree.tbl_tree.tree_id"), "treeIdInfo"],
          [sequelize.col("tbl_initiatives_tree.tbl_tree.img_tree"), "img"],
          [sequelize.col(`tbl_initiatives_tree.tbl_tree.${langName}`), "name"],
          [sequelize.literal("(`tbl_initiatives_tree`.`price` * `tbl_cart`.`qty`)"), "itemTotal"],
          [sequelize.col(`tbl_initiatives_tree.tbl_initiatives_location.${locationName}`), "locationName"],
          [sequelize.col(`tbl_initiatives_tree.tbl_initiatives_location.tbl_city.${langName}`), "cityName"],
          [
            sequelize.literal(`(
              SELECT COALESCE(target_num,0)
              -
              (SELECT COALESCE(SUM(tbl_orders_details.quantity),0)
              FROM tbl_orders_details,tbl_orders
              WHERE tbl_orders_details.tree_id = tbl_cart.tree_id AND tbl_orders.status = "inprogress")
              )`),
            "stock",
          ],
        ],
        include: [
          {
            model: initiativeTrees,
            attributes: [],
            include: [
              {model: trees, attributes: []},
              {model: initiativeLocations, attributes: [], include: [{model: city, attributes: []}]},
            ],
          },
        ],
        raw: true,
      })
      .then((data: any) => {
        const amountTotal: number = data.reduce((total, currentValue) => {
          return total + currentValue.itemTotal
        }, 0)
        const cartItems = {amountTotal, data: data}
        res.status(httpStatus.OK).json(cartItems)
      })
      .catch((err) => res.status(httpStatus.NOT_FOUND).json({msg: "error in get list cart", err}))
  }
  async check(user) {
    const userId = user
    let result
    await cart
      .findAll({
        where: {user_id: userId},
        attributes: [
          "id",
          ["qty", "quantity"],
          [sequelize.col("tbl_initiatives_tree.id"), "tree_id"],
          [sequelize.col("tbl_initiatives_tree.carbon_points"), "carbon"],
          [sequelize.col("tbl_initiatives_tree.price_points"), "sahlanPoint"],
          [sequelize.col("tbl_initiatives_tree.location_id"), "location_id"],
          [sequelize.col("tbl_initiatives_tree.init_id_pk"), "initiative_id"],
          [sequelize.col("tbl_initiatives_tree.price"), "price"],
          [sequelize.col("tbl_initiatives_tree.status"), "status"],
          [sequelize.col("tbl_initiatives_tree.deleted"), "deleted"],
          [sequelize.literal("(`tbl_initiatives_tree`.`price` * `tbl_cart`.`qty`)"), "itemTotal"],
          [
            sequelize.literal(`(
              SELECT COALESCE(target_num,0)
              -
              (SELECT COALESCE(SUM(tbl_orders_details.quantity),0)
              FROM tbl_orders_details,tbl_orders
              WHERE tbl_orders_details.tree_id = tbl_cart.tree_id AND tbl_orders.status = "inprogress")
              )`),
            "stock",
          ],
        ],
        include: [
          {
            model: initiativeTrees,
            attributes: [],
            include: [
              {model: trees, attributes: []},
              {model: initiativeLocations, attributes: [], include: [{model: city, attributes: []}]},
            ],
          },
        ],
        raw: true,
      })
      .then((data: any) => {
        const amountTotal: number = data.reduce((total, currentValue) => {
          return total + currentValue.itemTotal
        }, 0)
        const totalSahlanPoint: number = data.reduce((total, currentValue) => {
          return total + currentValue.sahlanPoint * currentValue.quantity
        }, 0)
        const totalCarbonPoint: number = data.reduce((total, currentValue) => {
          return total + currentValue.carbon * currentValue.quantity
        }, 0)
        const cartItems = {totalSahlanPoint, totalCarbonPoint, amountTotal, data: data}
        result = cartItems
      })
      .catch((err) => (result = null))
    return result
  }
  async cardCount(userId) {
    let data
    await cart
      .count({where: {user_id: userId}})
      .then((d) => {
        data = d
      })
      .catch((err) => {
        data = null
      })
    return data
  }
}

// [
//   sequelize.literal(`(
//     SELECT COALESCE(target_num,0)
//     -
//     COALESCE((SELECT SUM(tbl_orders_details.quantity)
//     FROM tbl_orders_details ,tbl_orders
//     WHERE
//     tbl_orders_details.tree_id = tbl_cart.tree_id AND
//     tbl_orders.status = "inprogress"),0)
//     from tbl_initiatives_trees
//     WHERE id = tbl_initiatives_tree.id
//     )`),
//   "stock",
// ],
