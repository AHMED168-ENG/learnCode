import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import initiatives from "../../models/initiative.model"
import sequelize from "sequelize"
import initiativesImg from "../../models/initiativeImg.model"

export class InitiativeController {
  listPage(req: Request, res: Response, next: NextFunction) {
    res.render("initiatives/list.ejs", {
      title: "Initiative",
    })
  }
  list(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit)
    const page = (Number(req.query.page) - 1) * limit
    initiatives
      .findAll({
        limit: limit,
        offset: page,
        attributes: [
          "init_id",
          "init_en_name",
          "init_ar_name",
          "logo",
          "from_date",
          "to_date",
          "featured",
          "status",
          "deleted",
          [
            sequelize.literal(`(
          SELECT img
          FROM tbl_sponsers
          WHERE
          tbl_sponsers.sponser_id= tbl_initiatives.sponsor_id
          )`),
            "sponsorImg",
          ],
        ],
      })
      .then((data) => {
        initiatives
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
  viewPage(req: Request, res: Response, next: NextFunction) {
    res.render("initiatives/view.ejs", {
      title: "Initiative",
    })
  }
  async lastInitiative(lang: string = "en") {
    const initName = lang ? "init_en_name" : "init_ar_name"
    let data
    await initiatives
      .findAll({
        limit: 3,
        offset: 0,
        attributes: [
          [initName, "name"],
          [
            sequelize.literal(`(
            SELECT img
            FROM tbl_initiatives_imgs AS initiativesImg
            WHERE
            initiativesImg.init_id = tbl_initiatives.init_id limit 1
            )`),
            "img",
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(location_id) as totalLocation
            FROM tbl_initiatives_locations
            WHERE
            tbl_initiatives_locations.init_id = tbl_initiatives.init_id
            AND tbl_initiatives_locations.location_status='active'
            AND tbl_initiatives_locations.deleted='no'
            )`),
            "totalLocation",
          ],
          [
            sequelize.literal(`(
              SELECT SUM(carbon_points) as carbonPoint
              FROM tbl_initiatives_trees AS initiativeTrees
              WHERE
              initiativeTrees.init_id_pk = tbl_initiatives.init_id
              AND initiativeTrees.status='active'
              AND initiativeTrees.deleted='no'
            )`),
            "carbonPoint",
          ],
        ],
        order: [["createdAt", "DESC"]],
        raw: true,
      })
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
  /**
   * List of initiatives ( name - from - to )
   */
  async listDateFromTo(lang: string = "en") {
    let data
    await initiatives
      .findAll({
        attributes: ["init_id", "init_en_name", "from_date", "to_date"],
        raw: true,
      })
      .then((d: any) => (data = d))
      .catch((e) => (data = null))
    return data
  }
}
