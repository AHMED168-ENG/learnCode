import {Router} from "express"
import {PromoController} from "../../controllers/api/promo.controller"

export class PromoRoutes {
  router: Router
  public promoController: PromoController = new PromoController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/verify/:promoName", this.promoController.verify)
  }
}
