import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import sequelize from "sequelize"
import initiatives from "../../models/initiative.model"
import {InitiativeController} from "./initiative.controller"
import {OrderController} from "./order.controller"
import {SponserController} from "./sponser.controller"
import {MessageController} from "./message.controller"
import message from "../../models/message.model"

export class HomeController {
  async home(req: Request, res: Response, next: NextFunction) {
    const lang = req["lang"]
    const totalNumbers = (await new HomeController().homeNumbers()) || {}
    const ordersNum = await new OrderController().numberOfOrders()
    const lastSponser = (await new SponserController().lastSponser(lang)) || []
    const lastInitiative = (await new InitiativeController().lastInitiative(lang)) || []
    const ordersInYear = (await new OrderController().ordersInYear()) || []
    res.render("index.ejs", {
      title: "Home",
      data: {...totalNumbers, ordersChart: ordersNum, lastSponser, lastInitiative, ordersInYear},
    })
  }

  async getSideBarNum(req: Request, res: Response, next: NextFunction) {
    try {
      const lastNewOrders = (await new OrderController().lastNewOrders()) || [];
      const lastNewMessage = (await new MessageController().lastNewMessage()) || {};
      const ordersNum = await new OrderController().numberOfOrders();
      const messageNum = await message.count({ where: { status: "unread" } });
      const homeNumbers = (await new HomeController().homeNumbers()) || {};
      return res.status(200).json({ ...homeNumbers, lastNewOrders, lastNewMessage, ordersNum, messageNum });
    } catch (error) {
      return res.status(500).json({ msg: "Error in getting sidebar nums", err: error.errors[0].message || "unexpected error" });
    }
  }
  async homeNumbers() {
    let data
    await initiatives
      .findOne({
        limit: 1,
        offset: 0,
        attributes: [
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(location_id),0) as totalLocation
            FROM tbl_initiatives_locations
            WHERE
            tbl_initiatives_locations.location_status='active'
            AND tbl_initiatives_locations.deleted='no'
            )`),
            "totalLocation",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(init_id),0) as totalInitiatives
            FROM tbl_initiatives
            WHERE
            status='active'
            AND deleted='no'
            )`),
            "totalInitiatives",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalMessage
            FROM messages
            WHERE
            status='unread'
            )`),
            "totalMessage",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(sponser_id),0) as totalSponsors
            FROM tbl_sponsers
            WHERE
            status='active'
            AND deleted='no'
            )`),
            "totalSponsors",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalTrees
            FROM 	tbl_trees
            )`),
            "totalTrees",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(user_id),0) as totalUsers
            FROM web_apps_users
            WHERE
            status='active'
            AND deleted='no'
            )`),
            "totalUsers",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(promo_id),0) as totalPromo
            FROM tbl_promo_codes
            WHERE
            status='active'
            AND deleted='no'
            )`),
            "totalPromo",
          ],
          [
            sequelize.literal(`(
              SELECT COALESCE(SUM(all_sum*COALESCE((promo_code_percent/100),1)),0) FROM tbl_orders WHERE status="completed"
            )`),
            "totalIncome",
          ],
          [
            sequelize.literal(`(
              SELECT COALESCE(COUNT(gift_id),0) FROM tbl_gifts
            )`),
            "totalGift",
          ],
        ],
        raw: true,
      })
      .then((d) => (data = d))
      .catch((e) => (data = null))
    return data
  }
}
