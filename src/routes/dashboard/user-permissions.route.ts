import { Router } from "express";
import { UserPermissionsController } from "../../controllers/dashboard/user-permissions.controller";
export class UserPermissionsRoutes {
  public router: Router;
  public userPermissionsController: UserPermissionsController = new UserPermissionsController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  private routes() {
    this.router.get("/:role_id", this.userPermissionsController.listPermissions);
    this.router.put("/edit/:role_id/:page_id", this.userPermissionsController.editPermissions);
  }
}
