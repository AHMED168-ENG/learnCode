import express, {Request, Response, NextFunction} from "express"
import {HomeRoutes} from "./dashboard/home.route"
import {LoginRoutes} from "./dashboard/login.route"
import {InitiativeRoutes} from "./dashboard/initiative.route"
import {SponserRoutes} from "./dashboard/sponser.route"
import {CountryRoutes} from "./dashboard/country.route"
import {CityRoutes} from "./dashboard/city.route"
import {RegionRoutes} from "./dashboard/region.route"
import {SectorRoutes} from "./dashboard/sector.route"
import {UserRoutes} from "./dashboard/user.route"
import {ReportRoutes} from "./dashboard/report.route"
import {TreeRoutes} from "./dashboard/tree.route"
import { OrderRoutes } from "./dashboard/order.route"
import { PromoRoutes } from "./dashboard/promo.route"
import { TermsPolicyRoutes } from "./dashboard/terms&policy.route"
export = (app: express.Application) => {
  // index
  app.get("/", (req, res) => res.redirect("/dashboard/home"))
  // home route
  app.use("/dashboard/home", new HomeRoutes().router)
  // User route
  app.use("/dashboard/user", new LoginRoutes().router)
  // initiative route
  app.use("/dashboard/initiative", new InitiativeRoutes().router)
  // Sponser route
  app.use("/dashboard/sponser", new SponserRoutes().router)
  // country route
  app.use("/dashboard/country", new CountryRoutes().router)
  // city route
  app.use("/dashboard/city", new CityRoutes().router)
  // Region route
  app.use("/dashboard/region", new RegionRoutes().router)
  // Sector route
  app.use("/dashboard/sector", new SectorRoutes().router)
  // User route
  app.use("/dashboard/user", new UserRoutes().router)
  // report route
  app.use("/dashboard/report", new ReportRoutes().router)
  // tree route
  app.use("/dashboard/tree", new TreeRoutes().router)
  // order route
  app.use("/dashboard/order", new OrderRoutes().router)
  // promo route
  app.use("/dashboard/promo", new PromoRoutes().router)
  // promo route
  app.use("/dashboard/management", new TermsPolicyRoutes().router)
}
