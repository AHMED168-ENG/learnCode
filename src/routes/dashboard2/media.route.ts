import { Router } from "express";
import { MediaController } from "../../controllers/dashboard2/media.controller";
import helpers from "../../helper/helpers";
export class MediaRoutes {
  public router: Router;
  public mediaController: MediaController = new MediaController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/:module_id/:mediaType/:item_id", this.mediaController.listPage);
    this.router.get("/:module_id/:mediaType/:item_id/list", this.mediaController.list);
    this.router.get("/:module_id/:mediaType/:item_id/view/:id", this.mediaController.viewPage);
    this.router.get("/:module_id/:mediaType/:item_id/new", this.mediaController.newPage);
    this.router.post("/:module_id/:mediaType/:item_id/new", this.mediaController.addNew);
    this.router.get("/:module_id/:mediaType/:item_id/edit/:id", this.mediaController.editPage);
    this.router.put("/:module_id/:mediaType/:item_id/edit/:id", this.mediaController.edit);
  }
}
