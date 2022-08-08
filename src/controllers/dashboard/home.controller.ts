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
import destination from "../../models/destination.model"
const { verify } = require("../../helper/token")

export class HomeController {
  async home(req: Request, res: Response, next: NextFunction) {
    const lang = req["lang"]
    const totalNumbers = (await new HomeController().homeNumbers()) || {}
    const otherNumbers = (await new HomeController().otherNumbers()) || {}
    const ordersNum = await new OrderController().numberOfOrders()
    const lastSponser = (await new SponserController().lastSponser(lang)) || []
    const lastInitiative = (await new InitiativeController().lastInitiative(lang)) || []
    const ordersInYear = (await new OrderController().ordersInYear()) || []
    const currentMonthOrders = await new OrderController().numberOfCurrentOrders();
    const userPermissions = (await new HomeController().getUserPermissions(req.cookies.token)) || [];
    res.render("dashboard/views/index.ejs", {
      title: "Home",
      data: {...totalNumbers, ...otherNumbers, ordersChart: ordersNum, lastSponser, lastInitiative, ordersInYear, currentMonthOrders, userPermissions: userPermissions["mappedUserPermissions"], isHighestAdmin: userPermissions["isHighestAdmin"] },
    })
  }

  async getUserPermissions(token: string) {
    try {
      const payload = verify(token);
      const isHighestAdmin = payload.role_id === "0";
      let mappedUserPermissions;
      if (!isHighestAdmin) {
        const where = { role_id: payload.role_id };
        const userPermissions = await permissions.findAll({
          where,
          attributes: { exclude: ["role_id", "page_id", "createdAt", "updatedAt"] },
          include: [{ model: page, attributes: ["id", "type", "link"], include: [{ model: modules, attributes: ["name"] }] }],
        });
        mappedUserPermissions = userPermissions.map((userPermission) => {
          return {
            id: userPermission["id"],
            page: {
              id: userPermission["tbl_page"]["id"],
              type: userPermission["tbl_page"]["type"],
              link: userPermission["tbl_page"]["link"],
            },
            module: { id: userPermission["tbl_page"]["tbl_module"]["id"], name: userPermission["tbl_page"]["tbl_module"]["name"] },
          };
        });
      }
      return { mappedUserPermissions, isHighestAdmin };
    } catch (error) { throw error; }
  }

  async getSideBarNum(req: Request, res: Response, next: NextFunction) {
    try {
      const lastNewOrders = (await new OrderController().lastNewOrders()) || [];
      const lastNewMessage = (await new MessageController().lastNewMessage()) || {};
      const ordersNum = await new OrderController().numberOfOrders();
      const messageNum = await message.count({ where: { status: "unread" } });
      const homeNumbers = (await new HomeController().homeNumbers()) || {};
      const otherNumbers = (await new HomeController().otherNumbers()) || {}
      const notifiedOrders = await new OrderController().numberOfNotifiedOrders();
      const userPermissions = (await new HomeController().getUserPermissions(req.cookies.token)) || [];
      return res.status(200).json({ ...homeNumbers, ...otherNumbers, lastNewOrders, lastNewMessage, ordersNum, messageNum, notifiedOrders, userPermissions: userPermissions["mappedUserPermissions"], isHighestAdmin: userPermissions["isHighestAdmin"] });
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
  public async otherNumbers() {
    try {
      const data = await destination.findOne({
        limit: 1,
        offset: 0,
        attributes: [
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalDestinations
            FROM 	tbl_destinations
            )`),
            "totalDestinations",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalEvents
            FROM 	tbl_events
            )`),
            "totalEvents",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalActivities
            FROM 	tbl_activities
            )`),
            "totalActivities",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalGuides
            FROM 	tbl_guides
            )`),
            "totalGuides",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalProviders
            FROM 	tbl_providers
            )`),
            "totalProviders",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalDestinationStores
            FROM 	tbl_destination_stores
            )`),
            "totalDestinationStores",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalStores
            FROM 	tbl_stores
            )`),
            "totalStores",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalTrips
            FROM 	tbl_trips
            )`),
            "totalTrips",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalMemberships
            FROM 	tbl_memberships
            )`),
            "totalMemberships",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalRestaurants
            FROM 	tbl_restaurants
            )`),
            "totalRestaurants",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalHotels
            FROM 	tbl_hotels
            )`),
            "totalHotels",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalDestinations
            FROM 	tbl_destinations
            )`),
            "totalDestinations",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalAds
            FROM 	tbl_ads
            )`),
            "totalAds",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalPlaces
            FROM 	tbl_destination_places
            )`),
            "totalPlaces",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalPackages
            FROM 	tbl_packages
            )`),
            "totalPackages",
          ],
          [
            sequelize.literal(`(
            SELECT COALESCE(COUNT(*),0) as totalTransportations
            FROM 	tbl_transportations
            )`),
            "totalTransportations",
          ],
        ],
        raw: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
