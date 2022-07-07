import {Router} from "express"
import {ReportController} from "../../controllers/dashboard/report.controller"

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
    this.router.get("/calendar", this.reportController.getAllUsersCalendar)
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
    this.router.get("/destination-repo", this.reportController.getFavouriteDestinations)
    this.router.get("/destination-list", this.reportController.getFavouriteDestinationsList)
    this.router.get("/activity-repo", this.reportController.getActivityReport)
    this.router.get("/activity-repo/list", this.reportController.getTopActivitiesList)
    this.router.get("/destination-user-repo", this.reportController.getRegisteredUserWithDestinationsReport)
    this.router.get("/destination-user-repo/list", this.reportController.getRegisteredUsersWithDestinationsList)
    this.router.get("/destination-count-repo/:id", this.reportController.getAllRelatedToDestination)
    this.router.get("/destination-count-repo/:id/list", this.reportController.getAllRelatedToDestinationList)
    this.router.get("/event-repo", this.reportController.getFavouriteEvents)
    this.router.get("/event-list", this.reportController.getFavouriteEventList)
    this.router.get("/guide-repo", this.reportController.getGuidesRatings)
    this.router.get("/guide-list", this.reportController.getGuideRatingList)
  }
}
