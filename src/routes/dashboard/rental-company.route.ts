import { Router } from "express";
import { RentalCompanyController } from "../../controllers/dashboard/rental-company.controller";
export class RentalCompanyRoutes {
  public router: Router;
  public rentalCompanyController: RentalCompanyController = new RentalCompanyController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.rentalCompanyController.listPage);
    this.router.get("/list", this.rentalCompanyController.list);
    this.router.get("/view/:id", this.rentalCompanyController.viewPage);
    this.router.get("/new", this.rentalCompanyController.newPage);
    this.router.post("/new", this.rentalCompanyController.addNew);
    this.router.get("/edit/:id", this.rentalCompanyController.editPage);
    this.router.put("/edit/:id", this.rentalCompanyController.edit);
  }
}
