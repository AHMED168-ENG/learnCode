import {Router} from "express"
import {CityController} from "../../controllers/api/city.controller"

export class CityRoutes {
  router: Router
  public cityController: CityController = new CityController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/:countryId", this.cityController.byCountry)
  }
}
