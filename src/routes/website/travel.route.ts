import { Router } from "express";
import { TravelController } from "../../controllers/website/travel.controller";
export class TravelRoutes {
  public router: Router;
  public travelController: TravelController = new TravelController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.travelController.listPage);
    this.router.get("/list", this.travelController.list);
  }
}
