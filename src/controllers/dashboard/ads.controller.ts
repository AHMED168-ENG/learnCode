import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import ads from "../../models/ads.model";
import promo from "../../models/promo.model";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
export class AdsController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/ads/list.ejs", { title: "Advertisements" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const data = await ads.findAll({ limit, offset, attributes: { include: ["id", "ar_name", "en_name", "price", "request", "status"] } }) || [];
      const countAds = await ads.count() || 0;
      const modulesArray = ["New Ads Management", "InProgress Ads Management", "Completed Ads Management", "Cancelled Ads Management"];
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, modulesArray);
      const dataInti = {
        total: countAds,
        limit,
        page: Number(req.query.page),
        pages: Math.ceil(countAds / limit) + 1,
        data,
        canEditNew: permissions[0]?.canEdit,
        canViewNew: permissions[0]?.canView,
        canEditInProgress: permissions.length > 1 ? permissions[1].canEdit : permissions[0]?.canEdit,
        canViewInProgress: permissions.length > 1 ? permissions[1].canView : permissions[0]?.canView,
        canViewCompleted: permissions.length > 1 ? permissions[2].canView : permissions[0]?.canView,
        canViewCancelled: permissions.length > 1 ? permissions[2].canView : permissions[0]?.canView,
      };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting ads list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting ad", err: "unexpected error" });
      const data = await ads.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["updatedAt"] },
        include: [{ model: promo, attributes: ["percent"] }],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Ads Management");
      return res.render("dashboard/views/ads/view.ejs", { title: "View Ad Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get ad data in view page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id || (!req.query.status && !req.query.request)) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const payload = req.query.status ? { status: req.query.status } : req.query.request ? { request: req.query.request } : req.body;
      await ads.update(payload, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "advertisement edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit ad", err: "unexpected error" });
    }
  }
}
