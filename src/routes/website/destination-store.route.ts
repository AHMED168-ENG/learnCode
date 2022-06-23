import { Router } from "express";
import { DestinationStoreController } from "../../controllers/website/destination-store.controller";
export class DestinationStoreRoutes {
  public router: Router;
  public destinationStoreController: DestinationStoreController = new DestinationStoreController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.destinationStoreController.listPage);
    this.router.get("/list", this.destinationStoreController.list);
    this.router.get("/view/:id", this.destinationStoreController.viewPage);
    // this.router.get("/new", this.destinationStoreController.newPage);
    // this.router.post("/new", this.destinationStoreController.addNew);
    // this.router.get("/edit/:id", this.destinationStoreController.editPage);
    // this.router.put("/edit/:id", this.destinationStoreController.edit);
  }
}
