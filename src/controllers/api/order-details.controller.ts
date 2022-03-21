import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import orderDetails from "../../models/order-details.model"

export class OrderDetailsController extends Controller {
  constructor() {
    super()
  }
}
