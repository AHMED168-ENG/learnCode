import { Router } from "express";
import { TripController } from "../../controllers/dashboard/trip.controller";
export class TripRoutes {
  public router: Router;
  public tripController: TripController = new TripController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.tripController.listPage);
    this.router.get("/list", this.tripController.list);
    this.router.get("/view/:id", this.tripController.viewPage);
    this.router.get("/new", this.tripController.newPage);
    this.router.post("/new", this.tripController.addNew);
    this.router.get("/edit/:id", this.tripController.editPage);
    this.router.put("/edit/:id", this.tripController.edit);
  }
}
