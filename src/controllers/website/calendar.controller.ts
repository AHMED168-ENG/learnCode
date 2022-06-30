import { NextFunction, Request, Response } from "express";
import { EventController } from "./event.controller";
import { TripsController } from "./trip.controller";
const { verify } = require("../../helper/token");
export class CalendarController {
    constructor() {}
    public async getCalendar(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const data = await new CalendarController().getCalendarData();
            return res.render("website/views/calendar.ejs", { title: "View User Calendar", data });
        } catch (error) {
            return res.status(500).json({ msg: "Can't get user Calendar", err: error });
        }
    }
    public async getCalendarData() {
        try {
            const events = await new EventController().getAllEvents();
            const trips = await new TripsController().getAllTrips();
            const mappedEvents = events.map((event) => { return { id: event["id"], ar_name: event["ar_name"], en_name: event["en_name"], from: event["from"], type: "event", color: "#8000ff" }; });
            const mappedTrips = trips.map((trip) => { return { id: trip["id"], ar_name: trip["ar_name"], en_name: trip["en_name"], from: trip["from"], type: "trip", color: "#39DB63" }; });
            const data = mappedEvents.concat(mappedTrips);
            return data;
        } catch (error) {
            throw error;
        }
    }
}