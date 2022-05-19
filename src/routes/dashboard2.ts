import express from "express";
import { HomeRoutes } from "./dashboard2/home.route";
import { DestinationRoutes } from "./dashboard2/destination.route";
import { DestinationPlaceRoutes } from "./dashboard2/destination-place.route";
import { DestinationStoreRoutes } from "./dashboard2/destination-store.route";
import { RestaurantRoutes } from "./dashboard2/restaurant.route";
import { ActivityCategoryRoutes } from "./dashboard2/activity-category.route";
import { ActivityRoutes } from "./dashboard2/activity.route";
import { ProviderRoutes } from "./dashboard2/provider.route";
import { TourGuideRoutes } from "./dashboard2/guide.route";
export = (app: express.Application) => {
  // Home route
  app.use("/dashboard2/home", new HomeRoutes().router);
  // Destination route
  app.use("/dashboard2/destination", new DestinationRoutes().router);
  // Destination Place route
  app.use("/dashboard2/destination-place", new DestinationPlaceRoutes().router);
  // Destination Store route
  app.use("/dashboard2/destination-store", new DestinationStoreRoutes().router);
  // Restaurant route
  app.use("/dashboard2/restaurant", new RestaurantRoutes().router);
  // Activity route
  app.use("/dashboard2/activity", new ActivityRoutes().router);
  // Activity Category route
  app.use("/dashboard2/activity-category", new ActivityCategoryRoutes().router);
  // Provider route
  app.use("/dashboard2/provider", new ProviderRoutes().router);
  // Tour Guide route
  app.use("/dashboard2/guide", new TourGuideRoutes().router);
}
