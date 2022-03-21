import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import {InitiativeController} from "./initiative.controller"

export class ReportController {
  orderReportPage(req: Request, res: Response, next: NextFunction) {
    res.render("reports/order-report.ejs", {
      title: "Orders report",
    })
  }
  async calendarInitiative(req: Request, res: Response, next: NextFunction) {
    const initiativeDate = await new InitiativeController().listDateFromTo()
    res.render("reports/calendar-nitiative.ejs", {
      title: "Calendar Initiative",
      data: initiativeDate,
    })
  }
}
