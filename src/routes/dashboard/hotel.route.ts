import { Router } from "express";
import { HotelController } from "../../controllers/dashboard/hotel.controller";
export class HotelRoutes {
  public router: Router;
  public hotelController: HotelController = new HotelController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.hotelController.listPage);
    this.router.get("/list", this.hotelController.list);
    this.router.get("/view/:id", this.hotelController.viewPage);
    this.router.get("/new", this.hotelController.newPage);
    this.router.post("/new", this.hotelController.addNew);
    this.router.get("/edit/:id", this.hotelController.editPage);
    this.router.put("/edit/:id", this.hotelController.edit);
  }
}
