import { Router } from "express";
import { UsersController } from "../../controllers/website/user.controller";
export class UserRoutes {
  public router: Router;
  public userController: UsersController = new UsersController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/login", this.userController.loginPage);
    this.router.get("/register", this.userController.getRegisterPage);
    this.router.post("/login", this.userController.login);
    this.router.post("/register", this.userController.signup);
  }
}
