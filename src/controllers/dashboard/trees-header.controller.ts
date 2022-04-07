import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ICreateTreeHeaderRequest } from "../../interfaces/ICreateTreeHeaderRequest";
import treeHeader from "../../models/trees_headers.model";
export class TreesHeaderController {
    constructor() {}
    public listPage(req: Request, res: Response, next: NextFunction) {
        return res.render("trees-headers/list.ejs", { title: "Trees Headers list" });
    }
    public async getTreesHeaders(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await treeHeader.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
            return res.status(httpStatus.OK).json({ data });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't get trees headers" });
        }
    }
    public newPage(req: Request, res: Response, next: NextFunction) {
        return res.render("trees-headers/new.ejs", { title: "Add Trees Header" });
    }
    public async addTreesHeader(req: Request, res: Response, next: NextFunction) {
        try {
            const { ar_name, en_name }: ICreateTreeHeaderRequest = req.body;
            if (!req.body || !ar_name || !en_name) return res.status(400).json({ message: "Bad Request" });
            await treeHeader.create(req.body);
            return res.status(httpStatus.CREATED).json({ message: "A new Trees Header is created successfully" });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't add new trees header" });
        }
    }
    public async editPage(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!id) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
            const data = await new TreesHeaderController().getTreesHeader(id);
            return res.render("trees-headers/edit.ejs", { title: "Edit Trees Header", data });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't open edit trees header page" });
        }
    }
    public async editTreesHeader(req: Request, res: Response, next: NextFunction) {
        try {
            if (!Number(req.params.id) || !req.body) return res.status(400).json({ message: "Bad Request" });
            await treeHeader.update(req.body, { where: { id: req.params.id } });
            return res.status(httpStatus.OK).json({ message: "Trees Header is updated successfully" });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, msg: "Can't edit trees header" });
        }
    }
    private async getTreesHeader(id: number) {
        try {
            return await treeHeader.findOne({ where: { id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
        } catch (error) {
            return { error, msg: "Can't get trees header" };
        }
    }
} 