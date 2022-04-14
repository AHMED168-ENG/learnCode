import { Router } from "express";
import { RewardsPointsController } from "../../controllers/api/rewards-points.controller";
export class RewardsPointsRoutes {
  public router: Router;
  public rewardsPointsController: RewardsPointsController = new RewardsPointsController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  private routes() {
    this.router.get("/", this.rewardsPointsController.getRewards);
  }
}
