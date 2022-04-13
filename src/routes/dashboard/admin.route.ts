import {Router} from "express"
import {AdminController} from "../../controllers/dashboard/admin.controller"

export class AdminRoutes {
  router: Router
  public adminController: AdminController = new AdminController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/login", this.adminController.loginPage)
    this.router.post("/login", this.adminController.login)
    this.router.get("/", this.adminController.listPage)
    this.router.get("/list", this.adminController.list)
    this.router.get("/new", this.adminController.newPage)
    this.router.post("/new", this.adminController.addNew)
    this.router.get("/edit/:id", this.adminController.editPage)
    this.router.put("/edit/:id", this.adminController.edit)
  }
}
