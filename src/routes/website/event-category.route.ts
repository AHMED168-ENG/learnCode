import { Router } from "express";
import { EventCategoryController } from "../../controllers/website/event-category.controller";
export class EventCategoryRoutes {
  public router: Router;
  public eventCategoryController: EventCategoryController = new EventCategoryController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.eventCategoryController.listPage);
    this.router.get("/list", this.eventCategoryController.list);
    this.router.get("/view/:id", this.eventCategoryController.viewPage);
    this.router.get("/new", this.eventCategoryController.newPage);
    this.router.post("/new", this.eventCategoryController.addNew);
    this.router.get("/edit/:id", this.eventCategoryController.editPage);
    this.router.put("/edit/:id", this.eventCategoryController.edit);
  }
}
