import {Router} from "express"
import {TreeController} from "../../controllers/dashboard/tree.controller"

export class TreeRoutes {
  router: Router
  public treeController: TreeController = new TreeController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/", this.treeController.listPage)
    this.router.get("/list", this.treeController.list)
    this.router.get("/details/:id", this.treeController.detailsPage)
    this.router.get("/new", this.treeController.newPage)
    this.router.post("/new", this.treeController.addNew)
    this.router.get("/edit/:id", this.treeController.editPage)
    this.router.post("/edit/:id", this.treeController.edit)
  }
}
