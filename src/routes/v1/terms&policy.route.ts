import {Router} from "express"
import {TermsPolicyController} from "../../controllers/api/terms.controller"

export class TermsPolicyRoutes {
  router: Router
  public termsPolicyController: TermsPolicyController = new TermsPolicyController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/:type", this.termsPolicyController.view)
  }
}
