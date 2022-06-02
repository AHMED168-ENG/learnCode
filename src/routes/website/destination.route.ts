import { Router } from "express";
import { DestinationController } from "../../controllers/website/destination.controller";
export class DestinationRoutes {
  public router: Router;
  public destinationController: DestinationController = new DestinationController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.destinationController.listPage);
    this.router.get("/list", this.destinationController.list);
    this.router.get("/view/:id", this.destinationController.viewPage);
  }
}
