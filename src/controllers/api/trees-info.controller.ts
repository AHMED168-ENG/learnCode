import { Request, Response, NextFunction } from "express";
import Controller from "./main.controller";
import httpStatus from "http-status";
import treeHeader from "../../models/trees_headers.model";
import treesBody from "../../models/trees_body.model";
export class TreesInfoController extends Controller {
    public async getInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const treesInfoController = new TreesInfoController();
            const treeId = Number(req.params.id);
            if (!treeId) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
            const treeHeaders = await treesInfoController.getInfoData(treeId, req["lang"]);
            return res.status(httpStatus.OK).json({ tree_id: treeId, headers: treeHeaders });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't get trees info" });
        }
    }
    public async getInfoData(id: number, language: string) {
        try {
            const headers = await treeHeader.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
            const bodies = await treesBody.findAll({ where: { tree_id: id }, attributes: { exclude: ["createdAt", "updatedAt"] } });
            const headersData = [];
            for (const header of headers) {
                const bodiesData = [];
                const filteredBodies = bodies.length ? bodies.filter((body) => body["header_id"] === header["id"]) : [];
                for (const body of filteredBodies) {
                    const mappedBody = {
                        id: body["id"],
                        title: language === "ar" ? body["ar_title"] : body["en_title"],
                        value: language === "ar" ? body["ar_value"] : body["en_value"],
                        icon: body["icon"],
                    };
                    bodiesData.push(mappedBody);
                }
                headersData.push({
                    id: header["id"],
                    name: language === "ar" ? header["ar_name"] : header["en_name"],
                    body: bodiesData,
                });
            }
            return headersData;
        } catch (error) {
            return { error, message: "Can't get tree info" };
        }
    }
}
