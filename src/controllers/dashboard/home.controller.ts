import {Request, Response, NextFunction} from "express"
import sequelize from "sequelize"
import initiatives from "../../models/initiative.model"
import {InitiativeController} from "./initiative.controller"
import {OrderController} from "./order.controller"
import {SponserController} from "./sponser.controller"
import {MessageController} from "./message.controller"
import message from "../../models/message.model"
import permissions from "../../models/permissions.model"
import page from "../../models/page.model"
import modules from "../../models/module.model"
const { verify } = require("../../helper/token")

export class HomeController {
  async home(req: Request, res: Response, next: NextFunction) {
    const lang = req["lang"]
    const totalNumbers = (await new HomeController().homeNumbers()) || {}
    const ordersNum = await new OrderController().numberOfOrders()
    const lastSponser = (await new SponserController().lastSponser(lang)) || []
    const lastInitiative = (await new InitiativeController().lastInitiative(lang)) || []
    const ordersInYear = (await new OrderController().ordersInYear()) || []
    const currentMonthOrders = await new OrderController().numberOfCurrentOrders();
    res.render("index.ejs", {
      title: "Home",
      data: {...totalNumbers, ordersChart: ordersNum, lastSponser, lastInitiative, ordersInYear, currentMonthOrders},
    })
  }

  async getUserPermissions(token: string) {
    try {
      const payload = verify(token);
      const userPermissions = await permissions.findAll({
        where: { role_id: payload.role_id },
        attributes: { exclude: ["role_id", "page_id", "createdAt", "updatedAt"] },
        include: [{ model: page, attributes: ["id", "type", "link"], include: [{ model: modules, attributes: ["name"] }] }],
      });
      const mappedUserPermissions = userPermissions.map((userPermission) => {
        return {
          id: userPermission["id"],
          page: {
            id: userPermission["tbl_page.id"],
            type: userPermission["tbl_page.type"],
            link: userPermission["tbl_page.link"],
          },
          module: { id: userPermission["tbl_module.id"], name: userPermission["tbl_module.name"] } };
      });
      return mappedUserPermissions;
    } catch (error) { throw error; }
  }

  async getSideBarNum(req: Request, res: Response, next: NextFunction) {
    try {
      const lastNewOrders = (await new OrderController().lastNewOrders()) || [];
      const lastNewMessage = (await new MessageController().lastNewMessage()) || {};
      const ordersNum = await new OrderController().numberOfOrders();
      const messageNum = await message.count({ where: { status: "unread" } });
      const homeNumbers = (await new HomeController().homeNumbers()) || {};
      const notifiedOrders = await new OrderController().numberOfNotifiedOrders();
      const userPermissions = await new HomeController().getUserPermissions(req.cookies.token);
      return res.status(200).json({ ...homeNumbers, lastNewOrders, lastNewMessage, ordersNum, messageNum, notifiedOrders, userPermissions });
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
            SELECT COALESCE(COUNT(user_id),0) as newUsers
            FROM web_apps_users
            WHERE
            status='active'
            AND deleted='no'
            AND YEAR(createdAt) = YEAR(CURRENT_DATE()) AND MONTH(createdAt) = MONTH(CURRENT_DATE())
            )`),
            "newUsers",
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
              SELECT COALESCE(SUM(all_sum*COALESCE((promo_code_percent/100),1)),0) FROM tbl_orders WHERE status="completed" AND MONTH(createdAt) = MONTH(CURRENT_DATE())
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
