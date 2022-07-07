import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Op } from "sequelize";
import guideFollow from "../../models/guide-follow.model";
import webAppsUsers from "../../models/user.model";
const { verify } = require("../../helper/token");
export class GuideFollowController {
  constructor() {}
  public async getFollowers(user_id?: number, guide_id?: number, fromTo?: any): Promise<any> {
    try {
      const conditions = [];
      if (!!guide_id) conditions.push({ guide_id });
      if (!!user_id) conditions.push({ user_id });
      if (!!fromTo) conditions.push([{ createdAt: { [Op.gte]: fromTo.from } }, { createdAt: { [Op.lte]: fromTo.to } }]);
      return await guideFollow.findAll({
        where: { [Op.and]: conditions },
        attributes: { exclude: ["updatedAt"] },
        include: [{ model: webAppsUsers, attributes: ["fullName", "email", "phone"] }],
        raw: true,
      }) || [];
    } catch (error) {
      throw error;
    }
  }
  public async getFollow(user_id?: number, guide_id?: number) {
    try {
      return await guideFollow.findOne({ where: { [Op.and]: [{ user_id }, { guide_id }] }, attributes: ["id"], raw: true });
    } catch (error) {
      throw error;
    }
  }
  public async updateFollow(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.body || !req.body.guide_id || !req.body.checked) return res.status(httpStatus.BAD_REQUEST).json("Bad Request");
      const payload = verify(req.cookies.token);
      const request = { guide_id: req.body.guide_id, user_id: payload.user_id };
      if (req.body.checked == "true") await guideFollow.create(request);
      else await guideFollow.destroy({ where: { [Op.and]: [{ guide_id: request.guide_id }, { user_id: request.user_id }] }});
      return res.status(httpStatus.OK).json({ msg: "Favourite of this item is updated successfully" });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Can't add or remove to/from favourite", err: error });
    }
  }
}
