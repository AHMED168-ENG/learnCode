import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import helpers from "../../helper/helpers";
import { ICreateTreeHeaderRequest } from "../../interfaces/ICreateTreeHeaderRequest";
import { IUpdateTreeHeaderRequest } from "../../interfaces/IUpdateTreeHeaderRequest";
import treeHeader from "../../models/trees_headers.model";
export class TreesHeaderController {
    constructor() {}
    public listPage(req: Request, res: Response, next: NextFunction) {
        return res.render("tree-header/list.ejs", { title: "Trees Headers" });
    }
    public async getTreesHeaders(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await treeHeader.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
            return res.status(httpStatus.OK).json(data);
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't get trees headers" });
        }
    }
    public async getTreesHeader(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id || !Number(req.params.id)) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
            const data = await treeHeader.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
            return res.status(httpStatus.OK).json(data);
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't get trees header" });
        }
    }
    public newPage(req: Request, res: Response, next: NextFunction) {
        return res.render("tree-header/new.ejs", { title: "Add Trees Header" });
    }
    public async addTreesHeader(req: Request, res: Response, next: NextFunction) {
        try {
            const { ar_name, en_name }: ICreateTreeHeaderRequest = req.body;
            if (!helpers.checkFields(req.body, [ar_name, en_name])) return res.status(400).json({ message: "Bad Request" });
            await treeHeader.create(req.body);
            return res.status(httpStatus.CREATED).json({ message: "A new Trees Header is created successfully" });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't add new trees header" });
        }
    }
    public editPage(req: Request, res: Response, next: NextFunction) {
        return res.render("tree-header/edit.ejs", { title: "Edit Trees Header" });
    }
    public async editTreesHeader(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, ar_name, en_name }: IUpdateTreeHeaderRequest = req.body;
            if (!Number(id) || !helpers.checkFields(req.body, [ar_name, en_name])) return res.status(400).json({ message: "Bad Request" });
            await treeHeader.update(req.body, { where: { id } });
            return res.status(httpStatus.OK).json({ message: "Trees Header is updated successfully" });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't edit trees header" });
        }
    }
    public async deleteTreesHeader(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id || !Number(req.params.id)) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
            await treeHeader.destroy({ where: { id: req.params.id } });
            return res.status(httpStatus.OK).json({ message: "Tree Header is deleted successfully" });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't delete trees header" });
        }
    }
} 