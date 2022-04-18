import {Router} from "express"
import {UserController} from "../../controllers/dashboard/user.controller"

export class UserRoutes {
  router: Router
  public userController: UserController = new UserController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.userController.listPage)
    this.router.get("/list", this.userController.list)
    this.router.get("/edit/:id", this.userController.editPage)
    this.router.get("/logout", this.userController.logout)
  }
}
