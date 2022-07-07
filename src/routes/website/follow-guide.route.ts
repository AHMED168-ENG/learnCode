import { Router } from "express";
import { GuideFollowController } from "../../controllers/website/follow-guide.controller";
export class FollowGuideRoutes {
  public router: Router;
  private followGuideController = new GuideFollowController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.put("/", this.followGuideController.updateFollow);
  }
}
