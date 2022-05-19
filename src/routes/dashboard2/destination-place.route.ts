import { Router } from "express";
import { DestinationPlaceController } from "../../controllers/dashboard2/destination-place.controller";
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
    this.router.get("/new", this.destinationPlaceController.newPage);
    this.router.post("/new", this.destinationPlaceController.addNew);
    this.router.get("/edit/:id", this.destinationPlaceController.editPage);
    this.router.put("/edit/:id", this.destinationPlaceController.edit);
  }
}
