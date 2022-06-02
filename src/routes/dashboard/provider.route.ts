import { Router } from "express";
import { ProviderController } from "../../controllers/dashboard/provider.controller";
export class ProviderRoutes {
  public router: Router;
  public providerController: ProviderController = new ProviderController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.providerController.listPage);
    this.router.get("/list", this.providerController.list);
    this.router.get("/view/:id", this.providerController.viewPage);
    this.router.get("/new", this.providerController.newPage);
    this.router.post("/new", this.providerController.addNew);
    this.router.get("/edit/:id", this.providerController.editPage);
    this.router.put("/edit/:id", this.providerController.edit);
  }
}
