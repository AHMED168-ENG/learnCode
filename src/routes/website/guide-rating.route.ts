import { Router } from "express";
import { GuideRatingController } from "../../controllers/website/guide-rating.controller";
export class GuideRatingRoutes {
  public router: Router;
  public guideRatingController: GuideRatingController = new GuideRatingController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.post("/:guide_id", this.guideRatingController.addEditGuideRating);
  }
}
