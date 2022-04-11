import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import sequelize, {Op, where} from "sequelize"
import config from "../../config/config"
import initiativeLocations from "../../models/initiative-location.model"
import initiativeTrees from "../../models/initiative-trees.model"
import initiatives from "../../models/initiative.model"
import orderDetails from "../../models/order-details.model"
import order from "../../models/order.model"
import trees from "../../models/trees.model"
import webAppsUsers from "../../models/user.model"
import {Sequelize, DataTypes} from "sequelize"
const seq = new Sequelize(...config.database)

export class OrderController {
  listPageNew(req: Request, res: Response, next: NextFunction) {
    res.render("new-order/list.ejs", {
      title: "New Order",
      data: {type: "New orders"},
      type: "new",
    })
  }
  listPageInprogress(req: Request, res: Response, next: NextFunction) {
    res.render("new-order/list.ejs", {
      title: "Inprogress Order",
      data: {type: "Inprogress orders"},
      type: "inprogress",
    })
  }
  listPageCancelled(req: Request, res: Response, next: NextFunction) {
    res.render("new-order/list.ejs", {
      title: "Cancelled Order",
      data: {type: "Cancelled orders"},
      type: "cancelled",
    })
  }
  listPageCompleted(req: Request, res: Response, next: NextFunction) {
    res.render("new-order/list.ejs", {
      title: "Completed Order",
      data: {type: "Completed orders"},
      type: "completed",
    })
  }
  view(req: Request, res: Response, next: NextFunction) {
    const orderId = req.params.id
    order
      .findOne({
        where: {order_id: orderId},
        include: [
          {
            model: orderDetails,
            include: [
              {model: initiatives, attributes: ["init_ar_name", "init_en_name"]},
              {model: initiativeLocations, attributes: ["location_nameAr", "location_nameEn"]},
              {model: initiativeTrees, attributes: ["id"], include: [{model: trees, attributes: ["en_name", "ar_name", "img_tree"]}]},
            ],
          },
        ],
      })
      .then((data) => {
        res.render("new-order/view.ejs", {
          title: "View Order",
          data: data.get({plain: true}),
        })
      })
      .catch((err) => {})
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit ? (Number(req.query.page) - 1) * limit : 0
    const screenType = req.params.type
    order
      .findAll({
        where: {status: screenType},
        limit: limit,
        offset: page,
        order: [['createdAt', 'DESC']],
        attributes: {exclude: ["updatedAt"]},
        raw: true,
      })
      .then((data) => {
        order
          .count({where: {status: screenType}})
          .then((count) => {
            const dataInti = {
              total: count,
              limit: limit,
              page: Number(req.query.page),
              pages: Math.ceil(count / limit),
              data: data,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err, msg: "not found order"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found order"})
      })
  }
  async listreport(req: Request, res: Response, next: NextFunction) {
    const fromTo = req.query.from != "null" ? {createdAt: {[Op.and]: [{[Op.gte]: req.query.from}, {[Op.lte]: req.query.to}]}} : {}
    const screenType = req.params.type == "all" ? {} : {status: req.params.type}
    const ordersChart = (await new OrderController().ordersInYear({from: req.query.from, to: req.query.to, type: req.params.type})) || []
    order
      .findAll({
        where: {...screenType, ...fromTo},
        attributes: {exclude: ["updatedAt"]},
        raw: true,
      })
      .then((data) => {
        order
          .count({where: screenType})
          .then((count) => {
            const dataInti = {
              total: count,
              ordersChart: ordersChart,
              data: data,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err, msg: "not found order"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found order"})
      })
  }
  changeStatus(req: Request, res: Response, next: NextFunction) {
    const orderId = req.params.id
    const status = req.query.status
    order
      .update({status: status}, {where: {order_id: orderId}})
      .then((d) => {
        if (status == "completed") {
          order.findByPk(orderId, {attributes: ["user_id", "carbon_gained_points", "sahlan_gained_points"], raw: true}).then((orderData: any) => {
            webAppsUsers.increment(
              {carbon_gained_points: +orderData.carbon_gained_points, sahlan_gained_points: +orderData.sahlan_gained_points},
              {where: {user_id: orderData.user_id}}
            )
          })
        }
        res.status(httpStatus.OK).json({msg: "order edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit order", err: err.errors[0].message || "unexpected error"})
      })
  }
  test(req: Request, res: Response, next: NextFunction) {
    console.log("object")
    // initiatives
    //   .findAll({
    //     include: [{model: orderDetails}],
    //   })
    //   .then((d) => {
    //     res.status(httpStatus.OK).json(d)
    //   })
    //   .catch((err) => {
    //     res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit order", err: err.errors[0].message || "unexpected error"})
    //   })
  }
  async numberOfOrders() {
    let data
    await order
      .findOne({
        attributes: [
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(order_id),0)
              FROM tbl_orders
              WHERE tbl_orders.status = "inprogress"
          )`),
            "inProgress",
          ],
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(order_id),0)
              FROM tbl_orders
              WHERE tbl_orders.status = "new"
          )`),
            "New",
          ],
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(order_id),0)
              FROM tbl_orders
              WHERE tbl_orders.status = "completed"
          )`),
            "completed",
          ],
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(order_id),0)
              FROM tbl_orders
              WHERE tbl_orders.status = "cancelled"
          )`),
            "cancelled",
          ],
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(order_id),0)
              FROM tbl_orders
          )`),
            "totalOrder",
          ],
        ],
        raw: true,
      })
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
  async ordersInYear(where = {}) {
    // ({from: req.query.from, to: req.query.to, type: req.params.type})
    // createdAt >= ${where["from"]} AND createdAt <= ${where["to"]} AND
    console.log(where)
    console.log(where["type"])
    const whereCon =
      where["type"] != "all" && where != undefined && Object.keys(where).length != 0
        ? `status ='${where["type"]}' AND YEAR(createdAt) = YEAR(CURDATE())`
        : "YEAR(createdAt) = YEAR(CURDATE())"
    let data
    await seq
      .query(
        `SELECT MONTHNAME(createdAt) AS MONTH, COUNT(*) AS "count", ROUND( COALESCE( SUM(all_sum-( all_sum * COALESCE((promo_code_percent / 100), 0)) ), 0 ) ) AS "allSum"
               FROM tbl_orders WHERE ${whereCon} GROUP BY MONTH`,
        {type: sequelize.QueryTypes.SELECT}
      )
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
  async lastNewOrders() {
    let data
    await order
      .findAll({
        where: {status: "new"},
        limit: 4,
        offset: 0,
        attributes: ["order_id", "createdAt"],
        include: [{model: webAppsUsers, attributes: ["fullName", "user_img"]}],
        order: [["createdAt", "DESC"]],
      })
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
}

// [sequelize.col("tbl_orders_details.id"), "detailsId"],
// [sequelize.col("tbl_orders_details.initiative_id"), "initId"],
// [sequelize.col("tbl_orders_details.location_id"), "locationId"],
// [sequelize.col("tbl_orders_details.tree_id"), "initTreeId"],
// [sequelize.col("tbl_orders_details.price"), "price"],
// [sequelize.col("tbl_orders_details.quantity"), "quantity"],
// [sequelize.col("tbl_orders_details.tbl_initiative.init_ar_name"), "initNameAr"],
// [sequelize.col("tbl_orders_details.tbl_initiative.init_en_name"), "initNameEn"],
// [sequelize.col("tbl_orders_details.tbl_initiatives_location.location_nameAr"), "locationNameAr"],
// [sequelize.col("tbl_orders_details.tbl_initiatives_location.location_nameEn"), "locationNameEn"],
// [sequelize.col("tbl_orders_details.tbl_initiatives_tree.tbl_tree.tree_id"), "treeInfoId"],
// [sequelize.col("tbl_orders_details.tbl_initiatives_tree.tbl_tree.en_name"), "nameEn"],
// [sequelize.col("tbl_orders_details.tbl_initiatives_tree.tbl_tree.ar_name"), "nameAr"],
// [sequelize.col("tbl_orders_details.tbl_initiatives_tree.tbl_tree.img_tree"), "img"],
