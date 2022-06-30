import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import sequelize, {Op, where} from "sequelize"
import initiatives from "../../models/initiative.model"
import webAppsUsers from "../../models/user.model"
import {InitiativeController} from "./initiative.controller"
import {OrderController} from "./order.controller"
import {Sequelize, DataTypes} from "sequelize"
import config from "../../config/config"
import country from "../../models/country.model"
import sector from "../../models/sector.model"
import city from "../../models/city.model"
import region from "../../models/region.model"
import {UserController} from "./user.controller"
import sponser from "../../models/sponser.model"
import initiativeLocations from "../../models/initiative-location.model"
import initiativeTrees from "../../models/initiative-trees.model"
import trees from "../../models/trees.model"
import {CityController} from "./city.controller"
import { CalendarController } from "../website/calendar.controller"
import { FavouriteController } from "../website/favourite.controller"
import { DestinationController } from "../website/destination.controller"
import { EventController } from "../website/event.controller"
const seq = new Sequelize(...config.database)

export class ReportController {
  // async orderReportPage(req: Request, res: Response, next: NextFunction) {
  //   const ordersNum = await new OrderController().numberOfOrders()
  //   const initiatives = (await new InitiativeController().initiativeReport()) || []
  //   const ordersInYear = (await new OrderController().ordersInYear()) || []
  //   res.render("dashboard/views/reports/order-report.ejs", {
  //     title: "Orders report",
  //     data: {ordersChart: ordersNum, ordersInYear},
  //     initiatives,
  //   })
  // }
  async orderReportPage(req: Request, res: Response, next: NextFunction) {
    const ordersNum = await new OrderController().numberOfOrders()
    const ordersInYear = (await new OrderController().ordersInYear()) || []

    res.render("dashboard/views/reports/order.ejs", {
      title: "Orders report",
      data: {ordersChart: ordersNum, ordersInYear},
    })
  }
  async userReportPage(req: Request, res: Response, next: NextFunction) {
    const usersInYear = (await new ReportController().usersInYear()) || []

    res.render("dashboard/views/reports/user.ejs", {
      title: "User report",
      data: {usersInYear},
    })
  }
  async sponsorReportPage(req: Request, res: Response, next: NextFunction) {
    const sponsorsChart = (await new ReportController().sponsorInYear()) || []

    res.render("dashboard/views/reports/sponsor.ejs", {
      title: "sponsor report",
      data: {sponsorsChart},
    })
  }
  async initiativeReportPage(req: Request, res: Response, next: NextFunction) {
    const initiativesChart = (await new ReportController().initiativesChart()) || []

    res.render("dashboard/views/reports/initiative.ejs", {
      title: "initiative report",
      data: {initiativesChart},
    })
  }
  async locationReportPage(req: Request, res: Response, next: NextFunction) {
    const initiativesChart = (await new ReportController().initiativesChart()) || []

    res.render("dashboard/views/reports/initiative-location.ejs", {
      title: "Location report",
      data: {initiativesChart},
    })
  }
  async treeReportPage(req: Request, res: Response, next: NextFunction) {
    const treeChart = (await new ReportController().treeChart()) || []
    const cities = (await new CityController().listCity()) || []

    res.render("dashboard/views/reports/location-trees.ejs", {
      title: "Tree report",
      data: {initiativesChart: treeChart},
      cities,
    })
  }
  async salesReportPage(req: Request, res: Response, next: NextFunction) {
    const initiativesChart = (await new OrderController().numberOfOrders()) || []
    const ordersChart = (await new OrderController().ordersInYear({type: "completed"})) || []
    res.render("dashboard/views/reports/sales.ejs", {
      title: "Sales report",
      data: {initiativesChart: ordersChart},
    })
  }
  async chartsPage(req: Request, res: Response, next: NextFunction) {
    try {
      const userNumbers = (await new ReportController().userNumbers(req.query.from, req.query.to)) || {};
      return res.render("dashboard/views/reports/charts-report.ejs", { title: "charts report", data: {}, userNumbers });
    } catch (err) {
      return res.status(500).json({ err, msg: "Can't get chart data" });
    }
  }
  public async getFavouriteDestinations(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render("dashboard/views/reports/favourite-destination-report.ejs", { title: "Most Favourite Destinations Report" });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get most favourite destinations data", err: error });
    }
  }
  public async getFavouriteEvents(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render("dashboard/views/reports/favourite-event-report.ejs", { title: "Most Favourite Events Report" });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get most favourite events data", err: error });
    }
  }
  async getAllUsersCalendar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await new CalendarController().getCalendarData();
      return res.render("dashboard/views/reports/calendar.ejs", { title: "All Users Calendar", data });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get Calendar data", err: error });
    }
  }
  async calendarInitiative(req: Request, res: Response, next: NextFunction) {
    const initiativeDate = await new InitiativeController().listDateFromTo()
    res.render("dashboard/views/reports/calendar-nitiative.ejs", {
      title: "Calendar Initiative",
      data: initiativeDate,
    })
  }
  public async getFavouriteDestinationsList(req: Request, res: Response, next: NextFunction) {
    try {
      const fromTo = !!req.query.from && !!req.query.to ? { from: req.query.from, to: req.query.to } : null;
      const favouriteDestinations = await new FavouriteController().getFavourites("destination", null, null, null, fromTo);
      const allDestinations = await new DestinationController().getAllDestinations();
      const data = new ReportController().getFavouritesPerItem(favouriteDestinations, allDestinations, ["en_title", "ar_title"]);
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get favourite destinations list data", err: error });
    }
  }
  public async getFavouriteEventList(req: Request, res: Response, next: NextFunction) {
    try {
      const fromTo = !!req.query.from && !!req.query.to ? { from: req.query.from, to: req.query.to } : null;
      const favouriteEvents = await new FavouriteController().getFavourites("event", null, null, null, fromTo);
      const allEvents = await new EventController().getAllEvents();
      const data = new ReportController().getFavouritesPerItem(favouriteEvents, allEvents, ["en_name", "ar_name"]);
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get events list data", err: error });
    }
  }
  async userNumbers(from?: any, to?: any) {
    let data
    const filterQuery = !from || !to ? `` : `AND createdAt >= "${from}" AND createdAt <= "${to}"`;
    await initiatives
      .findOne({
        limit: 1,
        offset: 0,
        attributes: [
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE gender="female" ${filterQuery})`), "totalFemale"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE gender="male" ${filterQuery})`), "totalMale"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE user_type="entity" ${filterQuery})`), "totalEntity"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE user_type="individual" ${filterQuery})`), "totalIndividual"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE facebook IS NOT NULL ${filterQuery})`), "facebook"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE google IS NOT NULL ${filterQuery})`), "google"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE phone IS NOT NULL ${filterQuery})`), "phone"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE email IS NOT NULL ${filterQuery})`), "email"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE apple IS NOT NULL ${filterQuery})`), "apple"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE MONTH(createdAt)=MONTH(CURRENT_DATE()))`), "newUserThisMonth"],
          [
            sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE MONTH(createdAt)=MONTH(CURRENT_DATE - INTERVAL 1 MONTH))`),
            "newUserLastMonth",
          ],
        ],
        raw: true,
      })
      .then((d) => (data = d))
      .catch((e) => {
        data = null
      })
    return data
  }
  
  async userlistReport(req: Request, res: Response, next: NextFunction) {
    const fromTo = req.query.from != "null" ? {createdAt: {[Op.and]: [{[Op.gte]: req.query.from}, {[Op.lte]: req.query.to}]}} : {}
    const screenType = req.params.type == "all" ? {} : {gender: req.params.type}
    const usersChart = (await new ReportController().usersInYear({from: req.query.from, to: req.query.to, type: req.params.type})) || []
    webAppsUsers
      .findAll({
        where: {...screenType, ...fromTo},
        attributes: {exclude: [...new UserController().secretFields]},
        include: [
          {model: country, attributes: ["en_name", "ar_name"]},
          {model: city, attributes: ["en_name", "ar_name"]},
          {model: region, attributes: ["en_name", "ar_name"]},
          {model: sector, attributes: ["en_name", "ar_name"]},
        ],
        raw: true,
      })
      .then((data) => {
        webAppsUsers
          .count({where: screenType, ...fromTo})
          .then((count) => {
            const dataInti = {
              total: count,
              usersChart: usersChart,
              data: data,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting users", msg: "not found"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting users", msg: "not found"})
      })
  }
  async sponsorlistReport(req: Request, res: Response, next: NextFunction) {
    const fromTo = req.query.from != "null" ? {createdAt: {[Op.and]: [{[Op.gte]: req.query.from}, {[Op.lte]: req.query.to}]}} : {}
    const sponsorsChart = (await new ReportController().sponsorInYear({from: req.query.from, to: req.query.to})) || []
    sponser
      .findAll({
        where: {...fromTo},
        attributes: {exclude: ["password", "updatedAt"]},
        raw: true,
      })
      .then((data) => {
        sponser
          .count({where: {...fromTo}})
          .then((count) => {
            const dataInti = {
              total: count,
              sponsorsChart: sponsorsChart,
              data: data,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting sponsors", msg: "not found"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting sponsors", msg: "not found"})
      })
  }
  async initiativelistReport(req: Request, res: Response, next: NextFunction) {
    const fromTo = req.query.from != "null" ? {createdAt: {[Op.and]: [{[Op.gte]: req.query.from}, {[Op.lte]: req.query.to}]}} : {}
    const initiativesChart = (await new ReportController().initiativesChart({from: req.query.from, to: req.query.to})) || []
    initiatives
      .findAll({
        where: {...fromTo},
        attributes: [
          "init_id",
          "init_en_name",
          "init_ar_name",
          "logo",
          "from_date",
          "to_date",
          "featured",
          "status",
          "deleted",
          "createdAt",
          [
            sequelize.literal(`(
          SELECT img
          FROM tbl_sponsers
          WHERE
          tbl_sponsers.sponser_id= tbl_initiatives.sponsor_id
          )`),
            "sponsorImg",
          ],
        ],
        raw: true,
      })
      .then((data) => {
        initiatives
          .count({where: {...fromTo}})
          .then((count) => {
            const dataInti = {
              total: count,
              usersChart: initiativesChart,
              data: data,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting initiatives", msg: "not found"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting initiatives", msg: "not found"})
      })
  }
  async locationlistreport(req: Request, res: Response, next: NextFunction) {
    const fromTo = req.query.from != "null" ? {createdAt: {[Op.and]: [{[Op.gte]: req.query.from}, {[Op.lte]: req.query.to}]}} : {}
    const locationChart = (await new ReportController().locationChart({from: req.query.from, to: req.query.to})) || []
    initiativeLocations
      .findAll({
        where: {...fromTo},
        include: [
          {model: initiatives, attributes: ["init_ar_name", "init_en_name"]},
          {model: city, attributes: ["en_name", "ar_name"]},
        ],
        // raw: true,
      })
      .then((data) => {
        initiativeLocations
          .count({where: {...fromTo}})
          .then((count) => {
            const dataInti = {
              total: count,
              usersChart: locationChart,
              data: data,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting locations", msg: "not found"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting locations", msg: "not found"})
      })
  }
  async treelistreport(req: Request, res: Response, next: NextFunction) {
    const fromTo = req.query.from != "null" ? {createdAt: {[Op.and]: [{[Op.gte]: req.query.from}, {[Op.lte]: req.query.to}]}} : {}
    const city = req.query.city != "null" ? {city_id: req.query.city} : {}
    const treeChart = (await new ReportController().treeChart({from: req.query.from, to: req.query.to})) || []
    console.log(city)
    initiativeTrees
      .findAll({
        where: {...fromTo},
        include: [
          {model: initiatives, attributes: ["init_id", "init_ar_name", "init_en_name", "createdAt"]},
          {model: initiativeLocations, attributes: ["location_id", "location_nameEn", "location_nameAr"], where: {...city}},
          {model: trees, attributes: ["tree_id", "ar_name", "en_name", "img_tree"]},
        ],
      })
      .then((data) => {
        initiativeTrees
          .count({where: {...fromTo}})
          .then((count) => {
            const dataInti = {
              total: count,
              usersChart: treeChart,
              data: data,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting trees", msg: "not found"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting trees", msg: "not found"})
      })
  }
  async usersInYear(where = {}) {
    const whereCon =
      where["type"] != "all" && where != undefined && Object.keys(where).length != 0
        ? `gender ='${where["type"]}' AND YEAR(createdAt) = YEAR(CURDATE())`
        : "YEAR(createdAt) = YEAR(CURDATE())"
    let data
    await seq
      .query(
        `SELECT MONTHNAME(createdAt) AS MONTH, COUNT(*) AS "count"
               FROM web_apps_users WHERE ${whereCon} GROUP BY MONTH`,
        {type: sequelize.QueryTypes.SELECT}
      )
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
  async sponsorInYear(where = {}) {
    const whereCon = "YEAR(createdAt) = YEAR(CURDATE())"
    let data
    await seq
      .query(
        `SELECT MONTHNAME(createdAt) AS MONTH, COUNT(*) AS "count"
               FROM tbl_sponsers WHERE ${whereCon} GROUP BY MONTH`,
        {type: sequelize.QueryTypes.SELECT}
      )
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
  async getCategoryChart(where = {}, category: string) {
    const whereCon = "YEAR(createdAt) = YEAR(CURDATE())"
    let data
    await seq
      .query(
        `SELECT MONTHNAME(createdAt) AS MONTH, COUNT(*) AS "count"
               FROM tbl_${category} WHERE ${whereCon} GROUP BY MONTH`,
        {type: sequelize.QueryTypes.SELECT}
      )
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
  async initiativesChart(where = {}) {
    const whereCon = "YEAR(createdAt) = YEAR(CURDATE())"
    let data
    await seq
      .query(
        `SELECT MONTHNAME(createdAt) AS MONTH, COUNT(*) AS "count"
               FROM tbl_initiatives WHERE ${whereCon} GROUP BY MONTH`,
        {type: sequelize.QueryTypes.SELECT}
      )
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
  async locationChart(where = {}) {
    const whereCon = "YEAR(createdAt) = YEAR(CURDATE())"
    let data
    await seq
      .query(
        `SELECT MONTHNAME(createdAt) AS MONTH, COUNT(*) AS "count"
               FROM tbl_initiatives_locations WHERE ${whereCon} GROUP BY MONTH`,
        {type: sequelize.QueryTypes.SELECT}
      )
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
  async treeChart(where = {}) {
    const whereCon = "YEAR(createdAt) = YEAR(CURDATE())"
    let data
    await seq
      .query(
        `SELECT MONTHNAME(createdAt) AS MONTH, COUNT(*) AS "count"
               FROM tbl_initiatives_trees WHERE ${whereCon} GROUP BY MONTH`,
        {type: sequelize.QueryTypes.SELECT}
      )
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
  private getFavouritesPerItem(favourites: any[], all: any[], attributes: string[]): any {
    try {
      let favItemsIds = favourites.map((favouite) => { return favouite.item_id; });
      const mappedFavourites = favourites.map((favourite) => {
        return {
          id: favourite.id,
          user_id: favourite.user_id,
          username: favourite["web_apps_user.fullName"] || favourite["web_apps_user.email"] || favourite["web_apps_user.phone"],
          user_type: favourite.user_type,
          item_id: favourite.item_id,
          createdAt: favourite.createdAt,
        };
      });
      const response: any[] = [];
      for (const favItemId of [...new Set(favItemsIds)]) {
        const foundItem = all.find((item) => item.id === favItemId);
        const name = `${foundItem[attributes[0]]}${attributes[1] ? ` - ${foundItem[attributes[1]]}` : ''}`;
        const favouritesPerItemId = mappedFavourites.filter((item) => item.item_id === favItemId);
        response.push({ id: favItemId, name, favourites: favouritesPerItemId });
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}
