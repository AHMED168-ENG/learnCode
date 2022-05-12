import {Router} from "express"
import {LocationTreesController} from "../../controllers/dashboard2/location-trees.controller"

export class LocationTreesRoutes {
  router: Router
  public locationTreesController: LocationTreesController = new LocationTreesController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.locationTreesController.listPage)
    this.router.get("/list", this.locationTreesController.list)
    this.router.get("/new", this.locationTreesController.newPage)
    this.router.post("/new", this.locationTreesController.addNew)
    this.router.get("/edit/:id", this.locationTreesController.editPage)
    this.router.post("/edit/:id", this.locationTreesController.edit)
    this.router.delete("/:action/:id", this.locationTreesController.active)
  }
}
