import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import * as http from "http"
import config, {IEnv} from "./config/config"
import routes from "./routes"
import routeDashboard from "./routes/dashboard"
import auth from "./middlewares/auth.middleware"
import appleLink from "./middlewares/apple-link.middleware"
import authDash from "./middlewares/auth-dashboard.middleware"
import sendMail from "./middlewares/send-email.middleware"
import path from "path"
import fileupload from "express-fileupload"
import useragent from "express-useragent"
import morgan from "morgan"
import fs from "fs"
import {fbTokenInfo} from "./middlewares/auth-fb.middleware"
import page from "./models/page.model"
import modules from "./models/module.model"
import userRole from "./models/userRole.model"
export class IndexApp {
  private app: express.Application = express()
  private server: http.Server = http.createServer(this.app)
  public config: IEnv = config
  private port: string | number = process.env.PORT || this.config.port

  constructor() {
    this.parse()
    this.logger()
    this.cors()
    this.templateEngine()
    this.route()
    // this.testMail()
    this.listen()
  }
  private async parse() {
    this.app.use(cookieParser()) // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
    this.app.use(express.json()) // parse json request body
    this.app.use(express.urlencoded({extended: true})) // parse urlencoded request body
    this.app.use(fileupload())
    this.app.use(useragent.express())
  }
  private logger(): void {
    let accessLogStream = fs.createWriteStream(path.join(__dirname, "../assets/logger/access.log"), {flags: "a"})
    this.app.use(morgan("combined", {stream: accessLogStream}))
  }
  private cors(): void {
    const corsOptions = {
      origin: "http://localhost:8081",
    }
    this.app.use(cors())
    page.findAll().catch((e)=>console.log(e))
    modules.findAll().catch((e)=>console.log(e))
    userRole.findAll().catch((e)=>console.log(e))
  }
  private templateEngine(): void {
    this.app.use("/css", express.static(path.join(__dirname, "../dashboard/public/css")))
    this.app.use("/js", express.static(path.join(__dirname, "../dashboard/public/js")))
    this.app.use("/img", express.static(path.join(__dirname, "../dashboard/public/img")))
    // Setting the root path for views directory
    this.app.set("views", path.join(__dirname, "../dashboard/views"))
    // Setting the view engine
    this.app.set("view engine", "ejs")
    this.app.use(authDash)
    routeDashboard(this.app)
  }
  private route(): void {
    this.app.get("/apple-app-site-association", appleLink)
    this.app.use("/p/img/", express.static(path.join(__dirname, "../public")))
    this.app.use(auth)
    routes(this.app)
    // this.app.use((req, res) => res.status(404).json({message: "this route not found"}))
    this.app.use((req, res) => res.render("layout/404.ejs"))
  }

  private testMail(): void {
    sendMail(["abdelgaber332@gmail.com"], "Sahlan email verify", "otp", {email: "abdelgaber332@gmail.com", otp: "4567"})
      .then((d) => {
        console.log(d)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port : ", this.port)
    })
  }

  public getApp(): express.Application {
    return this.app
  }
}
