import {Router} from "express"
import { TermsPolicyController } from "../../controllers/dashboard2/terms.controller"

export class TermsPolicyRoutes {
  router: Router
  public termsPolicyController: TermsPolicyController = new TermsPolicyController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/:type", this.termsPolicyController.viewPage)
    this.router.get("/:type/edit", this.termsPolicyController.editPage)
    this.router.post("/:type/edit", this.termsPolicyController.edit)
  }
}
