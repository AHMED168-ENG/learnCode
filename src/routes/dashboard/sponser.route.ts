import {Router} from "express"
import {SponserController} from "../../controllers/dashboard/sponser.controller"

export class SponserRoutes {
  router: Router
  public sponserController: SponserController = new SponserController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.sponserController.listPage)
    this.router.get("/list", this.sponserController.list)
    this.router.get("/new", this.sponserController.newPage)
    this.router.post("/new", this.sponserController.addNew)
    this.router.get("/edit/:id", this.sponserController.editPage)
    this.router.post("/edit/:id", this.sponserController.edit)
  }
}
