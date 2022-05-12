import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ICreateTreeHeaderRequest } from "../../interfaces/ICreateTreeHeaderRequest";
import modules from "../../models/module.model";
import page from "../../models/page.model";
import permissions from "../../models/permissions.model";
import treeHeader from "../../models/trees_headers.model";
const { verify } = require("../../helper/token");
export class TreesHeaderController {
    constructor() {}
    public listPage(req: Request, res: Response, next: NextFunction) {
        return res.render("dashboard/views/trees-headers/list.ejs", { title: "Trees Headers list" });
    }
    public async getTreesHeaders(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await treeHeader.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
            const payload = verify(req.cookies.token);
            const isHighestAdmin = payload.role_id === "0";
            let userPermissions, canEdit = true, canAdd = true;
            if (!isHighestAdmin) {
              userPermissions = await permissions.findAll({
                where: { role_id: payload.role_id },
                attributes: { exclude: ["role_id", "page_id", "createdAt", "updatedAt"] },
                include: [{
                  model: page,
                  attributes: ["type"],
                  include: [{ model: modules, attributes: ["name"] }],
                }],
              });
              canEdit = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Edit" && per["tbl_page"]["tbl_module"]["name"] === "Trees Headers").length;
              canAdd = !!userPermissions.filter((per) => per["tbl_page"]["type"] === "Add" && per["tbl_page"]["tbl_module"]["name"] === "Trees Headers").length;
            }
            return res.status(httpStatus.OK).json({ data, canAdd, canEdit });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "There is something wrong while getting tree headers", msg: "Can't get trees headers" });
        }
    }
    public newPage(req: Request, res: Response, next: NextFunction) {
        return res.render("dashboard/views/trees-headers/new.ejs", { title: "Add Trees Header" });
    }
    public async addTreesHeader(req: Request, res: Response, next: NextFunction) {
        try {
            const { ar_name, en_name }: ICreateTreeHeaderRequest = req.body;
            if (!req.body || !ar_name || !en_name) return res.status(400).json({ message: "Bad Request" });
            await treeHeader.create(req.body);
            return res.status(httpStatus.CREATED).json({ message: "A new Trees Header is created successfully" });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "There is something wrong while adding tree header", msg: "Can't add new trees header" });
        }
    }
    public async editPage(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!id) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
            const data = await new TreesHeaderController().getTreesHeader(id);
            return res.render("dashboard/views/trees-headers/edit.ejs", { title: "Edit Trees Header", data });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "There is something wrong while opening edit tree header page", msg: "Can't open edit trees header page" });
        }
    }
    public async editTreesHeader(req: Request, res: Response, next: NextFunction) {
        try {
            if (!Number(req.params.id) || !req.body) return res.status(400).json({ message: "Bad Request" });
            await treeHeader.update(req.body, { where: { id: req.params.id } });
            return res.status(httpStatus.OK).json({ message: "Trees Header is updated successfully" });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: "There is something wrong while updating tree header", msg: "Can't edit trees header" });
        }
    }
    private async getTreesHeader(id: number) {
        try {
            return await treeHeader.findOne({ where: { id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
        } catch (error) {
            return { err: "There is something wrong while getting tree header", msg: "Can't get trees header" };
        }
    }
} 