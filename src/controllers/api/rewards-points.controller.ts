import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import gift from "../../models/gift.model";
import webAppsUsers from "../../models/user.model";
export class RewardsPoints {
    public async getRewards(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const user = await webAppsUsers.findOne({ where: { user_id: req.user.user_id }, attributes: { include: ["sahlan_gained_points"] } });
            const gifts = await gift.findAll({ attributes: { include: ["gift_id", "message"] } });
            
            const data = { points: user["sahlan_gained_points"] };
            return res.status(httpStatus.OK).json(data);
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't get rewards for this user" });
        }
    }
}
