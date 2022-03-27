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
import sequelize from "sequelize"

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
  checkCartItems(cartItems) {
    for (let [i, item] of cartItems.entries()) {
      if (item.deleted == "yes" || item.status == "inactive" || item.quantity > item.stock) {
        return false
      }
    }
    return true
  }
}
