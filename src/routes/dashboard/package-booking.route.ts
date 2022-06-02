import { Router } from "express";
import { PackageBookingController } from "../../controllers/dashboard/package-booking.controller";
export class PackageBookingRoutes {
  public router: Router;
  public packageBookingController: PackageBookingController = new PackageBookingController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/:package_id/", this.packageBookingController.listPage);
    this.router.get("/:package_id/list", this.packageBookingController.list);
    this.router.get("/:package_id/view/:id", this.packageBookingController.viewPage);
    this.router.put("/:package_id/edit/:id", this.packageBookingController.edit);
  }
}
