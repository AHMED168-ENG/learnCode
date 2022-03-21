import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import favouriteInitiative from "../../models/initiative-favourite.model"

export class FavouriteInitController extends Controller {
  constructor() {
    super()
  }
  addOrRemove(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.user_id
    const initId = req.params.initId
    const where = {user_id: userId, init_id: initId}
    favouriteInitiative
      .findOrCreate({
        where: where,
        defaults: where,
      })
      .then((data) => {
        if (!data[1]) {
          favouriteInitiative
            .destroy({where: where})
            .then(() => {
              res.status(httpStatus.OK).json({msg: "Remove successfully", favorite: 0})
            })
            .catch((err) => {
              res.status(httpStatus.NOT_FOUND).json({msg: "Error happend"})
            })
        } else {
          res.status(httpStatus.OK).json({msg: "Add successfully", favorite: 1})
        }
      })
      .catch((err) => {
        res.status(httpStatus.NOT_FOUND).json({msg: "Error happend"})
      })
  }
}
