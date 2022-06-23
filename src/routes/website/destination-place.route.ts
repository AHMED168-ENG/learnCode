import { Router } from "express";
import { DestinationPlaceController } from "../../controllers/website/destination-place.controller";
export class DestinationPlaceRoutes {
  public router: Router;
  public destinationPlaceController: DestinationPlaceController = new DestinationPlaceController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.destinationPlaceController.listPage);
    this.router.get("/list", this.destinationPlaceController.list);
    this.router.get("/view/:id", this.destinationPlaceController.viewPage);
  }
}
