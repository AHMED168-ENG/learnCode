import express, {Request, Response, NextFunction} from "express"
import {HomeRoutes} from "./dashboard/home.route"
import {AdminRoutes} from "./dashboard/admin.route"
import {InitiativeRoutes} from "./dashboard/initiative.route"
import {SponserRoutes} from "./dashboard/sponser.route"
import {CountryRoutes} from "./dashboard/country.route"
import {CityRoutes} from "./dashboard/city.route"
import {RegionRoutes} from "./dashboard/region.route"
import {SectorRoutes} from "./dashboard/sector.route"
import {UserRoutes} from "./dashboard/user.route"
import {ReportRoutes} from "./dashboard/report.route"
import {TreeRoutes} from "./dashboard/tree.route"
import {OrderRoutes} from "./dashboard/order.route"
import {PromoRoutes} from "./dashboard/promo.route"
import {TermsPolicyRoutes} from "./dashboard/terms&policy.route"
import {LocationRoutes} from "./dashboard/location.route"
import {LocationTreesRoutes} from "./dashboard/location-trees.route"
import {FaqRoutes} from "./dashboard/faq.route"
import {PartnerRoutes} from "./dashboard/partner.route"
import {PartnerTypeRoutes} from "./dashboard/partner-type.route"
import {MessageRoutes} from "./dashboard/message.route"
import { TreeHeaderRoutes } from "./dashboard/tree-header.route"
import { TreeBodyRoutes } from "./dashboard/tree-body.route"
import { UserRolesRoutes } from "./dashboard/user-roles.route"
import { UserPermissionsRoutes } from "./dashboard/user-permissions.route"
import { ActivityCategoryRoutes } from "./dashboard/activity-category.route"
import { ActivityRoutes } from "./dashboard/activity.route"
import { AdsRoutes } from "./dashboard/ads.route"
import { AudienceCategoryRoutes } from "./dashboard/audience-category.route"
import { DestinationCategoryRoutes } from "./dashboard/destination-category.route"
import { DestinationPlaceRoutes } from "./dashboard/destination-place.route"
import { DestinationStoreRoutes } from "./dashboard/destination-store.route"
import { DestinationRoutes } from "./dashboard/destination.route"
import { EventCategoryRoutes } from "./dashboard/event-category.route"
import { EventRoutes } from "./dashboard/event.route"
import { TourGuideRoutes } from "./dashboard/guide.route"
import { HotelRoutes } from "./dashboard/hotel.route"
import { MediaRoutes } from "./dashboard/media.route"
import { MembershipRoutes } from "./dashboard/membership.route"
import { PackageBookingRoutes } from "./dashboard/package-booking.route"
import { PackageRoutes } from "./dashboard/package.route"
import { ProviderRoutes } from "./dashboard/provider.route"
import { RestaurantRoutes } from "./dashboard/restaurant.route"
import { StoreRoutes } from "./dashboard/store.route"
import { TicketRoutes } from "./dashboard/ticket.route"
import { TravelRoutes } from "./dashboard/travel.route"
import { TripRoutes } from "./dashboard/trip.route"
import { GuideTripRoutes } from "./dashboard/guide-trip.route"
import { TransportationRoutes } from "./dashboard/transportation.route"
import { DestinationTransportationRoutes } from "./dashboard/destination-transportation.route"
import { RentalCompanyRoutes } from "./dashboard/rental-company.route"
import { DriverRoutes } from "./dashboard/driver.route"
import { CompanyOfferRoutes } from "./dashboard/company-offer.route"
export = (app: express.Application) => {
  // Index
  app.get("/dashboard", (req, res) => res.redirect("/dashboard/home"))
  // Home route
  app.use("/dashboard/home", new HomeRoutes().router)
  // Admin route
  app.use("/dashboard/admin", new AdminRoutes().router)
  // User Roles route
  app.use("/dashboard/user/roles", new UserRolesRoutes().router)
  // User Permissions route
  app.use("/dashboard/user/permissions", new UserPermissionsRoutes().router)
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
  // Tree Header route
  app.use("/dashboard/tree/header", new TreeHeaderRoutes().router)
  // Tree Body route
  app.use("/dashboard/tree/body", new TreeBodyRoutes().router)
  // Order route
  app.use("/dashboard/order", new OrderRoutes().router)
  // Promo route
  app.use("/dashboard/promo", new PromoRoutes().router)
  // Management route
  app.use("/dashboard/management", new TermsPolicyRoutes().router)
  // FAQ route
  app.use("/dashboard/faq", new FaqRoutes().router)
  // Partner Type route
  app.use("/dashboard/partner/type", new PartnerTypeRoutes().router)
  // Partner route
  app.use("/dashboard/partner", new PartnerRoutes().router)
  // Message route
  app.use("/dashboard/message", new MessageRoutes().router)
  // Destination route
  app.use("/dashboard/destination", new DestinationRoutes().router);
  // Transportation route
  app.use("/dashboard/transportation", new TransportationRoutes().router);
  // Destination Transportation route
  app.use("/dashboard/destination-transportation", new DestinationTransportationRoutes().router);
  // Rental Company route
  app.use("/dashboard/rental-company", new RentalCompanyRoutes().router);
  // Company Offer route
  app.use("/dashboard/company-offer", new CompanyOfferRoutes().router);
  // Driver route
  app.use("/dashboard/driver", new DriverRoutes().router);
  // Destination Place route
  app.use("/dashboard/destination-place", new DestinationPlaceRoutes().router);
  // Destination Store route
  app.use("/dashboard/destination-store", new DestinationStoreRoutes().router);
  // Package route
  app.use("/dashboard/package", new PackageRoutes().router);
  // Ticket route
  app.use("/dashboard/ticket", new TicketRoutes().router);
  // Trip route
  app.use("/dashboard/trip", new TripRoutes().router);
  // Membership route
  app.use("/dashboard/membership", new MembershipRoutes().router);
  // Restaurant route
  app.use("/dashboard/restaurant", new RestaurantRoutes().router);
  // Hotel route
  app.use("/dashboard/hotel", new HotelRoutes().router);
  // Activity route
  app.use("/dashboard/activity", new ActivityRoutes().router);
  // Activity Category route
  app.use("/dashboard/activity-category", new ActivityCategoryRoutes().router);
  // Destination Interest Category route
  app.use("/dashboard/destination-category", new DestinationCategoryRoutes().router);
  // Event route
  app.use("/dashboard/event", new EventRoutes().router);
  // Event Category route
  app.use("/dashboard/event-category", new EventCategoryRoutes().router);
  // Audience Category route
  app.use("/dashboard/audience-category", new AudienceCategoryRoutes().router);
  // Provider route
  app.use("/dashboard/provider", new ProviderRoutes().router);
  // Tour Guide route
  app.use("/dashboard/guide", new TourGuideRoutes().router);
  // Store route
  app.use("/dashboard/store", new StoreRoutes().router);
  // Media route
  app.use("/dashboard/media", new MediaRoutes().router);
  // Advertisement route
  app.use("/dashboard/ads", new AdsRoutes().router);
  // Package Booking route
  app.use("/dashboard/package-booking", new PackageBookingRoutes().router);
  // Travel Essentials route
  app.use("/dashboard/travel", new TravelRoutes().router);
  // Tour Guide Trip route
  app.use("/dashboard/guide-trip", new GuideTripRoutes().router);
}
