import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import order from "../../models/order.model"
import {PromoController} from "./promo.controller"
import orderDetails from "../../models/order-details.model"
import gift from "../../models/gift.model"
import {CartController} from "./cart.controller"
import {UserController} from "./users.controller"
import cart from "../../models/cart.model"
import fs from "fs"
import path from "path"
import webAppsUsers from "../../models/user.model"
import sequelize, {Op, Sequelize} from "sequelize"
import initiatives from "../../models/initiative.model"
import {IinitiativeController} from "./initiative.controller"
import city from "../../models/city.model"
import initiativeTrees from "../../models/initiative-trees.model"
import initiativeLocations from "../../models/initiative-location.model"
import trees from "../../models/trees.model"
import moment from "moment"

export class OrderController extends Controller {
  constructor() {
    super()
  }
  certificate(req: Request, res: Response, next: NextFunction) {
    const filePath = path.join(__dirname, "../../../public/certificate/1.pdf")
    const stat = fs.statSync(filePath)

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Length": stat.size,
    })

    const readStream = fs.createReadStream(filePath)
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res)
  }

  async myContribution(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.user_id
    const ar_en = req["lang"] == "en" ? "init_en_name" : "init_ar_name"
    const ar_enCity = req["lang"] == "en" ? "en_name" : "ar_name"
    const userInitiative = [...(await order.findAll({where: {user_id: userId}, include: [{model: orderDetails}], raw: true}))].map((item: any) => {
      return item["tbl_orders_details.initiative_id"]
    })
    const cities = req.query.cities ? String(req.query.cities).split(",").map(Number) : []
    const where = cities.length > 0 ? {city_id: cities} : {}
    const attributes: any = new IinitiativeController().selectionFields(ar_en, req.user.user_id, req.query.status)
    initiatives
      .findAll({
        where: {...where, init_id: {[sequelize.Op.in]: userInitiative}},
        include: [{model: city, attributes: {include: [[ar_enCity, "name"]], exclude: ["en_name", "ar_name", "createdAt", "updatedAt"]}}],
        attributes: [...attributes],
      })
      .then((data) => {
        res.status(httpStatus.OK).json({data})
      })
      .catch((err) => {
        console.log(err)
        res.status(httpStatus.NOT_FOUND).json({msg: "not found"})
      })
  }
  async myContributionTree(req: Request, res: Response, next: NextFunction) {
    const lang = req["lang"] == "en"
    const userId = req.user.user_id

    const treeName = lang ? "en_name" : "ar_name"
    const locationName = lang ? "location_nameEn" : "location_nameAr"
    const cityName = lang ? "en_name" : "ar_name"

    const cities = req.query.cities ? String(req.query.cities).split(",").map(Number) : []
    const where = cities.length > 0 ? {city_id: cities} : {}

    order
      .findAll({
        where: {user_id: userId},
        attributes: [
          [sequelize.col(`tbl_orders_details.quantity`), "qty"],
          [sequelize.col(`tbl_orders_details.tbl_initiatives_tree.id`), "treeId"],
          [sequelize.col(`tbl_orders_details.tbl_initiatives_tree.tbl_tree.img_tree`), "img"],
          [sequelize.col(`tbl_orders_details.tbl_initiatives_tree.tbl_tree.${treeName}`), "name"],
          [sequelize.col(`tbl_orders_details.tbl_initiatives_tree.tbl_initiatives_location.${locationName}`), "locationName"],
          [sequelize.col(`tbl_orders_details.tbl_initiatives_tree.tbl_initiatives_location.tbl_city.${cityName}`), "cityName"],
          [sequelize.col(`tbl_orders_details.tbl_initiatives_tree.carbon_points`), "carbon"],
          [sequelize.col(`tbl_orders_details.tbl_initiatives_tree.price_points`), "sahlanPoint"],
        ],
        include: [
          {
            model: orderDetails,
            attributes: [],
            include: [
              {
                model: initiativeTrees,
                attributes: [],
                include: [
                  {model: trees, attributes: []},
                  {model: initiativeLocations, where: {...where}, attributes: [], include: [{model: city, attributes: []}], required: true},
                ],
              },
            ],
          },
        ],
        raw: true,
      })
      .then((data) => {
        res.status(httpStatus.OK).json({data})
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({msg: "not found"})
      })
  }

  async makeOrder(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.user_id
    const userData = await new UserController().homeData("en", userId)
    const giftInfo = req.body.gift
    const promoId = req.body.promo ? req.body.promo : null
    const checkPromo = req.body.promo ? await new PromoController().check(userId, null, promoId) : null
    const cartItems = await new CartController().check(userId)
    if (cartItems && cartItems.amountTotal !== 0 && cartItems.data.length !== 0 && (promoId == null || checkPromo[0] == 202)) {
      const allSum = cartItems.amountTotal
      const totalCarbonPoint = cartItems.totalCarbonPoint
      const totalSahlanPoint = cartItems.totalSahlanPoint
      const checkCartItems = new OrderController().checkCartItems(cartItems.data)
      if (checkCartItems) {
        const orderData = {
          all_sum: allSum,
          promo_code_fk: promoId ? checkPromo[1].promo_id : null,
          promo_code_percent: promoId ? checkPromo[1].percent : null,
          user_id: userId,
          user_name: userData.fullName,
          carbon_gained_points: totalCarbonPoint,
          sahlan_gained_points: totalSahlanPoint,
        }
        order
          .create(orderData)
          .then((orderDataAfterInsert) => {
            const orderDetailsData = cartItems.data.map((i) => {
              return {
                order_id: orderDataAfterInsert.get({plain: true}).order_id,
                initiative_id: i.initiative_id,
                location_id: i.location_id,
                tree_id: i.tree_id,
                price: i.price,
                quantity: i.quantity,
              }
            })
            orderDetails
              .bulkCreate(orderDetailsData)
              .then((d) => {
                cart.destroy({where: {user_id: userId}}).then(() => {
                  res.status(httpStatus.CREATED).json({msg: "Order Done", orderId: orderDataAfterInsert.get({plain: true}).order_id})
                })
              })
              .catch((err) => res.status(httpStatus.BAD_REQUEST).json({msg: "error in create order details", code: 7000}))
            if (giftInfo && giftInfo != "" && Object.keys(giftInfo).length !== 0) {
              gift.create({order_id: orderDataAfterInsert.get({plain: true}).order_id, ...giftInfo})
            }
          })
          .catch((err) => res.status(httpStatus.BAD_REQUEST).json({msg: "error in create order", code: 7001}))
      } else {
        res.status(httpStatus.BAD_REQUEST).json({msg: "error in check out", code: 7002})
      }
    } else {
      res.status(httpStatus.BAD_REQUEST).json({msg: "error in check out", code: 7003})
    }
  }

  Leaderboard(req: Request, res: Response, next: NextFunction) {
    const p = req.query.p
    const today = moment()
    const fromDateWeek = today.startOf("week").format()
    const toDateWeek = today.endOf("week").format()
    const fromDateMonth = moment(new Date()).startOf("month").format()
    const toDateMonth = moment(new Date()).endOf("month").format()
    let where = {}
    if (p == "week") {
      where = {
        createdAt: {
          [Op.between]: [fromDateWeek, toDateWeek],
        },
      }
    } else if (p == "month") {
      where = {
        createdAt: {
          [Op.between]: [fromDateMonth, toDateMonth],
        },
      }
    }
    order
      .findAll({
        limit: 10,
        where: where,
        attributes: ["user_id", [sequelize.fn("sum", sequelize.col("tbl_orders.carbon_gained_points")), "totalPoints"]],
        include: [{model: webAppsUsers, attributes: ["user_id", "fullName", "user_img"]}],
        group: ["user_id"],
        order: sequelize.literal("totalPoints DESC"),
      })
      .then((data) => {
        res.status(httpStatus.OK).json({
          dataFrom: p == "week" ? today.startOf("week").format("YYYY-MM-DD") : moment(new Date()).startOf("month").format("MMMM"),
          dataTo: today.endOf("week").format("YYYY-MM-DD"),
          data,
        })
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({msg: "not found"})
      })
  }
  checkCartItems(cartItems) {
    for (let [i, item] of cartItems.entries()) {
      if (item.deleted == "yes" || item.status == "inactive" || item.quantity > item.stock) {
        return false
      }
    }
    return true
  }
}
