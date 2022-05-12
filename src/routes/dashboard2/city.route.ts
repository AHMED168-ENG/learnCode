import {Router} from "express"
import {CityController} from "../../controllers/dashboard2/city.controller"

export class CityRoutes {
  router: Router
  public cityController: CityController = new CityController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.cityController.listPage)
    this.router.get("/list", this.cityController.list)
    this.router.get("/new", this.cityController.newPage)
    this.router.post("/new", this.cityController.addNew)
    this.router.get("/edit/:id", this.cityController.editPage)
    this.router.post("/edit/:id", this.cityController.edit)
    this.router.get("/listBycountry/:id", this.cityController.listCityByCountry)
  }
}
