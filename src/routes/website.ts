import express from "express";
import { FavouriteRoutes } from "./website/favourite.route";
import { ActivityRoutes } from "./website/activity.route";
import { CalendarRoutes } from "./website/calendar.route";
import { CartRoutes } from "./website/cart.route";
import { DestinationRoutes } from "./website/destination.route";
import { EventCartRoutes } from "./website/event-cart.route";
import { EventRoutes } from "./website/event.route";
import { TourGuideRoutes } from "./website/guide.route";
import { HomeRoutes } from "./website/home.route";
import { TripCartRoutes } from "./website/trip-cart.route";
import { TripRoutes } from "./website/trip.route";
import { UserRoutes } from "./website/user.route";
import { GuideRatingRoutes } from "./website/guide-rating.route";
import { GuideMessageRoutes } from "./website/guide-message.route";
import { FollowGuideRoutes } from "./website/follow-guide.route";
import { OTPRoutes } from "./website/otp.route";
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
  // Cart route
  app.use("/cart", new CartRoutes(new TripCartRoutes(), new EventCartRoutes()).router);
  // Event route
  app.use("/event", new EventRoutes().router);
  // Calendar route
  app.use("/calendar", new CalendarRoutes().router);
  // User route
  app.use("/user", new UserRoutes().router);
  // Tourguide route
  app.use("/guide", new TourGuideRoutes().router);
  // Guide Rating route
  app.use("/guide-rating", new GuideRatingRoutes().router);
  // Guide Message route
  app.use("/guide-message", new GuideMessageRoutes().router);
  // Favourite route
  app.use("/favourite", new FavouriteRoutes().router);
  // OTP route
  app.use("/otp", new OTPRoutes().router);
  // Follow Tour Guide route
  app.use("/follow/guide", new FollowGuideRoutes().router);
}
