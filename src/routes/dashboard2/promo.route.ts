import {Router} from "express"
import { PromoController } from "../../controllers/dashboard2/promo.controller"

export class PromoRoutes {
  router: Router
  public promoController: PromoController = new PromoController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.promoController.listPage)
    this.router.get("/list", this.promoController.list)
    this.router.get("/new", this.promoController.newPage)
    this.router.post("/new", this.promoController.addNew)
    this.router.get("/edit/:id", this.promoController.editPage)
    this.router.post("/edit/:id", this.promoController.edit)
    this.router.delete("/:action/:id", this.promoController.active)
  }
}
