import { Router } from "express";
import { MembershipController } from "../../controllers/website/membership.controller";
export class MembershipRoutes {
  public router: Router;
  public membershipController: MembershipController = new MembershipController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.membershipController.listPage);
    this.router.get("/list", this.membershipController.list);
    this.router.get("/view/:id", this.membershipController.viewPage);
  }
}
