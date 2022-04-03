import {Router} from "express"
import {CartController} from "../../controllers/api/cart.controller"

export class CartRoutes {
  router: Router
  public cartController: CartController = new CartController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.post("/addOrupdate", this.cartController.addOrUpdate)
    this.router.delete("/remove/:treeId", this.cartController.remove)
    this.router.get("/list", this.cartController.list)
    this.router.get("/count", this.cartController.count)
  }
}
