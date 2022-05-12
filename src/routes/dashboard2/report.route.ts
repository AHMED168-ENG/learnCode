import {Router} from "express"
import {ReportController} from "../../controllers/dashboard2/report.controller"

export class ReportRoutes {
  router: Router
  public reportController: ReportController = new ReportController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/order-repo", this.reportController.orderReportPage)
    this.router.get("/calendar-initiative", this.reportController.calendarInitiative)
    this.router.get("/charts", this.reportController.chartsPage)
    this.router.get("/user-repo", this.reportController.userReportPage)
    this.router.get("/:type/userlistreport", this.reportController.userlistReport)
    this.router.get("/sponsor-repo", this.reportController.sponsorReportPage)
    this.router.get("/:type/sponsorlistreport", this.reportController.sponsorlistReport)
    this.router.get("/initiative-repo", this.reportController.initiativeReportPage)
    this.router.get("/:type/initiativelistreport", this.reportController.initiativelistReport)
    this.router.get("/location-repo", this.reportController.locationReportPage)
    this.router.get("/:type/locationlistreport", this.reportController.locationlistreport)
    this.router.get("/sales", this.reportController.salesReportPage)
    this.router.get("/location-trees", this.reportController.treeReportPage)
    this.router.get("/treelistreport", this.reportController.treelistreport)
  }
}
