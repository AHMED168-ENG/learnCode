import {Router} from "express"
import { InitiativesLocationController } from "../../controllers/api/initiative-location.controller"

export class InitiativesLocationRoutes {
  router: Router
  public initiativeLocationController: InitiativesLocationController = new InitiativesLocationController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.initiativeLocationController.list)
    this.router.get("/map", this.initiativeLocationController.getMapLocations)
    this.router.get("/:id", this.initiativeLocationController.details)
  }
}
