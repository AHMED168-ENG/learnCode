import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import { ICreateTreeBodyRequest } from "../../interfaces/ICreateTreeBodyRequest";
import { IUpdateTreeBodyRequest } from "../../interfaces/IUpdateTreeBodyRequest";
import treesBody from "../../models/trees_body.model";
export class TreesBodyController {
    constructor() {}
    public listPage(req: Request, res: Response, next: NextFunction) {
        return res.render("tree-body/list.ejs", { title: "Trees Bodies" });
    }
    public async getTreesBodies(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await treesBody.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
            return res.status(httpStatus.OK).json(data);
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't get trees bodies" });
        }
    }
    public async getTreesBody(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id || !Number(req.params.id)) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
            const data = await treesBody.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
            return res.status(httpStatus.OK).json(data);
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't get trees body" });
        }
    }
    public newPage(req: Request, res: Response, next: NextFunction) {
        return res.render("tree-body/new.ejs", { title: "Add Trees Body" });
    }
    // public async addTreesBody(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { ar_title, en_title, ar_value, en_value }: ICreateTreeBodyRequest = req.body;
    //         if (!helpers.checkFields(req.body, [ar_title, en_title, ar_value, en_value])) return res.status(400).json({ message: "Bad Request" });
    //         const imgFile = req.files.img_tree;
    //         if (!helpers.mimetypeImge.includes(imgFile.mimetype)) return res.status(400).json({ msg: "Image should be png" });
    //         const imgName: string = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgFile.name)}`;
    //         const createdTreeBody = await treesBody.create(req.body);
    //         if (createdTreeBody) {
    //             const fileDir: string = `trees/${createdTreeBody["tree_id"]}/${createdTreeBody["header_id"]}/${createdTreeBody["id"]}/`;
    //             treesBody.update({ icon: `${fileDir}${imgName}` }, { where: { id: createdTreeBody["tree_id"] } }).then((d) => {
    //                 helpers.imageProcessing(fileDir, imgName, imgFile.data);
    //             });
    //         }
    //         return res.status(httpStatus.CREATED).json({ message: "A new Trees Body is created successfully" });
    //     } catch (error) {
    //         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't add new trees body" });
    //     }
    // }
    public editPage(req: Request, res: Response, next: NextFunction) {
        return res.render("tree-body/edit.ejs", { title: "Edit Trees Body" });
    }
    // public async editTreesBody(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { id, ar_title, en_title, ar_value, en_value }: IUpdateTreeBodyRequest = req.body;
    //         if (!Number(id) || !helpers.checkFields(req.body, [ar_title, en_title, ar_value, en_value])) return res.status(400).json({ message: "Bad Request" });
    //         const imgFile = req.files ? req.files.img_tree : null;
    //         await treesBody.update(req.body, { where: { id } });
    //         return res.status(httpStatus.OK).json({ message: "Trees Body is updated successfully" });
    //     } catch (error) {
    //         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't edit trees body" });
    //     }
    // }
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