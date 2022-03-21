import {Router} from "express"
import {RegionController} from "../../controllers/api/region.controller"

export class RegionRoutes {
  router: Router
  public regionController: RegionController = new RegionController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/:countryId/:cityId", this.regionController.byCountryAndCity)
  }
}
