import activity from "../../models/activity.model";
import activityCategory from "../../models/activity-category.model";
import tripActivity from "../../models/trip-activity.model";
import { Op } from "sequelize";
export class TripActivityController {
  constructor() {}
  public async list(lang: string, trip_id: number, from: string, to: string) {
    try {
      const where = trip_id ? { trip_id } : {};
      const tripsActivities = await tripActivity.findAll({
        where,
        attributes: { include: ["id", "activity_id", "day"] },
        include: [{ model: activity, attributes: ["ar_name", "en_name", "image"], include: [{ model: activityCategory, attributes: ["ar_name", "en_name"] }] }],
      }) || [];
      const mappedTripActivities = tripsActivities.map((ta) => { return { id: ta["id"], activity_id: ta["activity_id"], name: ta["tbl_activity"][`${lang}_name`], image: ta["tbl_activity"][`image`], category: ta["tbl_activity"]["tbl_activity_category"][`${lang}_name`], day: ta["day"] }; });
      const numOfDays = this.getDiff(from, to);
      const data = [];
      if (mappedTripActivities && mappedTripActivities.length) {
        for (let i = 0; i < numOfDays; i++) {
          const activitiesPerDay = mappedTripActivities.filter((mta) => this.getNewDate(from, i).getDate() === new Date(mta.day).getDate());
          data.push({ day: i, activities: activitiesPerDay });
        }
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async countTopActivities(from?: any, to?: any) {
    try {
      const tripsActivities = await tripActivity.findAll({ attributes: ["createdAt", "activity_id"], include: [{ model: activity, attributes: ["ar_name", "en_name"] }], raw: true }) || [];
      let filteredTripsActivities = tripsActivities;
      if (!!from && !!to) filteredTripsActivities = tripsActivities.filter((ta) => new Date(ta["createdAt"]) >= new Date(from) && new Date(ta["createdAt"]) <= new Date(to));
      const data = new TripActivityController().mapActivitiesWithTrips(filteredTripsActivities);
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async addTripActivities(trip_id: number, activitiesDays: any[], from: any) {
    try {
      const payload = [];
      for (const activitiesDay of activitiesDays) {
        for (const activity of activitiesDay.activities) {
          const day = this.getNewDate(from, Number(activitiesDay.day));
          payload.push({ trip_id, activity_id: activity, day });
        }
      }
      return await tripActivity.bulkCreate(payload);
    } catch (error) {
      throw error;
    }
  }
  public async removeTripActivity(ids: number[]) {
    try {
      return await tripActivity.destroy({ where: { id: { [Op.in]: ids } } });
    } catch (error) {
      throw error;
    }
  }
  private mapActivitiesWithTrips(tripsActivities: any[]) {
    try {
      const activities = tripsActivities.map((ta) => { return { id: ta["activity_id"], name: `${ta["tbl_activity.en_name"]} - ${ta["tbl_activity.ar_name"]}` }; });
      const response = [];
      const removedDuplicatedActivities = [...new Map(activities.map(item => [item["id"], item])).values()];
      for (const activity of removedDuplicatedActivities) {
        const tripsWithActivity = tripsActivities.filter((tripActivityData) => tripActivityData.activity_id === activity.id);
        response.push({ id: activity.id, name: activity.name, count: tripsWithActivity.length });
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
  private getNewDate(date: string, day: number): Date {
    return new Date(new Date(date).getTime() + day * 86400000);
  }
  private getDiff(from: string, to: string): number {
    return Math.ceil(Math.abs(new Date(to).getTime() - new Date(from).getTime()) / (1000 * 3600 * 24));
  }
}
