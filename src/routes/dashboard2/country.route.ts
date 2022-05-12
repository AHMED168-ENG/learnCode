import {Router} from "express"
import {CountryController} from "../../controllers/dashboard2/country.controller"

export class CountryRoutes {
  router: Router
  public countryController: CountryController = new CountryController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.countryController.listPage)
    this.router.get("/list", this.countryController.list)
    this.router.get("/new", this.countryController.newPage)
    this.router.post("/new", this.countryController.addNew)
    this.router.get("/edit/:id", this.countryController.editPage)
    this.router.post("/edit/:id", this.countryController.edit)
  }
}
