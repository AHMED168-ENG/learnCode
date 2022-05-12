import {Router} from "express"
import {InitiativeController} from "../../controllers/dashboard2/initiative.controller"

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
    this.router.get("/new", this.initiativeController.newPage)
    this.router.post("/new", this.initiativeController.addNew)
    this.router.get("/edit/:id", this.initiativeController.editPage)
    this.router.post("/edit/:id", this.initiativeController.edit)
    this.router.get("/view/:id", this.initiativeController.viewPage)
    this.router.delete("/:action/:id", this.initiativeController.active)
  }
}
