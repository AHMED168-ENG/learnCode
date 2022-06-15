import { Router } from "express";
import { GuideTripController } from "../../controllers/dashboard/guide-trip.controller";
export class GuideTripRoutes {
  public router: Router;
  public guideTripController: GuideTripController = new GuideTripController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/:guide_id/", this.guideTripController.listPage);
    this.router.get("/:guide_id/list", this.guideTripController.list);
    this.router.get("/:guide_id/new", this.guideTripController.newPage);
    this.router.post("/:guide_id/new", this.guideTripController.addNew);
    this.router.get("/:guide_id/edit/:id", this.guideTripController.editPage);
    this.router.put("/:guide_id/edit/:id", this.guideTripController.edit);
  }
}
