import {Router} from "express"
import {OrderController} from "../../controllers/api/order.controller"

export class OrderRoutes {
  router: Router
  public orderController: OrderController = new OrderController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.post("/make", this.orderController.makeOrder)
    this.router.get("/certificate/:orderId", this.orderController.certificate)
  }
}
