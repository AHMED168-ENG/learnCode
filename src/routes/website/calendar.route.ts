import { Router } from "express";
import { CalendarController } from "../../controllers/website/calendar.controller";
export class CalendarRoutes {
  public router: Router;
  public calendarController: CalendarController = new CalendarController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get('/', this.calendarController.getCalendar);
  }
}
