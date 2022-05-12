import {Router} from "express"
import {FAQController} from "../../controllers/dashboard2/faq.controller"

export class FaqRoutes {
  router: Router
  public faqController: FAQController = new FAQController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.faqController.listPage)
    this.router.get("/list", this.faqController.list)
    this.router.get("/new", this.faqController.newPage)
    this.router.post("/new", this.faqController.addNew)
    this.router.get("/edit/:id", this.faqController.editPage)
    this.router.post("/edit/:id", this.faqController.edit)
    this.router.get("/view/:id", this.faqController.viewPage)
  }
}
