import {Router} from "express"
import {FavouriteInitController} from "../../controllers/api/favourite-initiative.controller"

export class FavouriteRoutes {
  router: Router
  public favouriteInitController: FavouriteInitController = new FavouriteInitController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/addOrRemove/:initId", this.favouriteInitController.addOrRemove)
  }
}
