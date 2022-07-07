import { Op } from "sequelize";
import guideTrip from "../../models/guide-trip.model";
import guide from "../../models/guide.model";
import trip from "../../models/trip.model";
export class GuideTripController {
  constructor() {}
  public async getTourguidesWithTrip(trip_id: number) {
    try {
      const guidesTrips = await guideTrip.findAll({
        where: { trip_id },
        attributes: { exclude: ["guide_id", "createdAt", "updatedAt"] },
        include: [{ model: guide, attributes: ["id", "name", "image", "username"] }],
        raw: true,
      }) || [];
      const data = guidesTrips.map((gt) => { return { id: gt["tbl_guide.id"], name: gt["tbl_guide.name"], username: gt["tbl_guide.username"], image: gt["tbl_guide.image"] }; });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async getTripsWithGuide(guide_id: number) {
    try {
      const guidesTrips = await guideTrip.findAll({
        where: { guide_id },
        attributes: { exclude: ["guide_id", "trip_id", "createdAt", "updatedAt"] },
        include: [{ model: trip, attributes: ["id", "ar_name", "en_name", "image"] }],
        raw: true,
      }) || [];
      const data = guidesTrips.map((gt) => { return { id: gt["tbl_trip.id"], name: `${gt["tbl_trip.en_name"]} - ${gt["tbl_trip.ar_name"]}`, image: gt["tbl_trip.image"] }; });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async addTripGuides(trip_id: number, guides: any[]) {
    try {
      const payload = [];
      for (const guide of guides) payload.push({ trip_id, guide_id: guide });
      return await guideTrip.bulkCreate(payload);
    } catch (error) {
      throw error;
    }
  }
  public async removeTripGuide(ids: number[]) {
    try {
      return await guideTrip.destroy({ where: { id: { [Op.in]: ids } } });
    } catch (error) {
      throw error;
    }
  }
}
