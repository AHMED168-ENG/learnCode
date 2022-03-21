import {Router} from "express"
import { CountryController } from "../../controllers/api/country.controller"

export class CountryRoutes {
  router: Router
  public countryController: CountryController = new CountryController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/",this.countryController.list)
  }
}
