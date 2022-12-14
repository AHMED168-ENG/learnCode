import { Router } from "express";
import { TicketController } from "../../controllers/website/ticket.controller";
export class TicketRoutes {
  public router: Router;
  public ticketController: TicketController = new TicketController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.ticketController.listPage);
    this.router.get("/list", this.ticketController.list);
    this.router.get("/view/:id", this.ticketController.viewPage);
    this.router.put("/edit/:id", this.ticketController.edit);
  }
}
