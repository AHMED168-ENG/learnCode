import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import { ICreateTreeBodyRequest } from "../../interfaces/ICreateTreeBodyRequest";
import treesBody from "../../models/trees_body.model";
export class TreesBodyController {
    constructor() {}
    private async getTreesBody(id: number) {
        try {
            return await treesBody.findOne({ where: { id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
        } catch (error) {
            return { error, msg: "Can't get trees body" };
        }
    }
    public newPage(req: Request, res: Response, next: NextFunction) {
        return res.render("trees-bodies/new.ejs", { title: "Add Trees Body" });
    }
    public async addTreesBody(req, res: Response, next: NextFunction) {
        try {
            const { ar_title, en_title, ar_value, en_value }: ICreateTreeBodyRequest = req.body;
            const { tree_id, header_id } = req.params;
            if (!Number(tree_id) || !Number(header_id) || !ar_title || !en_title) return res.status(400).json({ message: "Bad Request" });
            const imgFile = req.files ? req.files.icon : null;
            const request = { tree_id, header_id, ar_title, en_title, ar_value, en_value, icon: `` };
            const createdTreeBody = await treesBody.create({ ...request });
            if (imgFile) {
                if (!helpers.mimetypeImge.includes(imgFile["mimetype"])) return res.status(400).json({ msg: "Image should be png, jpg or jpeg" });
                const imgName: string = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgFile["name"])}`;
                const fileDir: string = `trees/body/${createdTreeBody["id"]}/`;
                await treesBody.update({ icon: `${fileDir}${imgName}` }, { where: { id: createdTreeBody["id"] } });
                helpers.imageProcessing(fileDir, imgName, imgFile["data"]);
            }
            return res.status(httpStatus.CREATED).json({ message: "A new Trees Body is created successfully" });
        } catch (error) {
            console.log(error)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: error, msg: "Can't add new trees body" });
        }
    }
    public async editPage(req: Request, res: Response, next: NextFunction) {
        try {
            const treesBodyController = new TreesBodyController();
            if (!req.params.id) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
            const data = await treesBodyController.getTreesBody(Number(req.params.id));
            return res.render("trees-bodies/edit.ejs", { title: "Edit Trees Body", data });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't open edit trees body page" });
        }
    }
    public async editTreesBody(req, res: Response, next: NextFunction) {
        try {
            if (!Number(req.params.id) || !req.body) return res.status(400).json({ message: "Bad Request" });
            await treesBody.update(req.body, { where: { id: req.params.id } });
            const imgFile = req.files ? req.files.icon : null;
            if (imgFile) {
                const icon = await treesBody.findOne({ where: { id: req.params.id }, attributes: ["icon"], raw: true });
                const imgName: string = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgFile["name"])}`;
                const fileDir: string = `trees/body/${req.params.id}/`;
                helpers.removeFile(icon["icon"]);
                await treesBody.update({ icon: `${fileDir}${imgName}` }, { where: { id: req.params.id }});
                helpers.imageProcessing(fileDir, imgName, imgFile["data"]);
            }
            return res.status(httpStatus.OK).json({ message: "Trees Body is updated successfully" });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: error, msg: "Can't edit trees body" });
        }
    }
    public async deleteTreesBody(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id || !Number(req.params.id)) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
            await treesBody.destroy({ where: { id: req.params.id } });
            return res.status(httpStatus.OK).json({ message: "Tree Body is deleted successfully" });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't delete trees body" });
        }
    }
} 