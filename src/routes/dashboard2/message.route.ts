import {Router} from "express"
import {MessageController} from "../../controllers/dashboard2/message.controller"
import {OrderController} from "../../controllers/dashboard2/order.controller"

export class MessageRoutes {
  router: Router
  public messageController: MessageController = new MessageController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/:type/list", this.messageController.list)
    this.router.get("/:type", this.messageController.listPage)
    this.router.put("/status/:id", this.messageController.changeStatus)
    this.router.get("/view/:id", this.messageController.view)
  }
}
