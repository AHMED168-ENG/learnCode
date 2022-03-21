import {Router} from "express"
import {SectorController} from "../../controllers/dashboard/sector.controller"

export class SectorRoutes {
  router: Router
  public sectorController: SectorController = new SectorController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.sectorController.listPage)
    this.router.get("/list", this.sectorController.list)
    this.router.get("/new", this.sectorController.newPage)
    this.router.post("/new", this.sectorController.addNew)
    this.router.get("/edit/:id", this.sectorController.editPage)
    this.router.post("/edit/:id", this.sectorController.edit)
  }
}
