import { Request, Response, NextFunction } from "express";
import Controller from "./main.controller";
import httpStatus from "http-status";
export class TreesInfoController extends Controller {
    public async getInfo(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id || !Number(req.params.id)) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
            const data = [
                {
                    trees_id: req.params.id,
                    headers: [
                        {
                            id: 1,
                            ar_name: "معلومات عن الشجرة",
                            en_name: "Tree Information",
                            body: [
                                { id: 1, ar_title: "الرقم", en_title: "Number", ar_value: "145", en_value: "145", icon: "trees/info/2/star.png" },
                                { id: 2, ar_title: "الاسم المشترك", en_title: "Common Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 3, ar_title: "الاسم المعطي", en_title: "Given Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 4, ar_title: "الاسم العلمي", en_title: "Scientific Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                            ],
                        },
                        {
                            id: 2,
                            ar_name: "معلومات عامة",
                            en_name: "General information",
                            body: [
                                { id: 1, ar_title: "الرقم", en_title: "Number", ar_value: "145", en_value: "145", icon: "trees/info/2/star.png" },
                                { id: 2, ar_title: "الاسم المشترك", en_title: "Common Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 3, ar_title: "الاسم المعطي", en_title: "Given Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 4, ar_title: "الاسم العلمي", en_title: "Scientific Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                            ],
                        },
                        {
                            id: 3,
                            ar_name: "أحوال البيئة",
                            en_name: "Environmental Condition",
                            body: [
                                { id: 1, ar_title: "الرقم", en_title: "Number", ar_value: "145", en_value: "145", icon: "trees/info/2/star.png" },
                                { id: 2, ar_title: "الاسم المشترك", en_title: "Common Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 3, ar_title: "الاسم المعطي", en_title: "Given Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 4, ar_title: "الاسم العلمي", en_title: "Scientific Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                            ],
                        },
                        {
                            id: 4,
                            ar_name: "شكل الزرع",
                            en_name: "Plant Shape",
                            body: [
                                { id: 1, ar_title: "الرقم", en_title: "Number", ar_value: "145", en_value: "145", icon: "trees/info/2/star.png" },
                                { id: 2, ar_title: "الاسم المشترك", en_title: "Common Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 3, ar_title: "الاسم المعطي", en_title: "Given Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 4, ar_title: "الاسم العلمي", en_title: "Scientific Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                            ],
                        },
                        {
                            id: 5,
                            ar_name: "الموقع للاستخدام",
                            en_name: "Location of Use",
                            body: [
                                { id: 1, ar_title: "الرقم", en_title: "Number", ar_value: "145", en_value: "145", icon: "trees/info/2/star.png" },
                                { id: 2, ar_title: "الاسم المشترك", en_title: "Common Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 3, ar_title: "الاسم المعطي", en_title: "Given Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 4, ar_title: "الاسم العلمي", en_title: "Scientific Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                            ],
                        },
                        {
                            id: 6,
                            ar_name: "وكالة الشجرة",
                            en_name: "Tree Stewardship",
                            body: [
                                { id: 1, ar_title: "الرقم", en_title: "Number", ar_value: "145", en_value: "145", icon: "trees/info/2/star.png" },
                                { id: 2, ar_title: "الاسم المشترك", en_title: "Common Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 3, ar_title: "الاسم المعطي", en_title: "Given Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 4, ar_title: "الاسم العلمي", en_title: "Scientific Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                            ],
                        },
                        {
                            id: 7,
                            ar_name: "",
                            en_name: "Planting site info",
                            body: [
                                { id: 1, ar_title: "الرقم", en_title: "Number", ar_value: "145", en_value: "145", icon: "trees/info/2/star.png" },
                                { id: 2, ar_title: "الاسم المشترك", en_title: "Common Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 3, ar_title: "الاسم المعطي", en_title: "Given Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 4, ar_title: "الاسم العلمي", en_title: "Scientific Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                            ],
                        },
                        {
                            id: 8,
                            ar_name: "",
                            en_name: "Yearly Ecosystem Services",
                            body: [
                                { id: 1, ar_title: "الرقم", en_title: "Number", ar_value: "145", en_value: "145", icon: "trees/info/2/star.png" },
                                { id: 2, ar_title: "الاسم المشترك", en_title: "Common Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 3, ar_title: "الاسم المعطي", en_title: "Given Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 4, ar_title: "الاسم العلمي", en_title: "Scientific Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                            ],
                        },
                        {
                            id: 9,
                            ar_name: "",
                            en_name: "Comments",
                            body: [
                                { id: 1, ar_title: "الرقم", en_title: "Number", ar_value: "145", en_value: "145", icon: "trees/info/2/star.png" },
                                { id: 2, ar_title: "الاسم المشترك", en_title: "Common Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 3, ar_title: "الاسم المعطي", en_title: "Given Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                                { id: 4, ar_title: "الاسم العلمي", en_title: "Scientific Name", ar_value: "اسم", en_value: "Name", icon: "trees/info/2/star.png" },
                            ],
                        },
                    ],
                },
            ];
            return res.status(httpStatus.OK).json(data);
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't get trees info" });
        }
    }
}
