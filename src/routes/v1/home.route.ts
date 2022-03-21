import {Router} from "express"
import { HomeController } from "../../controllers/api/home.controller"

export class HomeRoutes {
  router: Router
  public homeController: HomeController = new HomeController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.homeController.home)
  }
}
