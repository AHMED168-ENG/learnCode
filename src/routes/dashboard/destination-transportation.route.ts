import { Router } from "express";
import { DestinationTransportationController } from "../../controllers/dashboard/destination-transportation.controller";
export class DestinationTransportationRoutes {
  public router: Router;
  public destinationTransportationController: DestinationTransportationController = new DestinationTransportationController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/:destination_id/", this.destinationTransportationController.listPage);
    this.router.get("/:destination_id/list", this.destinationTransportationController.list);
    this.router.get("/:destination_id/new", this.destinationTransportationController.newPage);
    this.router.post("/:destination_id/new", this.destinationTransportationController.addNew);
    this.router.get("/:destination_id/edit/:id", this.destinationTransportationController.editPage);
    this.router.put("/:destination_id/edit/:id", this.destinationTransportationController.edit);
  }
}
