import {Request, Response, NextFunction} from "express"
import sequelize from "sequelize"
import initiatives from "../../models/initiative.model"
import { CartController } from "../api/cart.controller"
import { AdminController } from "../dashboard/admin.controller"
import { UserController } from "../dashboard/user.controller"
const { verify } = require("../../helper/token")
export class HomeController {
  public async home(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = verify(req.cookies.token);
      const isHighestAdmin = payload.email === process.env.admin_email;
      const admin = !isHighestAdmin ? await new AdminController().getAdminByEmail(payload.email) : payload;
      const user = await new UserController().getUserByEmail(payload.email);
      return res.render("website/views/index.ejs", { title: "Home", admin, user });
    } catch (error) {
      return res.status(500).json({ msg: "Can't open home page", err: error });
    }
  }
  public async getNavNumbers(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = verify(req.cookies.token);
      const isHighestAdmin = payload.email === process.env.admin_email;
      const admin = !isHighestAdmin ? await new AdminController().getAdminByEmail(payload.email) : payload;
      const user = await new UserController().getUserByEmail(payload.email);
      const cartCount = await new CartController().cardCount(user["user_id"]);
      return res.status(200).json({ cartCount, admin, user });
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
