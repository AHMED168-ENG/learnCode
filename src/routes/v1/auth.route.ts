import {Router} from "express"
import {UserController} from "../../controllers/api/users.controller"

export class AuthRoutes {
  router: Router
  public userController: UserController = new UserController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.post("/login", this.userController.login)
    this.router.post("/google", this.userController.googleLogin)
    this.router.post("/facebook", this.userController.facebookLogin)
    this.router.post("/apple", this.userController.login)
    this.router.post("/signup", this.userController.signup)
    this.router.post("/sendOtp", this.userController.sendOtp)
    this.router.post("/verifyOtp", this.userController.verifyOtp)
    this.router.post("/info", this.userController.updateInfo)
    this.router.post("/find", this.userController.emailORphoneExisted)
    this.router.post("/resetPassword", this.userController.resetPassword)
    this.router.post("/changePassword", this.userController.changePassword)
  }
}
