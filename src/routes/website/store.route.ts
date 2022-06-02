import { Router } from "express";
import { StoreController } from "../../controllers/website/store.controller";
export class StoreRoutes {
  public router: Router;
  public storeController: StoreController = new StoreController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.storeController.listPage);
    this.router.get("/list", this.storeController.list);
    this.router.get("/view/:id", this.storeController.viewPage);
    this.router.get("/new", this.storeController.newPage);
    this.router.post("/new", this.storeController.addNew);
    this.router.get("/edit/:id", this.storeController.editPage);
    this.router.put("/edit/:id", this.storeController.edit);
  }
}
