import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import path from "path"
import helpers from "../../helper/helpers"
import trees from "../../models/trees.model"

export class TreeController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("tree/list.ejs", {
      title: "Trees",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    trees
      .findAll({
        limit: limit,
        offset: page,
        attributes: {exclude: ["updatedAt"]},
      })
      .then((data) => {
        trees
          .count()
          .then((count) => {
            const dataInti = {
              total: count,
              limit: limit,
              page: Number(req.query.page),
              pages: Math.ceil(count / limit),
              data: data,
            }
            res.status(httpStatus.OK).json(dataInti)
          })
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err, msg: "not found trees"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found trees"})
      })
  }
  newPage(req: Request, res: Response, next: NextFunction) {
    res.render("tree/new.ejs", {
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
          res.status(400).json({msg: "Error in create new tree", err: err.errors[0].message || "unexpected error"})
        })
    }
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    trees.findOne({where: {tree_id: id}, raw: true}).then((data) => {
      res.render("tree/edit.ejs", {
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
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit tree", err: err.errors[0].message || "unexpected error"})
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
