import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import sequelize from "sequelize"
import initiatives from "../../models/initiative.model"
import {InitiativeController} from "./initiative.controller"
import {SponserController} from "./sponser.controller"

export class HomeController {
  async home(req: Request, res: Response, next: NextFunction) {
    const lang = req["lang"]
    const totalNumbers = (await new HomeController().homeNumbers()) || {}
    const lastSponser = (await new SponserController().lastSponser(lang)) || []
    const lastInitiative = (await new InitiativeController().lastInitiative(lang)) || []
    const ordersChart = {New: 5, inProgress: 4, completed: 15, cancelled: 7}
    res.render("index.ejs", {
      title: "Home",
      data: {...totalNumbers, ordersChart, lastSponser, lastInitiative},
    })
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
            SELECT COUNT(location_id) as totalLocation
            FROM tbl_initiatives_locations
            WHERE
            tbl_initiatives_locations.location_status='active'
            AND tbl_initiatives_locations.deleted='no'
            )`),
            "totalLocation",
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(init_id) as totalInitiatives
            FROM tbl_initiatives
            WHERE
            status='active'
            AND deleted='no'
            )`),
            "totalInitiatives",
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(sponser_id) as totalSponsors
            FROM tbl_sponsers
            WHERE
            status='active'
            AND deleted='no'
            )`),
            "totalSponsors",
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(user_id) as totalUsers
            FROM web_apps_users
            WHERE
            status='active'
            AND deleted='no'
            )`),
            "totalUsers",
          ],
        ],
        raw: true,
      })
      .then((d) => (data = d))
      .catch((e) => (data = null))
    return data
  }
}
