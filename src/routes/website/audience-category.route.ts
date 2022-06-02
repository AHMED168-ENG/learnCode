import { Router } from "express";
import { AudienceCategoryController } from "../../controllers/website/audience-category.controller";
export class AudienceCategoryRoutes {
  public router: Router;
  public audienceCategoryController: AudienceCategoryController = new AudienceCategoryController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.audienceCategoryController.listPage);
    this.router.get("/list", this.audienceCategoryController.list);
    this.router.get("/view/:id", this.audienceCategoryController.viewPage);
    this.router.get("/new", this.audienceCategoryController.newPage);
    this.router.post("/new", this.audienceCategoryController.addNew);
    this.router.get("/edit/:id", this.audienceCategoryController.editPage);
    this.router.put("/edit/:id", this.audienceCategoryController.edit);
  }
}
