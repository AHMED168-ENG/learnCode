import { Router } from "express";
import { EventCartRoutes } from "./event-cart.route";
import { TripCartRoutes } from "./trip-cart.route";
export class CartRoutes {
  public router: Router;
  constructor(private tripCartRoutes: TripCartRoutes, private eventCartRoutes: EventCartRoutes) {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.use("/trip", this.tripCartRoutes.router);
    this.router.use("/event", this.eventCartRoutes.router);
  }
}
