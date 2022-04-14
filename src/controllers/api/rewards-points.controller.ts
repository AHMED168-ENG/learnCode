import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import webAppsUsers from "../../models/user.model";
export class RewardsPointsController {
    public async getRewards(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const user = await webAppsUsers.findOne({ where: { user_id: req.user.user_id }, attributes: { include: ["sahlan_gained_points"] } });
            const gifts = [
                { image: "rewards/gift1.jpg", title: req["lang"] === "ar" ? "هدية شجرة لشخص ما" : "Gift a Tree to someone", points: "15" },
                { image: "rewards/gift2.jpg", title: req["lang"] === "ar" ? "هدية شجرة لمكتبك" : "Gift a tree to your office", points: "25" },
                { image: "rewards/gift3.jpg", title: req["lang"] === "ar" ? "تبرع بشجرة لمدرسة" : "Donate a tree for a school", points: "15" },
            ];
            const discounts = [
                { image: "rewards/discount1.jpg", title: req["lang"] === "ar" ? "خصم 30 ريال سعودي من اللولو هايبر ماركت" : "30 KSA off from Lulu hypermarket", points: "13" },
                { image: "rewards/discount2.jpg", title: req["lang"] === "ar" ? "خصم 30 ريال سعودي من مكنة كافيه" : "20 KSA off from Moknah coffee", points: "15" },
            ];
            const data = { points: user["sahlan_gained_points"], gifts, discounts };
            return res.status(httpStatus.OK).json(data);
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't get rewards for this user" });
        }
    }
}
