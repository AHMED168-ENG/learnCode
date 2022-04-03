import {Router} from "express"
import {MessageController} from "../../controllers/api/message.controller"

export class MessageRoutes {
  router: Router
  public messageController: MessageController = new MessageController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes()   {
    this.router.post("/send", this.messageController.send)
  }
}
