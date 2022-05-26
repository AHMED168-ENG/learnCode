import { Router } from "express";
import { EventController } from "../../controllers/dashboard2/event.controller";
export class EventRoutes {
  public router: Router;
  public eventController: EventController = new EventController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.eventController.listPage);
    this.router.get("/list", this.eventController.list);
    this.router.get("/view/:id", this.eventController.viewPage);
    this.router.get("/new", this.eventController.newPage);
    this.router.post("/new", this.eventController.addNew);
    this.router.get("/edit/:id", this.eventController.editPage);
    this.router.put("/edit/:id", this.eventController.edit);
  }
}
