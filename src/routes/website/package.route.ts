import { Router } from "express";
import { PackageController } from "../../controllers/website/package.controller";
export class PackageRoutes {
  public router: Router;
  public packageController: PackageController = new PackageController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.packageController.listPage);
    this.router.get("/list", this.packageController.list);
    this.router.get("/view/:id", this.packageController.viewPage);
    this.router.get("/new", this.packageController.newPage);
    this.router.post("/new", this.packageController.addNew);
    this.router.get("/edit/:id", this.packageController.editPage);
    this.router.put("/edit/:id", this.packageController.edit);
  }
}
