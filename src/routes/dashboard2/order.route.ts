import {Router} from "express"
import {OrderController} from "../../controllers/dashboard2/order.controller"

export class OrderRoutes {
  router: Router
  public orderController: OrderController = new OrderController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/new", this.orderController.listPageNew)
    this.router.get("/inprogress", this.orderController.listPageInprogress)
    this.router.get("/cancelled", this.orderController.listPageCancelled)
    this.router.get("/completed", this.orderController.listPageCompleted)
    this.router.get("/:type/list", this.orderController.list)
    this.router.get("/:type/listreport", this.orderController.listreport)
    this.router.put("/status/:id", this.orderController.changeStatus)
    this.router.get("/view/:id", this.orderController.view)
  }
}
