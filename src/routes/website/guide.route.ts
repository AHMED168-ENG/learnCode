import { Router } from "express";
import { TourGuideController } from "../../controllers/website/guide.controller";
export class TourGuideRoutes {
  public router: Router;
  public tourGuideController: TourGuideController = new TourGuideController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.tourGuideController.listPage);
    this.router.get("/list", this.tourGuideController.list);
    this.router.get("/view/:id", this.tourGuideController.viewPage);
    this.router.get("/register", this.tourGuideController.getRegisterPage);
    this.router.post("/register", this.tourGuideController.signup);
    this.router.post("/resetPassword", this.tourGuideController.resetPassword);
  }
}
