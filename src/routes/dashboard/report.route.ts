import {Router} from "express"
import { ReportController } from "../../controllers/dashboard/report.controller"

export class ReportRoutes {
  router: Router
  public reportController: ReportController = new ReportController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/order", this.reportController.orderReportPage)
    this.router.get("/calendar-initiative", this.reportController.calendarInitiative)
  }
}
