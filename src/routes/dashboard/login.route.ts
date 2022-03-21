import {Router} from "express"
import { LoginController } from "../../controllers/dashboard/login.controller"

export class LoginRoutes {
  router: Router
  public loginController: LoginController = new LoginController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/login", this.loginController.loginPage)
    this.router.post("/login", this.loginController.login)
  }
}
