import {Router} from "express"
import {FaqController} from "../../controllers/api/faq.controller"

export class FaqRoutes {
  router: Router
  public faqController: FaqController = new FaqController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.faqController.list)
    this.router.post("/submitQuestion", this.faqController.submitQuestion)
  }
}
