import { Router } from "express";
import { ActivityController } from "../../controllers/dashboard2/activity.controller";
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
    this.router.get("/new", this.activityController.newPage);
    this.router.post("/new", this.activityController.addNew);
    this.router.get("/edit/:id", this.activityController.editPage);
    this.router.put("/edit/:id", this.activityController.edit);
  }
}
