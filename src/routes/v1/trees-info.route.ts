import { Router } from "express";
import { TreesInfoController } from "../../controllers/api/trees-info.controller";
export class TreesInfoRoutes {
  public router: Router;
  public treesInfoController: TreesInfoController = new TreesInfoController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  private routes() { this.router.get("/:id", this.treesInfoController.getInfo); }
}
