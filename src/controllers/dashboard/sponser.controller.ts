import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import path from "path"
import bcrypt from "bcrypt"
import sequelize from "sequelize"
import helpers from "../../helper/helpers"
import sponser from "../../models/sponser.model"

export class SponserController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("sponser/list.ejs", {
      title: "Sponsers",
    })
  }

  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    sponser
      .findAll({
        limit: limit,
        offset: page,
        attributes: {exclude: ["password", "updatedAt", "createdAt"]},
      })
      .then((data) => {
        sponser
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
          .catch((err) => res.status(httpStatus.NOT_FOUND).json({err, msg: "not found initiative"}))
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({err, msg: "not found initiatives"})
      })
  }
  newPage(req: Request, res: Response, next: NextFunction) {
    res.render("sponser/new.ejs", {
      title: "Sponsers new",
    })
  }
  addNew(req, res: Response, next: NextFunction) {
    const imgFile = req.files.img
    if (!helpers.mimetypeImge.includes(imgFile.mimetype)) {
      res.status(400).json({msg: "Image should be png or jpg"})
    } else {
      const imgName: string = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgFile.name)}`
      const randomPassword = helpers.randomString()
      sponser
        .create({...req.body, password: bcrypt.hashSync(randomPassword, 12)})
        .then((data) => {
          const sponserId = data["sponser_id"]
          const fileDir: string = `sponsor/${sponserId}/`
          sponser.update({img: `${fileDir}${imgName}`}, {where: {sponser_id: sponserId}}).then((d) => {
            helpers.imageProcessing(fileDir, imgName, imgFile.data)
            res.status(201).json({msg: "Error in create new sponser"})
          })
        })
        .catch((err) => {
          console.log(err)
          res.status(400).json({msg: "Error in create new sponser", err: err.errors[0].message || "unexpected error"})
        })
    }
  }

  async editPage(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    sponser.findOne({where: {sponser_id: id}, attributes: {exclude: ["password", "updatedAt", "createdAt"]}, raw: true}).then((data) => {
      res.render("sponser/edit.ejs", {
        title: "Edit Sponsor",
        data: data,
      })
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const sponserId = req.params.id
    const imgFile = req.files ? req.files.img : null
    sponser
      .update(req.body, {where: {sponser_id: sponserId}})
      .then(() => {
        if (imgFile) {
          sponser.findOne({where: {sponser_id: sponserId}, attributes: ["img"], raw: true}).then((d) => {
            helpers.removeFile(d["img"])
            const imgName: string = `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(imgFile.name)}`
            const fileDir: string = `sponsor/${sponserId}/`
            sponser.update({img_tree: `${fileDir}${imgName}`}, {where: {sponser_id: sponserId}}).then((d) => {
              helpers.imageProcessing(fileDir, imgName, imgFile.data)
              res.status(httpStatus.OK).json({msg: "new sponsor updated"})
            })
          })
        } else {
          res.status(httpStatus.OK).json({msg: "sponsor edited"})
        }
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit sponsor", err: err.errors[0].message || "unexpected error"})
      })
  }

  async lastSponser(lang: string = "en") {
    let data
    await sponser
      .findAll({
        limit: 8,
        offset: 0,
        attributes: ["sponser_name", "img", [sequelize.fn("date_format", sequelize.col("createdAt"), "%Y-%m-%d"), "createdAt"]],
        order: [["createdAt", "DESC"]],
        raw: true,
      })
      .then((d) => (data = d))
      .catch((e) => (data = null))
    return data
  }
}
