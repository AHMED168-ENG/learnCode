import {Router} from "express"
import {PartnerController} from "../../controllers/dashboard/partner.controller"

export class PartnerRoutes {
  router: Router
  public partnerController: PartnerController = new PartnerController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/partner-page", this.partnerController.listPage)
    this.router.get("/partner-page/list", this.partnerController.list)
    this.router.get("/new", this.partnerController.newPage)
    this.router.post("/new", this.partnerController.addNew)
    this.router.get("/edit/:id", this.partnerController.editPage)
    this.router.post("/edit/:id", this.partnerController.edit)
  }
}
