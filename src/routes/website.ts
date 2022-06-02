import express from "express";
import { ActivityRoutes } from "./website/activity.route";
import { DestinationRoutes } from "./website/destination.route";
import { HomeRoutes } from "./website/home.route";
export = (app: express.Application) => {
  // Index
  app.get("/", (req, res) => res.redirect("/home"));
  // Home route
  app.use("/home", new HomeRoutes().router);
  // Destination route
  app.use("/destination", new DestinationRoutes().router);
  // Activity route
  app.use("/activity", new ActivityRoutes().router);
}
