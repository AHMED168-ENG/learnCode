import express from "express";
import { ActivityRoutes } from "./website/activity.route";
import { CalendarRoutes } from "./website/calendar.route";
import { DestinationRoutes } from "./website/destination.route";
import { EventRoutes } from "./website/event.route";
import { HomeRoutes } from "./website/home.route";
import { TripRoutes } from "./website/trip.route";
export = (app: express.Application) => {
  // Index
  app.get("/", (req, res) => res.redirect("/home"));
  // Home route
  app.use("/home", new HomeRoutes().router);
  // Destination route
  app.use("/destination", new DestinationRoutes().router);
  // Activity route
  app.use("/activity", new ActivityRoutes().router);
  // Trip route
  app.use("/trip", new TripRoutes().router);
  // Event route
  app.use("/event", new EventRoutes().router);
  // Calendar route
  app.use("/calendar", new CalendarRoutes().router);
}
