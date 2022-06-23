import { Router } from "express";
import { TransportationController } from "../../controllers/dashboard/transportation.controller";
export class TransportationRoutes {
  public router: Router;
  public transportationController: TransportationController = new TransportationController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.transportationController.listPage);
    this.router.get("/list", this.transportationController.list);
    this.router.get("/view/:id", this.transportationController.viewPage);
    this.router.get("/new", this.transportationController.newPage);
    this.router.post("/new", this.transportationController.addNew);
    this.router.get("/edit/:id", this.transportationController.editPage);
    this.router.put("/edit/:id", this.transportationController.edit);
  }
}
