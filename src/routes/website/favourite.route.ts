import { Router } from "express";
import { FavouriteController } from "../../controllers/website/favourite.controller";
export class FavouriteRoutes {
  public router: Router;
  private favouriteController = new FavouriteController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.favouriteController.getMyFavourites);
    this.router.put("/", this.favouriteController.updateFavourite);
  }
}
