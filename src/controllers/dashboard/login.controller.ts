import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"

export class LoginController {
  loginPage(req: Request, res: Response, next: NextFunction) {
    res.render("login.ejs", {title: "Login"})
  }
  login(req: Request, res: Response, next: NextFunction) {
    const {email, password} = req.body
    console.log(req.body)
    const token = Buffer.from("aaaaaaaaaaaaaaaaaa").toString("base64")
    // console.log(Buffer.from(req.cookies.token, "base64").toString())
    // res.cookie("token", `${token}`).status(200).json({status: 200})
    if (email == "admin@admin.com" && password == "admin") {
      res.cookie("token", `${token}`).status(200).json({status: 200})
    } else {
      res.status(200).json({status: 201})
    }
  }
}
