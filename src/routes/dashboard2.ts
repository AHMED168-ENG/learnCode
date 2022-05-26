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
import { StoreRoutes } from "./dashboard2/store.route";
import { MediaRoutes } from "./dashboard2/media.route";
import { PackageRoutes } from "./dashboard2/package.route";
import { EventCategoryRoutes } from "./dashboard2/event-category.route";
import { EventRoutes } from "./dashboard2/event.route";
import { HotelRoutes } from "./dashboard2/hotel.route";
import { TicketRoutes } from "./dashboard2/ticket.route";
import { TripRoutes } from "./dashboard2/trip.route";
import { AdsRoutes } from "./dashboard2/ads.route";
import { MembershipRoutes } from "./dashboard2/membership.route";
export = (app: express.Application) => {
  // Home route
  app.use("/dashboard2/home", new HomeRoutes().router);
  // Destination route
  app.use("/dashboard2/destination", new DestinationRoutes().router);
  // Destination Place route
  app.use("/dashboard2/destination-place", new DestinationPlaceRoutes().router);
  // Destination Store route
  app.use("/dashboard2/destination-store", new DestinationStoreRoutes().router);
  // Package route
  app.use("/dashboard2/package", new PackageRoutes().router);
  // Ticket route
  app.use("/dashboard2/ticket", new TicketRoutes().router);
  // Trip route
  app.use("/dashboard2/trip", new TripRoutes().router);
  // Membership route
  app.use("/dashboard2/membership", new MembershipRoutes().router);
  // Restaurant route
  app.use("/dashboard2/restaurant", new RestaurantRoutes().router);
  // Hotel route
  app.use("/dashboard2/hotel", new HotelRoutes().router);
  // Activity route
  app.use("/dashboard2/activity", new ActivityRoutes().router);
  // Activity Category route
  app.use("/dashboard2/activity-category", new ActivityCategoryRoutes().router);
  // Event route
  app.use("/dashboard2/event", new EventRoutes().router);
  // Event Category route
  app.use("/dashboard2/event-category", new EventCategoryRoutes().router);
  // Provider route
  app.use("/dashboard2/provider", new ProviderRoutes().router);
  // Tour Guide route
  app.use("/dashboard2/guide", new TourGuideRoutes().router);
  // Store route
  app.use("/dashboard2/store", new StoreRoutes().router);
  // Media route
  app.use("/dashboard2/media", new MediaRoutes().router);
  // Advertisement route
  app.use("/dashboard2/ads", new AdsRoutes().router);
}
