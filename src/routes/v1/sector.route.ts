import {Router} from "express"
import {SectorController} from "../../controllers/api/sector.controller"

export class SectorRoutes {
  router: Router
  public sectorController: SectorController = new SectorController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.sectorController.list)
  }
}
