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
    this.router.get("/register", this.userController.getRegisterPage);
    this.router.post("/register", this.userController.signup);
  }
}
