import { Router } from "express";
import { EventCartController } from "../../controllers/website/event-cart.controller";
export class EventCartRoutes {
  public router: Router;
  public eventCartController: EventCartController = new EventCartController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.post("/addOrupdate", this.eventCartController.addOrUpdate);
    this.router.delete("/remove/:eventId", this.eventCartController.remove);
    this.router.get("/list", this.eventCartController.list);
    this.router.get("/count", this.eventCartController.count);
  }
}
