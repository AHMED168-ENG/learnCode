import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import city from "../../models/city.model"
import {Model} from "sequelize/types"
import AppConfModel from "../../models/app-conf.model"

export class AppConfController extends Controller {
  constructor() {
    super()
  }
  async homeFooter(lang: string): Promise<Model<any, any> | null> {
    const ar_en = lang == "en" ? "footerEn" : "footerAr"
    let data: Model<any, any> | null
    await AppConfModel
      .findOne({attributes: [[ar_en, "footer"], "footerImg"]})
      .then((d) => {
        if (!d) {
          data = null
        } else {
          data = d
        }
      })
      .catch((err) => {
        data = null
      })
    return data
  }
}
