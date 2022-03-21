import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import promo from "../../models/promo.model"
import moment from "moment"

export class PromoController extends Controller {
  constructor() {
    super()
  }
  async verify(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.user_id
    const promoName = req.params.promoName
    const check = await new PromoController().check(userId, promoName)
    res.status(check[0]).json(check[1])
  }

  /**
   * To check promo code
   * @param userId
   * @param promoCode Promo name OR id
   * @returns tupel type
   */
  async check(userId, promoName = null, promoId = null) {
    const promoWhere = promoId ? {promo_id: promoId} : {promo_name: promoName}
    let result
    await promo
      .findOne({where: promoWhere, raw: true})
      .then((data: any) => {
        if (!data) {
          result = [404, {msg: "not found"}]
        } else {
          const {promo_id, percent} = data
          const currentDate = new Date(moment().format(moment.HTML5_FMT.DATE))

          if (data.deleted == "no" && data.status == "active" && currentDate <= new Date(data.to_date) && currentDate >= new Date(data.from_date)) {
            result = [202, {promo_id, percent}, data]
          } else {
            result = [404, {msg: "not found"}]
          }
        }
      })
      .catch((err) => (result = [404, {msg: "not found"}]))
    return result
  }
}
