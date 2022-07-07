import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import guideMessage from "../../models/guide-message.model";
import { UserController } from "../dashboard/user.controller";
const { verify } = require("../../helper/token");
export class GuideMessageController {
  constructor() {}
  public async addGuideMessage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body || !req.params.guide_id || !req.body.message) return res.status(400).json({ msg: "Bad Request" });
      const payload = verify(req.cookies.token);
      const user = await new UserController().getUserByEmail(payload.email);
      if (!!user) await guideMessage.create({ guide_id: Number(req.params.guide_id), user_id: payload.user_id, rating: req.body.rating });
      return res.status(200).json({ msg: "Rating is created for this tour guide successfully" });
    } catch (error) {
      throw error;
    }
  }
  private async getGuideMessage(user_id: number, guide_id: number) {
    try {
      return await guideMessage.findOne({ where: { [Op.and]: [{ user_id }, { guide_id }] }, attributes: ["message"], raw: true });
    } catch (error) {
      throw error;
    }
  }
}
