import {Router} from "express"
import {PartnerTypeController} from "../../controllers/dashboard2/partner-type.controller"

export class PartnerTypeRoutes {
  router: Router
  public partnerTypeController: PartnerTypeController = new PartnerTypeController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.partnerTypeController.listPage)
    this.router.get("/list", this.partnerTypeController.list)
    this.router.get("/new", this.partnerTypeController.newPage)
    this.router.post("/new", this.partnerTypeController.addNew)
    this.router.get("/edit/:id", this.partnerTypeController.editPage)
    this.router.post("/edit/:id", this.partnerTypeController.edit)
  }
}
