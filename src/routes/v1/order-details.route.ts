import {Router} from "express"
import {OrderDetailsController} from "../../controllers/api/order-details.controller"

export class OrderDetailsRoutes {
  router: Router
  public orderDetailsController: OrderDetailsController = new OrderDetailsController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    // this.router.get("/", this.orderDetailsController.list)
  }
}
