import {Router} from "express"
import {PartnerController} from "../../controllers/api/partner.controller"

export class PartnerRoutes {
  router: Router
  public partnerController: PartnerController = new PartnerController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.partnerController.list)
  }
}
