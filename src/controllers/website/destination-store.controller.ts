import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import destination from "../../models/destination.model";
import destinationStore from "../../models/destination_stores.model";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
export class DestinationStoreController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("website/views/destination-stores/list.ejs", { title: "Destination Stores" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const stores = await destinationStore.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "logo", "status"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
      }) || [];
      const countStores = await destinationStore.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Destinations Stores Management");
      const module_id = await new ModulesController().getModuleIdByName("Destinations Stores Management");
      const dataInti = { total: countStores, limit, page: Number(req.query.page), pages: Math.ceil(countStores / limit) + 1, data: stores, canAdd: permissions.canAdd, canEdit: permissions.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting stores list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting destination store", err: "unexpected error" });
      const data = await destinationStore.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: destination, attributes: ["ar_title", "en_title"] }],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Stores Management");
      return res.render("website/views/destination-stores/view.ejs", { title: "View Destination store Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get destination store data in view page", err: "unexpected error" });
    }
  }
  public async getAllDestinationStores(lang: string, destination_id: number) {
    try {
      const stores = await destinationStore.findAll({ where: { destination_id }, attributes: [`${lang}_name`, "logo"], raw: true });
      return stores.map((store) => { return { id: store["id"], name: store[`${lang}_name`], image: store["logo"] }; });
    } catch (error) {
      throw error;
    }
  }
}
