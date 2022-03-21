import {Router} from "express"
import {RegionController} from "../../controllers/dashboard/region.controller"

export class RegionRoutes {
  router: Router
  public regionController: RegionController = new RegionController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.regionController.listPage)
    this.router.get("/list", this.regionController.list)
    this.router.get("/new", this.regionController.newPage)
    this.router.post("/new", this.regionController.addNew)
    this.router.get("/edit/:id", this.regionController.editPage)
    this.router.post("/edit/:id", this.regionController.edit)
  }
}
