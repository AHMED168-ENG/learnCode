import {Router} from "express"
import {IinitiativeController} from "../../controllers/api/initiative.controller"

export class InitiativeRoutes {
  router: Router
  public initiativeController: IinitiativeController = new IinitiativeController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.get("/featured/:cityId", this.initiativeController.featuredInitiatives)
    this.router.get("/related/:initId", this.initiativeController.relatedInitiatives)
    this.router.get("/", this.initiativeController.list)
    this.router.get("/mycontributions", this.initiativeController.contributionsList)
    this.router.get("/favourite", this.initiativeController.favourite)
    this.router.get("/:id", this.initiativeController.initiativeDetails)
  }
}
