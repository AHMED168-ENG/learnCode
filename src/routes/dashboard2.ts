import express, {Request, Response, NextFunction} from "express"
import {HomeRoutes} from "./dashboard2/home.route"
import {AdminRoutes} from "./dashboard2/admin.route"
import {InitiativeRoutes} from "./dashboard2/initiative.route"
import {SponserRoutes} from "./dashboard2/sponser.route"
import {CountryRoutes} from "./dashboard2/country.route"
import {CityRoutes} from "./dashboard2/city.route"
import {RegionRoutes} from "./dashboard2/region.route"
import {SectorRoutes} from "./dashboard2/sector.route"
import {UserRoutes} from "./dashboard2/user.route"
import {ReportRoutes} from "./dashboard2/report.route"
import {TreeRoutes} from "./dashboard2/tree.route"
import {OrderRoutes} from "./dashboard2/order.route"
import {PromoRoutes} from "./dashboard2/promo.route"
import {TermsPolicyRoutes} from "./dashboard2/terms&policy.route"
import {LocationRoutes} from "./dashboard2/location.route"
import {LocationTreesRoutes} from "./dashboard2/location-trees.route"
import {FaqRoutes} from "./dashboard2/faq.route"
import {PartnerRoutes} from "./dashboard2/partner.route"
import {PartnerTypeRoutes} from "./dashboard2/partner-type.route"
import {MessageRoutes} from "./dashboard2/message.route"
import { TreeHeaderRoutes } from "./dashboard2/tree-header.route"
import { TreeBodyRoutes } from "./dashboard2/tree-body.route"
import { UserRolesRoutes } from "./dashboard2/user-roles.route"
import { UserPermissionsRoutes } from "./dashboard2/user-permissions.route"
export = (app: express.Application) => {
  // Home route
  app.use("/dashboard2/home", new HomeRoutes().router)
  // Admin route
  app.use("/dashboard2/admin", new AdminRoutes().router)
  // User Roles route
  app.use("/dashboard2/user/roles", new UserRolesRoutes().router)
  // User Permissions route
  app.use("/dashboard2/user/permissions", new UserPermissionsRoutes().router)
  // Initiative route
  app.use("/dashboard2/initiative", new InitiativeRoutes().router)
  // location route
  app.use("/dashboard2/location", new LocationRoutes().router)
  // location trees route
  app.use("/dashboard2/initrees", new LocationTreesRoutes().router)
  // Sponser route
  app.use("/dashboard2/sponser", new SponserRoutes().router)
  // Country route
  app.use("/dashboard2/country", new CountryRoutes().router)
  // City route
  app.use("/dashboard2/city", new CityRoutes().router)
  // Region route
  app.use("/dashboard2/region", new RegionRoutes().router)
  // Sector route
  app.use("/dashboard2/sector", new SectorRoutes().router)
  // User route
  app.use("/dashboard2/user", new UserRoutes().router)
  // Report route
  app.use("/dashboard2/report", new ReportRoutes().router)
  // Tree route
  app.use("/dashboard2/tree", new TreeRoutes().router)
  // Tree Header route
  app.use("/dashboard2/tree/header", new TreeHeaderRoutes().router)
  // Tree Body route
  app.use("/dashboard2/tree/body", new TreeBodyRoutes().router)
  // Order route
  app.use("/dashboard2/order", new OrderRoutes().router)
  // Promo route
  app.use("/dashboard2/promo", new PromoRoutes().router)
  // Management route
  app.use("/dashboard2/management", new TermsPolicyRoutes().router)
  // FAQ route
  app.use("/dashboard2/faq", new FaqRoutes().router)
  // Partner Type route
  app.use("/dashboard2/partner/type", new PartnerTypeRoutes().router)
  // Partner route
  app.use("/dashboard2/partner", new PartnerRoutes().router)
  // Message route
  app.use("/dashboard2/message", new MessageRoutes().router)
}
