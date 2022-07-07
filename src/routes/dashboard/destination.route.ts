import { Router } from "express";
import { DestinationsController } from "../../controllers/dashboard/destination.controller";
export class DestinationRoutes {
  public router: Router;
  public destinationController: DestinationsController = new DestinationsController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.destinationController.listPage);
    this.router.get("/list", this.destinationController.list);
    this.router.get("/view/:id", this.destinationController.viewPage);
    this.router.get("/new", this.destinationController.newPage);
    this.router.post("/new", this.destinationController.addNew);
    this.router.get("/edit/:id", this.destinationController.editPage);
    this.router.put("/edit/:id", this.destinationController.edit);
  }
}
