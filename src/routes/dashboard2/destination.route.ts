import { Router } from "express";
import { DestinationController } from "../../controllers/dashboard2/destination.controller";
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
    this.router.get("/new", this.destinationController.newPage);
    this.router.post("/new", this.destinationController.addNew);
    this.router.get("/edit/:id", this.destinationController.editPage);
    this.router.put("/edit/:id", this.destinationController.edit);
  }
}
