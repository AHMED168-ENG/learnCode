import {Router} from "express"
import {LocationController} from "../../controllers/dashboard/location.controller"

export class LocationRoutes {
  router: Router
  public locationController: LocationController = new LocationController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.locationController.listPage)
    this.router.get("/list", this.locationController.list)
    this.router.get("/new", this.locationController.newPage)
    this.router.post("/new", this.locationController.addNew)
    this.router.get("/edit/:id", this.locationController.editPage)
    this.router.post("/edit/:id", this.locationController.edit)
    this.router.delete("/:action/:id", this.locationController.active)
    this.router.get("/listLocationByInit/:id", this.locationController.listLocationByInit)

  }
}
