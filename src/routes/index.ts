import express, {Request, Response, NextFunction} from "express"
import {PartnerRoutes} from "./v1/partner.route"
import {AuthRoutes} from "./v1/auth.route"
import {CartRoutes} from "./v1/cart.route"
import {CityRoutes} from "./v1/city.route"
import {CountryRoutes} from "./v1/country.route"
import {FaqRoutes} from "./v1/faq.route"
import {FavouriteRoutes} from "./v1/favourite.route"
import {HomeRoutes} from "./v1/home.route"
import {InitiativesLocationRoutes} from "./v1/initiative-location.route"
import {InitiativesTreesRoutes} from "./v1/initiative-trees.route"
import {InitiativeRoutes} from "./v1/initiative.route"
import {MessageRoutes} from "./v1/message.route"
import {OrderDetailsRoutes} from "./v1/order-details.route"
import {OrderRoutes} from "./v1/order.route"
import {PromoRoutes} from "./v1/promo.route"
import {RegionRoutes} from "./v1/region.route"
import {SectorRoutes} from "./v1/sector.route"
import {TermsPolicyRoutes} from "./v1/terms&policy.route"
import { TreesInfoRoutes } from "./v1/trees-info.route"
import { RewardsPointsRoutes } from "./v1/rewards.route"

export = (app: express.Application) => {
  // user Route
  app.use("/v1/auth", new AuthRoutes().router)
  // country Route
  app.use("/v1/country", new CountryRoutes().router)
  // city Route
  app.use("/v1/city", new CityRoutes().router)
  // region Route
  app.use("/v1/region", new RegionRoutes().router)
  // sector Route
  app.use("/v1/sector", new SectorRoutes().router)
  // home Route
  app.use("/v1/home", new HomeRoutes().router)
  // rewards Route
  app.use("/v1/rewards", new RewardsPointsRoutes().router)
  // initiative Route
  app.use("/v1/initiative", new InitiativeRoutes().router)
  // Initiatives Location Route
  app.use("/v1/initLocation", new InitiativesLocationRoutes().router)
  // Initiatives trees Route
  app.use("/v1/InitTrees", new InitiativesTreesRoutes().router)
  // favourite Route
  app.use("/v1/favourite", new FavouriteRoutes().router)
  // cart Route
  app.use("/v1/cart", new CartRoutes().router)
  // Promo code Route
  app.use("/v1/promo", new PromoRoutes().router)
  // Order Route
  app.use("/v1/order", new OrderRoutes().router)
  // OrderDetails Route
  app.use("/v1/orderDetails", new OrderDetailsRoutes().router)
  // Management Route
  app.use("/v1/management", new TermsPolicyRoutes().router)
  // FAQ Route
  app.use("/v1/faq", new FaqRoutes().router)
  // Tree Info Route
  app.use("/v1/tree-info", new TreesInfoRoutes().router)
  // Message Route
  app.use("/v1/message", new MessageRoutes().router)
  // Partner Route
  app.use("/v1/partner", new PartnerRoutes().router)

  // Not found route
  app.use("/v1/*", (req, res) => res.status(404).json({message: "this route not found"}))
}
