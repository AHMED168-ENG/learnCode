import { Router } from "express";
import { AdsController } from "../../controllers/dashboard/ads.controller";
export class AdsRoutes {
  public router: Router;
  public adsController: AdsController = new AdsController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.adsController.listPage);
    this.router.get("/list", this.adsController.list);
    this.router.get("/view/:id", this.adsController.viewPage);
    this.router.put("/edit/:id", this.adsController.edit);
  }
}
