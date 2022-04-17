import { Router } from "express";
import { TreesBodyController } from "../../controllers/dashboard/trees-body.controller";
export class TreeBodyRoutes {
  public router: Router;
  public treesBodyController: TreesBodyController = new TreesBodyController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/new/:tree_id/:header_id", this.treesBodyController.newPage);
    this.router.post("/new/:tree_id/:header_id", this.treesBodyController.addTreesBody);
    this.router.get("/edit/:id", this.treesBodyController.editPage);
    this.router.put("/edit/:id", this.treesBodyController.editTreesBody);
  }
}
