import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import { Op } from "sequelize";
import { MediaType } from "../../enums/media-type.enum";
import helpers from "../../helper/helpers";
import album_image from "../../models/album_image.model";
import album_video from "../../models/album_video.model";
export class MediaController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/media/list.ejs", { title: "Album of Images or Videos", module_id: req.params.module_id, mediaType: req.params.mediaType, item_id: req.params.item_id });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.mediaType || !req.params.module_id || !req.params.item_id) return res.status(400).json({ err: "unexpected error", msg: "Bad Request" });
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const model = req.params.mediaType === MediaType.video ? album_video : album_image;
      const where = { module_id: req.params.module_id, item_id: req.params.item_id };
      const data = await model.findAll({ limit, offset, where, attributes: { exclude: ["createdAt", "updatedAt"] } }) || [];
      const countItems = await model.count() || 0;
      const dataInti = { total: countItems, limit, page: Number(req.query.page), pages: Math.ceil(countItems / limit) + 1, data, canAdd: true, canEdit: true };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting album list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id || !req.params.mediaType) return res.status(404).json({ msg: "Error in getting media data", err: "unexpected error" });
      const model = req.params.mediaType === MediaType.video ? album_video : album_image;
      const data = await model.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      return res.render("dashboard/views/media/view.ejs", { title: `View ${req.params.mediaType === MediaType.video ? MediaType.video.toUpperCase() : MediaType.image.toUpperCase()} Details`, data });
    } catch (error) {
      return res.status(500).json({ msg: `Error in get ${req.params.mediaType === MediaType.video ? MediaType.video : MediaType.image} data in view page`, err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.mediaType || !req.params.module_id || !req.params.item_id) return res.status(400).json({ err: "unexpected error", msg: "Bad Request" });
      return res.render("dashboard/views/media/new.ejs", { title: "Media new", mediaType: req.params.mediaType });
    } catch (error) {
      return res.status(500).json({ msg: "Can't open new media page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || !req.params.mediaType || !req.params.module_id || !req.params.item_id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const media = req.files.media;
      const mediaName: string = media ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(media["name"])}` : null;
      const model = req.params.mediaType === MediaType.video ? album_video : album_image;
      const createdMedia = await model.create({ module_id: req.params.module_id, item_id: req.params.item_id });
      if (createdMedia) {
        const fileDir: string = `media/${createdMedia["module_id"]}/${createdMedia["item_id"]}/`;
        const set = req.params.mediaType === MediaType.video ? { video: mediaName ? `${fileDir}${mediaName}` : null } : { image: mediaName ? `${fileDir}${mediaName}` : null };
        const updatedMedia = await model.update(set, { where: { id: createdMedia["id"] } });
        if (updatedMedia) {
          if (mediaName && media) {
            if (media["mimetype"].includes("image")) helpers.imageProcessing(fileDir, mediaName, media["data"]);
          }
          return res.status(httpStatus.OK).json({ msg: "New Media created" });
        }
      }
    } catch (error) {
      return res.status(500).json({ msg: "Error in create new media", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id || !req.params.mediaType || !req.params.item_id) return res.status(404).json({ msg: "Error in getting media", err: "unexpected error" });
      const model = req.params.mediaType === MediaType.video ? album_video : album_image;
      const data = await model.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      return res.render("dashboard/views/media/edit.ejs", { title: "Edit Media", data });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get media data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id || !req.params.mediaType || !req.params.module_id || !req.params.item_id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files ? req.files.media : null;
      const model = req.params.mediaType === MediaType.video ? album_video : album_image;
      const updatedMedia = await model.update({ module_id: req.params.module_id }, { where: { id: req.params.id } });
      if (updatedMedia) {
        const field = req.params.mediaType === MediaType.video ? MediaType.video : MediaType.image;
        const foundMedia = await model.findOne({ where: { id: req.params.id }, attributes: [field], raw: true });
        let imgName: string;
        if (img) {
          helpers.removeFile(foundMedia[field]);
          imgName = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}`;
        }
        const fileDir: string = `media/${req.params.module_id}/${req.params.item_id}/`;
        const set = req.params.mediaType === MediaType.video ? { video: `${fileDir}${imgName}` || fileDir + foundMedia[field] } : { image: `${fileDir}${imgName}` || fileDir + foundMedia[field] };
        const updatedMediaWithImages = await model.update(set, { where: { id: req.params.id }});
        if (updatedMediaWithImages) { if (img && imgName) helpers.imageProcessing(fileDir, imgName, img["data"]); }
      }
      return res.status(httpStatus.OK).json({ msg: "media edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit media", err: "unexpected error" });
    }
  }
  public async getAllMedia(module_id: any, item_id: any) {
    try {
      const images = await album_image.findAll({ where: { [Op.and]: { module_id, item_id } }, attributes: { exclude: ["createdAt", "updatedAt"] } });
      const videos = await album_video.findAll({ where: { [Op.and]: { module_id, item_id } }, attributes: { exclude: ["createdAt", "updatedAt"] } });
      return { images, videos };
    } catch (error) {
      throw error;
    }
  }
}
