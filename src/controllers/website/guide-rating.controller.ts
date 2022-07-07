import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import guideRating from "../../models/guide-rating.model";
import guide from "../../models/guide.model";
import { UserController } from "../dashboard/user.controller";
const { verify } = require("../../helper/token");
export class GuideRatingController {
  constructor() {}
  public async getGuidesRatings() {
    try {
      const guidesRatings = await guideRating.findAll({ attributes: ["rating"], include: [{ model: guide, attributes: ["id", "name"] }], raw: true });
      const mappedGuides = guidesRatings?.map((item) => { return { id: item["tbl_guide.id"], name: item["tbl_guide.name"] }; });
      const guides = mappedGuides.filter((v, i, a)=> a.findIndex(v2 => (v2.id === v.id)) === i);
      const response = [];
      for (const guideData of guides) {
        const filteredGuideRatings = guidesRatings.filter((g) => g["tbl_guide.id"] === guideData.id)?.map((gr) => { return gr["rating"]; });
        let sum = 0;
        for (const fgr of filteredGuideRatings) sum += fgr;
        const averageRating = sum / filteredGuideRatings.length;
        response.push({ id: guideData.id, name: guideData.name, rating: averageRating });
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
  public async getGuideRating(user_id: number, guide_id: number) {
    try {
      return await guideRating.findOne({ where: { [Op.and]: [{ user_id }, { guide_id }] }, attributes: ["rating"], raw: true });
    } catch (error) {
      throw error;
    }
  }
  public async addEditGuideRating(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body || !req.params.guide_id || !req.body.rating) return res.status(400).json({ msg: "Bad Request" });
      const payload = verify(req.cookies.token);
      const user = await new UserController().getUserByEmail(payload.email);
      if (!!user) {
        const foundGuideRating = await new GuideRatingController().getGuideRating(payload.user_id, Number(req.params.guide_id));
        if (!foundGuideRating) await guideRating.create({ guide_id: Number(req.params.guide_id), user_id: payload.user_id, rating: req.body.rating });
        else await guideRating.update(req.body, { where: { [Op.and]: [{ user_id: payload.user_id }, { guide_id: Number(req.params.guide_id) }] } });
      }
      return res.status(200).json({ msg: "Rating is created for this tour guide successfully" });
    } catch (error) {
      throw error;
    }
  }
}
