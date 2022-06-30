import { Op } from "sequelize";
import guideTrip from "../../models/guide-trip.model";
import guide from "../../models/guide.model";
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
