import { Router } from "express";
import { ActivityController } from "../../controllers/website/activity.controller";
export class ActivityRoutes {
  public router: Router;
  public activityController: ActivityController = new ActivityController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.activityController.listPage);
    this.router.get("/list", this.activityController.list);
    this.router.get("/view/:id", this.activityController.viewPage);
  }
}
