import {Router} from "express"
import {HomeController} from "../../controllers/website/home.controller"

export class HomeRoutes {
  router: Router
  public homeController: HomeController = new HomeController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.homeController.home)
    this.router.get("/num", this.homeController.getNavNumbers)
  }
}
