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
import { LocationRoutes } from "./dashboard/location.route"
import { LocationTreesRoutes } from "./dashboard/location-trees.route"
export = (app: express.Application) => {
  // Index
  app.get("/", (req, res) => res.redirect("/dashboard/home"))
  // Home route
  app.use("/dashboard/home", new HomeRoutes().router)
  // User route
  app.use("/dashboard/user", new LoginRoutes().router)
  // Initiative route
  app.use("/dashboard/initiative", new InitiativeRoutes().router)
  // location route
  app.use("/dashboard/location", new LocationRoutes().router)
  // location trees route
  app.use("/dashboard/initrees", new LocationTreesRoutes().router)
  // Sponser route
  app.use("/dashboard/sponser", new SponserRoutes().router)
  // Country route
  app.use("/dashboard/country", new CountryRoutes().router)
  // City route
  app.use("/dashboard/city", new CityRoutes().router)
  // Region route
  app.use("/dashboard/region", new RegionRoutes().router)
  // Sector route
  app.use("/dashboard/sector", new SectorRoutes().router)
  // User route
  app.use("/dashboard/user", new UserRoutes().router)
  // Report route
  app.use("/dashboard/report", new ReportRoutes().router)
  // Tree route
  app.use("/dashboard/tree", new TreeRoutes().router)
  // Order route
  app.use("/dashboard/order", new OrderRoutes().router)
  // Promo route
  app.use("/dashboard/promo", new PromoRoutes().router)
  // Management route
  app.use("/dashboard/management", new TermsPolicyRoutes().router)
}
