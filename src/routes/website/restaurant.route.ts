import { Router } from "express";
import { RestaurantController } from "../../controllers/website/restaurant.controller";
export class RestaurantRoutes {
  public router: Router;
  public restaurantController: RestaurantController = new RestaurantController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.restaurantController.listPage);
    this.router.get("/list", this.restaurantController.list);
    this.router.get("/view/:id", this.restaurantController.viewPage);
    this.router.get("/new", this.restaurantController.newPage);
    this.router.post("/new", this.restaurantController.addNew);
    this.router.get("/edit/:id", this.restaurantController.editPage);
    this.router.put("/edit/:id", this.restaurantController.edit);
  }
}
