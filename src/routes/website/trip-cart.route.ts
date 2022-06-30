import { Router } from "express";
import { TripCartController } from "../../controllers/website/trip-cart.controller";
export class TripCartRoutes {
  public router: Router;
  public tripCartController: TripCartController = new TripCartController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.post("/addOrupdate", this.tripCartController.addOrUpdate);
    this.router.delete("/remove/:tripId", this.tripCartController.remove);
    this.router.get("/list", this.tripCartController.list);
    this.router.get("/count", this.tripCartController.count);
  }
}
