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
    this.router.get("/new", this.travelController.newPage);
    this.router.post("/new", this.travelController.addNew);
    this.router.get("/edit/:id", this.travelController.editPage);
    this.router.put("/edit/:id", this.travelController.edit);
  }
}
