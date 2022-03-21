import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import sequelize from "sequelize"
import initiativeLocations from "../../models/initiative-location.model"
import initiativeTrees from "../../models/initiative-trees.model"
import initiatives from "../../models/initiative.model"
import orderDetails from "../../models/order-details.model"
import order from "../../models/order.model"
import trees from "../../models/trees.model"
import webAppsUsers from "../../models/user.model"

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
  changeStatus(req: Request, res: Response, next: NextFunction) {
    const orderId = req.params.id
    const status = req.query.status
    order
      .update({status: status}, {where: {order_id: orderId}})
      .then((d) => {
        res.status(httpStatus.OK).json({msg: "order edited"})
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit order", err: err.errors[0].message || "unexpected error"})
      })
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
