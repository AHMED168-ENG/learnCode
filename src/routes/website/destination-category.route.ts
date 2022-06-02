import { Router } from "express";
import { DestinationCategoryController } from "../../controllers/website/destination-category.controller";
export class DestinationCategoryRoutes {
  public router: Router;
  public destinationCategoryController: DestinationCategoryController = new DestinationCategoryController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.destinationCategoryController.listPage);
    this.router.get("/list", this.destinationCategoryController.list);
    this.router.get("/view/:id", this.destinationCategoryController.viewPage);
    this.router.get("/new", this.destinationCategoryController.newPage);
    this.router.post("/new", this.destinationCategoryController.addNew);
    this.router.get("/edit/:id", this.destinationCategoryController.editPage);
    this.router.put("/edit/:id", this.destinationCategoryController.edit);
  }
}
