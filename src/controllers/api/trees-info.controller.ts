import { Request, Response, NextFunction } from "express";
import Controller from "./main.controller";
import httpStatus from "http-status";
export class TreesInfoController extends Controller {
    public async getInfo(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id || !Number(req.params.id) || !req["lang"]) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
            const data = [
                {
                    trees_id: req.params.id,
                    headers: [
                        {
                            id: 1,
                            name: req["lang"] === "ar" ? "معلومات عن الشجرة" : req["lang"] === "en" ? "Tree Information" : null,
                            body: [
                                {
                                    id: 1,
                                    title: req["lang"] === "ar" ? "الرقم" : req["lang"] === "en" ? "Number" : null,
                                    value: req["lang"] === "ar" ? "145" : req["lang"] === "en" ? "145": null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 2,
                                    title: req["lang"] === "ar" ? "الاسم المشترك" : req["lang"] === "en" ?  "Common Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 3,
                                    title: req["lang"] === "ar" ?  "الاسم المعطي" : req["lang"] === "en" ?  "Given Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                                {
                                    id: 4,
                                    title: req["lang"] === "ar" ? "الاسم العلمي" : req["lang"] === "en" ? "Scientific Name" : null,
                                    value: req["lang"] === "ar" ? "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                            ],
                        },
                        {
                            id: 2,
                            name: req["lang"] === "ar" ? "معلومات عامة" : req["lang"] === "en" ? "General information" : null,
                            body: [
                                {
                                    id: 1,
                                    title: req["lang"] === "ar" ? "الرقم" : req["lang"] === "en" ? "Number" : null,
                                    value: req["lang"] === "ar" ? "145" : req["lang"] === "en" ? "145": null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 2,
                                    title: req["lang"] === "ar" ? "الاسم المشترك" : req["lang"] === "en" ?  "Common Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 3,
                                    title: req["lang"] === "ar" ?  "الاسم المعطي" : req["lang"] === "en" ?  "Given Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                                {
                                    id: 4,
                                    title: req["lang"] === "ar" ? "الاسم العلمي" : req["lang"] === "en" ? "Scientific Name" : null,
                                    value: req["lang"] === "ar" ? "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                            ],
                        },
                        {
                            id: 3,
                            name: req["lang"] === "ar" ? "أحوال البيئة" : req["lang"] === "en" ? "Environmental Condition" : null,
                            body: [
                                {
                                    id: 1,
                                    title: req["lang"] === "ar" ? "الرقم" : req["lang"] === "en" ? "Number" : null,
                                    value: req["lang"] === "ar" ? "145" : req["lang"] === "en" ? "145": null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 2,
                                    title: req["lang"] === "ar" ? "الاسم المشترك" : req["lang"] === "en" ?  "Common Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 3,
                                    title: req["lang"] === "ar" ?  "الاسم المعطي" : req["lang"] === "en" ?  "Given Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                                {
                                    id: 4,
                                    title: req["lang"] === "ar" ? "الاسم العلمي" : req["lang"] === "en" ? "Scientific Name" : null,
                                    value: req["lang"] === "ar" ? "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                            ],
                        },
                        {
                            id: 4,
                            name: req["lang"] === "ar" ? "شكل الزرع" : req["lang"] === "en" ? "Plant Shape" : null,
                            body: [
                                {
                                    id: 1,
                                    title: req["lang"] === "ar" ? "الرقم" : req["lang"] === "en" ? "Number" : null,
                                    value: req["lang"] === "ar" ? "145" : req["lang"] === "en" ? "145": null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 2,
                                    title: req["lang"] === "ar" ? "الاسم المشترك" : req["lang"] === "en" ?  "Common Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 3,
                                    title: req["lang"] === "ar" ?  "الاسم المعطي" : req["lang"] === "en" ?  "Given Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                                {
                                    id: 4,
                                    title: req["lang"] === "ar" ? "الاسم العلمي" : req["lang"] === "en" ? "Scientific Name" : null,
                                    value: req["lang"] === "ar" ? "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                            ],
                        },
                        {
                            id: 5,
                            name: req["lang"] === "ar" ? "الموقع للاستخدام" : req["lang"] === "en" ? "Location of Use" : null,
                            body: [
                                {
                                    id: 1,
                                    title: req["lang"] === "ar" ? "الرقم" : req["lang"] === "en" ? "Number" : null,
                                    value: req["lang"] === "ar" ? "145" : req["lang"] === "en" ? "145": null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 2,
                                    title: req["lang"] === "ar" ? "الاسم المشترك" : req["lang"] === "en" ?  "Common Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 3,
                                    title: req["lang"] === "ar" ?  "الاسم المعطي" : req["lang"] === "en" ?  "Given Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                                {
                                    id: 4,
                                    title: req["lang"] === "ar" ? "الاسم العلمي" : req["lang"] === "en" ? "Scientific Name" : null,
                                    value: req["lang"] === "ar" ? "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                            ],
                        },
                        {
                            id: 6,
                            name: req["lang"] === "ar" ? "وكالة الشجرة" : req["lang"] === "en" ? "Tree Stewardship" : null,
                            body: [
                                {
                                    id: 1,
                                    title: req["lang"] === "ar" ? "الرقم" : req["lang"] === "en" ? "Number" : null,
                                    value: req["lang"] === "ar" ? "145" : req["lang"] === "en" ? "145": null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 2,
                                    title: req["lang"] === "ar" ? "الاسم المشترك" : req["lang"] === "en" ?  "Common Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 3,
                                    title: req["lang"] === "ar" ?  "الاسم المعطي" : req["lang"] === "en" ?  "Given Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                                {
                                    id: 4,
                                    title: req["lang"] === "ar" ? "الاسم العلمي" : req["lang"] === "en" ? "Scientific Name" : null,
                                    value: req["lang"] === "ar" ? "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                            ],
                        },
                        {
                            id: 7,
                            name: req["lang"] === "ar" ? "معلومات موقع الزراعة" : req["lang"] === "en" ? "Planting site info": null,
                            body: [
                                {
                                    id: 1,
                                    title: req["lang"] === "ar" ? "الرقم" : req["lang"] === "en" ? "Number" : null,
                                    value: req["lang"] === "ar" ? "145" : req["lang"] === "en" ? "145": null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 2,
                                    title: req["lang"] === "ar" ? "الاسم المشترك" : req["lang"] === "en" ?  "Common Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 3,
                                    title: req["lang"] === "ar" ?  "الاسم المعطي" : req["lang"] === "en" ?  "Given Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                                {
                                    id: 4,
                                    title: req["lang"] === "ar" ? "الاسم العلمي" : req["lang"] === "en" ? "Scientific Name" : null,
                                    value: req["lang"] === "ar" ? "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                            ],
                        },
                        {
                            id: 8,
                            name: req["lang"] === "ar" ? "خدمات النظام البيئي السنوية" : req["lang"] === "en" ? "Yearly Ecosystem Services" : null,
                            body: [
                                {
                                    id: 1,
                                    title: req["lang"] === "ar" ? "الرقم" : req["lang"] === "en" ? "Number" : null,
                                    value: req["lang"] === "ar" ? "145" : req["lang"] === "en" ? "145": null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 2,
                                    title: req["lang"] === "ar" ? "الاسم المشترك" : req["lang"] === "en" ?  "Common Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 3,
                                    title: req["lang"] === "ar" ?  "الاسم المعطي" : req["lang"] === "en" ?  "Given Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                                {
                                    id: 4,
                                    title: req["lang"] === "ar" ? "الاسم العلمي" : req["lang"] === "en" ? "Scientific Name" : null,
                                    value: req["lang"] === "ar" ? "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                            ],
                        },
                        {
                            id: 9,
                            name: req["lang"] === "ar" ? "التعليقات" : req["lang"] === "en" ?  "Comments" : null,
                            body: [
                                {
                                    id: 1,
                                    title: req["lang"] === "ar" ? "الرقم" : req["lang"] === "en" ? "Number" : null,
                                    value: req["lang"] === "ar" ? "145" : req["lang"] === "en" ? "145": null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 2,
                                    title: req["lang"] === "ar" ? "الاسم المشترك" : req["lang"] === "en" ?  "Common Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/1/star.png",
                                },
                                {
                                    id: 3,
                                    title: req["lang"] === "ar" ?  "الاسم المعطي" : req["lang"] === "en" ?  "Given Name" : null,
                                    value: req["lang"] === "ar" ?  "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
                                {
                                    id: 4,
                                    title: req["lang"] === "ar" ? "الاسم العلمي" : req["lang"] === "en" ? "Scientific Name" : null,
                                    value: req["lang"] === "ar" ? "اسم" : req["lang"] === "en" ?  "Name" : null,
                                    icon: "trees/info/2/star.png",
                                },
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
