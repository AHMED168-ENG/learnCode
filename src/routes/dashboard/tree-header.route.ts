import { Router } from "express";
import { TreesHeaderController } from "../../controllers/dashboard/trees-header.controller";
export class TreeHeaderRoutes {
  public router: Router;
  public treesHeaderController: TreesHeaderController = new TreesHeaderController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.treesHeaderController.listPage);
    this.router.get("/list", this.treesHeaderController.getTreesHeaders);
    this.router.get("/new", this.treesHeaderController.newPage);
    this.router.post("/new", this.treesHeaderController.addTreesHeader);
    this.router.get("/edit/:id", this.treesHeaderController.editPage);
    this.router.put("/edit/:id", this.treesHeaderController.editTreesHeader);
  }
}
