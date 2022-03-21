import {Router} from "express"
import {InitiativeController} from "../../controllers/dashboard/initiative.controller"

export class InitiativeRoutes {
  router: Router
  public initiativeController: InitiativeController = new InitiativeController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.initiativeController.listPage)
    this.router.get("/list", this.initiativeController.list)
    this.router.get("/view/:id", this.initiativeController.viewPage)
  }
}
