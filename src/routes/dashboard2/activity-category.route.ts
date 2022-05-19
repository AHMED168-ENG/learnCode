import { Router } from "express";
import { ActivityCategoryController } from "../../controllers/dashboard2/activity-category.controller";
export class ActivityCategoryRoutes {
  public router: Router;
  public activityCategoryController: ActivityCategoryController = new ActivityCategoryController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.activityCategoryController.listPage);
    this.router.get("/list", this.activityCategoryController.list);
    this.router.get("/view/:id", this.activityCategoryController.viewPage);
    this.router.get("/new", this.activityCategoryController.newPage);
    this.router.post("/new", this.activityCategoryController.addNew);
    this.router.get("/edit/:id", this.activityCategoryController.editPage);
    this.router.put("/edit/:id", this.activityCategoryController.edit);
  }
}
