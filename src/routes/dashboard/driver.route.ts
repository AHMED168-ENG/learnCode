import { Router } from "express";
import { DriverController } from "../../controllers/dashboard/driver.controller";
export class DriverRoutes {
  public router: Router;
  public driverController: DriverController = new DriverController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.driverController.listPage);
    this.router.get("/list", this.driverController.list);
    this.router.get("/view/:id", this.driverController.viewPage);
    this.router.get("/new", this.driverController.newPage);
    this.router.post("/new", this.driverController.addNew);
    this.router.get("/edit/:id", this.driverController.editPage);
    this.router.put("/edit/:id", this.driverController.edit);
  }
}
