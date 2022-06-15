import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import sequelize, {Op} from "sequelize"
import config from "../../config/config"
import initiativeLocations from "../../models/initiative-location.model"
import initiativeTrees from "../../models/initiative-trees.model"
import initiatives from "../../models/initiative.model"
import orderDetails from "../../models/order-details.model"
import order from "../../models/order.model"
import trees from "../../models/trees.model"
import webAppsUsers from "../../models/user.model"
import {Sequelize} from "sequelize"
import { UserPermissionsController } from "./user-permissions.controller"
const seq = new Sequelize(...config.database)

export class OrderController {
  listPageNew(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/new-order/list.ejs", {
      title: "New Order",
      data: {type: "New orders"},
      type: "new",
    })
  }
  listPageInprogress(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/new-order/list.ejs", {
      title: "Inprogress Order",
      data: {type: "Inprogress orders"},
      type: "inprogress",
    })
  }
  listPageCancelled(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/new-order/list.ejs", {
      title: "Cancelled Order",
      data: {type: "Cancelled orders"},
      type: "cancelled",
    })
  }
  listPageCompleted(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/new-order/list.ejs", {
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
        res.render("dashboard/views/new-order/view.ejs", {
          title: "View Order",
          data: data.get({plain: true}),
        })
      })
      .catch((err) => {})
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const pageIndex = (Number(req.query.page) - 1) * limit ? (Number(req.query.page) - 1) * limit : 0
    const screenType = req.params.type
    order
      .findAll({
        where: {status: screenType},
        limit: limit,
        offset: pageIndex,
        order: [['createdAt', 'DESC']],
        attributes: {exclude: ["updatedAt"]},
        raw: true,
      })
      .then((data) => {
        order
          .count({where: {status: screenType}})
          .then(async (count) => {
            const modulesArray = ["New Orders List", "In Progress Orders List", "Completed Orders List"];
            const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, modulesArray);
            const dataInti = {
              total: count,
              limit: limit,
              page: Number(req.query.page),
              pages: Math.ceil(count / limit),
              data,
              canEditNewOrders: permissions.length > 1 ? permissions[0].canEdit : permissions[0].canEdit,
              canViewNewOrders: permissions.length > 1 ? permissions[0].canView : permissions[0].canView,
              canEditInProgressOrders: permissions.length > 1 ? permissions[1].canEdit : permissions[0].canEdit,
              canViewInProgressOrders: permissions.length > 1 ? permissions[1].canView : permissions[0].canView,
              canViewCompletedOrders: permissions.length > 1 ? permissions[2].canView : permissions[0].canView,
              canViewCancelledOrders: permissions.length > 1 ? permissions[2].canView : permissions[0].canView,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting orders", msg: "not found orders"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting orders", msg: "not found orders"})
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while counting orders", msg: "not found orders"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting orders", msg: "not found orders"})
      })
  }
  async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const order_id = req.params.id;
      const status = req.query.status;
      const seen = Number(req.query.seen);
      const updatedData = seen && seen === 1 ? { status, seen } : { status };
      order.update(updatedData, { where: { order_id } }).then((d) => {
        if (status == "completed") {
          const orderData = order.findByPk(order_id, { attributes: ["user_id", "carbon_gained_points", "sahlan_gained_points"], raw: true });
          webAppsUsers.increment(
            { carbon_gained_points: +orderData["carbon_gained_points"], sahlan_gained_points: +orderData["sahlan_gained_points"] },
            { where: { user_id: orderData["user_id"] } },
          );
        }
        return res.status(httpStatus.OK).json({ msg: "order edited" });
      }).catch((error) => {});
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({ msg: "Error in Edit order", err: error.errors[0].message || "unexpected error" });
    }
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
  async numberOfNotifiedOrders() {
    let data
    await order
      .findOne({
        attributes: [
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(order_id),0)
              FROM tbl_orders
              WHERE tbl_orders.status = "inprogress" AND tbl_orders.seen = 0
          )`),
            "inProgress",
          ],
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(order_id),0)
              FROM tbl_orders
              WHERE tbl_orders.status = "new" AND tbl_orders.seen = 0
          )`),
            "New",
          ],
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(order_id),0)
              FROM tbl_orders
              WHERE tbl_orders.status = "completed" AND tbl_orders.seen = 0
          )`),
            "completed",
          ],
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(order_id),0)
              FROM tbl_orders
              WHERE tbl_orders.status = "cancelled" AND tbl_orders.seen = 0
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
  async numberOfCurrentOrders() {
    let data
    await order
      .findOne({
        attributes: [
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(order_id),0)
              FROM tbl_orders
              WHERE tbl_orders.status = "inprogress" AND MONTH(tbl_orders.createdAt) = MONTH(CURRENT_DATE())
          )`),
            "inProgress",
          ],
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(order_id),0)
              FROM tbl_orders
              WHERE tbl_orders.status = "new" AND MONTH(tbl_orders.createdAt) = MONTH(CURRENT_DATE())
          )`),
            "New",
          ],
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(order_id),0)
              FROM tbl_orders
              WHERE tbl_orders.status = "completed" AND MONTH(tbl_orders.createdAt) = MONTH(CURRENT_DATE())
          )`),
            "completed",
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
        where: { [Op.and]: [{ status: "new" }, { seen: 0 }] },
        limit: 4,
        offset: 0,
        attributes: ["order_id", "all_sum", "createdAt"],
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
