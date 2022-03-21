import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import {UserController} from "./users.controller"
import {CityController} from "./city.controller"
import {AppConfController} from "./app-conf.controller"
import {InitiativesLocationController} from "./initiative-location.controller"
import {CartController} from "./cart.controller"

export class HomeController extends Controller {
  constructor() {
    super()
  }
  async home(req: Request, res: Response, next: NextFunction) {
    const lang = req["lang"]
    const userId = req.user.user_id

    const cities = await new CityController().homelist(lang)
    const user = await new UserController().homeData(lang, userId)
    const footer = await new AppConfController().homeFooter(lang)
    const places = await new InitiativesLocationController().WhereLikeToPlant(lang)
    const cartCount = await new CartController().cardCount(userId)

    res.status(httpStatus.OK).json({cities, user, footer, places, cartCount})
  }
}
