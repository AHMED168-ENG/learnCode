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
const seq = new Sequelize(...config.database)

export class ReportController {
  // async orderReportPage(req: Request, res: Response, next: NextFunction) {
  //   const ordersNum = await new OrderController().numberOfOrders()
  //   const initiatives = (await new InitiativeController().initiativeReport()) || []
  //   const ordersInYear = (await new OrderController().ordersInYear()) || []
  //   res.render("reports/order-report.ejs", {
  //     title: "Orders report",
  //     data: {ordersChart: ordersNum, ordersInYear},
  //     initiatives,
  //   })
  // }
  async orderReportPage(req: Request, res: Response, next: NextFunction) {
    const ordersNum = await new OrderController().numberOfOrders()
    const ordersInYear = (await new OrderController().ordersInYear()) || []

    res.render("reports/order.ejs", {
      title: "Orders report",
      data: {ordersChart: ordersNum, ordersInYear},
    })
  }
  async userReportPage(req: Request, res: Response, next: NextFunction) {
    const usersInYear = (await new ReportController().usersInYear()) || []

    res.render("reports/user.ejs", {
      title: "User report",
      data: {usersInYear},
    })
  }
  async sponsorReportPage(req: Request, res: Response, next: NextFunction) {
    const sponsorsChart = (await new ReportController().sponsorInYear()) || []

    res.render("reports/sponsor.ejs", {
      title: "sponsor report",
      data: {sponsorsChart},
    })
  }
  async initiativeReportPage(req: Request, res: Response, next: NextFunction) {
    const initiativesChart = (await new ReportController().initiativesChart()) || []

    res.render("reports/initiative.ejs", {
      title: "initiative report",
      data: {initiativesChart},
    })
  }
  async chartsPage(req: Request, res: Response, next: NextFunction) {
    const userNumbers = (await new ReportController().userNumbers()) || {}
    res.render("reports/charts-report.ejs", {
      title: "charts report",
      data: {},
      userNumbers,
    })
  }
  async calendarInitiative(req: Request, res: Response, next: NextFunction) {
    const initiativeDate = await new InitiativeController().listDateFromTo()
    res.render("reports/calendar-nitiative.ejs", {
      title: "Calendar Initiative",
      data: initiativeDate,
    })
  }
  async userNumbers() {
    let data
    await initiatives
      .findOne({
        limit: 1,
        offset: 0,
        attributes: [
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE gender="female")`), "totalFemale"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE gender="male")`), "totalMale"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE user_type="entity")`), "totalEntity"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE user_type="individual")`), "totalIndividual"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE facebook IS NOT NULL)`), "facebook"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE google IS NOT NULL)`), "google"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE phone IS NOT NULL)`), "phone"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE email IS NOT NULL)`), "email"],
          [sequelize.literal(`(SELECT COALESCE(COUNT(*),0) FROM web_apps_users WHERE apple IS NOT NULL)`), "apple"],
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err, msg: "not found"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found"})
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
              usersChart: sponsorsChart,
              data: data,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err, msg: "not found"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found"})
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err, msg: "not found"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found"})
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
}
