import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import path from "path"
import helpers from "../../helper/helpers"
import trees from "../../models/trees.model"
import { TreesInfoController } from "../api/trees-info.controller"
import { UserPermissionsController } from "./user-permissions.controller"

export class TreeController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/tree/list.ejs", {
      title: "Trees",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const pageIndex = (Number(req.query.page) - 1) * limit
    trees
      .findAll({
        limit: limit,
        offset: pageIndex,
        attributes: {exclude: ["updatedAt"]},
      })
      .then((data) => {
        trees
          .count()
          .then(async (count) => {
            const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Trees List");
            const dataInti = {
              total: count,
              limit: limit,
              page: Number(req.query.page),
              pages: Math.ceil(count / limit),
              data: data,
              canAdd: permissions.canAdd,
              canEdit: permissions.canEdit,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting trees", msg: "not found trees"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err: "There is something wrong while getting trees", msg: "not found trees"})
      })
  }
  public async detailsPage(req: Request, res: Response, next: NextFunction) {
    try {
      const treeInfoController = new TreesInfoController();
      const id = Number(req.params.id);
      const tree = await trees.findOne({ where: { tree_id: id }, attributes: { exclude: ["createdAt", "updatedAt"] } });
      const info = await treeInfoController.getInfoData(id, req["lang"]);
      const data = {
        tree_id: tree["tree_id"],
        ar_name: tree["ar_name"],
        en_name: tree["en_name"],
        slug_ar: tree["slug_ar"],
        slug_en: tree["slug_en"],
        img_tree: tree["img_tree"],
        ar_description: tree["ar_description"],
        en_description: tree["en_description"],
        deleted: tree["deleted"],
        header: info,
      };
      return res.render("dashboard/views/tree/view.ejs", { title: "Tree Details", data });
    } catch (error) {
      console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error, message: "Can't open tree details page" });
    }
  }
  newPage(req: Request, res: Response, next: NextFunction) {
    res.render("dashboard/views/tree/new.ejs", {
      title: "tree new",
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    const imgFile = req.files.img_tree
    if (!helpers.mimetypeImge.includes(imgFile.mimetype)) {
      res.status(400).json({msg: "Image should be png"})
    } else {
      const imgName: string = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgFile.name)}`
      trees
        .create({...req.body})
        .then((data) => {
          const treeId = data["tree_id"]
          const fileDir: string = `trees/${treeId}/`
          trees.update({img_tree: `${fileDir}${imgName}`}, {where: {tree_id: treeId}}).then((d) => {
            helpers.imageProcessing(fileDir, imgName, imgFile.data)
            res.status(httpStatus.OK).json({msg: "new tree created"})
          })
        })
        .catch((err) => {
          res.status(400).json({msg: "Error in create new tree", err: "unexpected error"})
        })
    }
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    trees.findOne({where: {tree_id: id}, raw: true}).then((data) => {
      res.render("dashboard/views/tree/edit.ejs", {
        title: "Edit tree",
        data: data,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const treeId = req.params.id
    const imgFile = req.files ? req.files.img_tree : null
    trees
      .update(req.body, {where: {tree_id: treeId}})
      .then(() => {
        if (imgFile) {
          trees.findOne({where: {tree_id: treeId}, attributes: ["img_tree"], raw: true}).then((d) => {
            helpers.removeFile(d["img_tree"])
            const imgName: string = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgFile.name)}`
            const fileDir: string = `trees/${treeId}/`
            trees.update({img_tree: `${fileDir}${imgName}`}, {where: {tree_id: treeId}}).then((d) => {
              helpers.imageProcessing(fileDir, imgName, imgFile.data)
              res.status(httpStatus.OK).json({msg: "new tree updated"})
            })
          })
        } else {
          res.status(httpStatus.OK).json({msg: "tree edited"})
        }
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit tree", err: "unexpected error"})
      })
  }
  async listTrees() {
    let data
    await trees
      .findAll({
        attributes: {exclude: ["updatedAt"]},
        raw: true,
      })
      .then((d) => {
        if (!d || d.length == 0) {
          data = null
        } else {
          data = d
        }
      })
      .catch((err) => {
        data = []
      })
    return data
  }
}
