import { Router } from "express";
import { GuideMessageController } from "../../controllers/website/guide-message.controller";
export class GuideMessageRoutes {
  public router: Router;
  public guideMessageController: GuideMessageController = new GuideMessageController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.post("/:guide_id", this.guideMessageController.addGuideMessage);
  }
}
