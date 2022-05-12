import { Router } from "express";
import { UserRolesController } from "../../controllers/dashboard2/user-roles.controller";
export class UserRolesRoutes {
  public router: Router;
  public userRolesController: UserRolesController = new UserRolesController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  private routes() {
    this.router.get("/", this.userRolesController.listPage)
    this.router.get("/list", this.userRolesController.list)
    this.router.get("/new", this.userRolesController.newPage)
    this.router.post("/new", this.userRolesController.addNew)
    this.router.get("/edit/:id", this.userRolesController.editPage)
    this.router.put("/edit/:id", this.userRolesController.edit)
  }
}
