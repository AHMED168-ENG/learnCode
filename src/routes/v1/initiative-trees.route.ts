import {Router} from "express"
import {InitiativesTreesController} from "../../controllers/api/initiative-trees.controller"

export class InitiativesTreesRoutes {
  router: Router
  public initiativesTreesController: InitiativesTreesController = new InitiativesTreesController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/location/:locationId", this.initiativesTreesController.locationTrees)
    this.router.get("/locationTree/:locationTreeId", this.initiativesTreesController.locationTreeDetails)
  }
}
