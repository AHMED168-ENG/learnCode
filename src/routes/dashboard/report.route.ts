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
    this.router.get("/charts", this.reportController.chartsPage)
    this.router.get("/user", this.reportController.userReportPage)
    this.router.get("/:type/userlistreport", this.reportController.userlistReport)
    this.router.get("/sponsor", this.reportController.sponsorReportPage)
    this.router.get("/:type/sponsorlistreport", this.reportController.sponsorlistReport)
    this.router.get("/initiative", this.reportController.initiativeReportPage)
    this.router.get("/:type/initiativelistreport", this.reportController.initiativelistReport)
  }
}
