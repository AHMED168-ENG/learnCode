import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import path from "path";
import helpers from "../../helper/helpers";
import destination from "../../models/destination.model";
import ticket from "../../models/ticket.model";
import provider from "../../models/provider.model";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { DestinationController } from "./destination.controller";
import { ProviderController } from "./provider.controller";
import promo from "../../models/promo.model";
import webAppsUsers from "../../models/user.model";
export class TicketController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/ticket/list.ejs", { title: "Tickets" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const data = await ticket.findAll({
        limit,
        offset,
        attributes: { include: ["id", "ar_name", "en_name", "status"] },
        include: [
          { model: promo, attributes: ["promo_id", "promo_name"] },
          { model: webAppsUsers, attributes: ["fullName", "email", "phone"] },
        ],
      }) || [];
      const countTickets = await ticket.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Tickets Booking Management");
      const module_id = await new ModulesController().getModuleIdByName("Tickets Booking Management");
      const dataInti = { total: countTickets, limit, page: Number(req.query.page), pages: Math.ceil(countTickets / limit) + 1, data, canAdd: permissions.canAdd, canEdit: permissions.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting ticket list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting ticket", err: "unexpected error" });
      const data = await ticket.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          { model: promo, attributes: ["promo_name"] },
          { model: webAppsUsers, attributes: ["fullName", "email", "phone"] },
        ],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Tickets Booking Management");
      return res.render("dashboard/views/ticket/view.ejs", { title: "View ticket Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get ticket data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await new DestinationController().getAllDestinations();
      const providers = await new ProviderController().getAllProviders();
      return res.render("dashboard/views/ticket/new.ejs", { title: "ticket new", destinations, providers });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destinations or open new ticket page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.files;
      const isNotNumber = !Number(req.body.destination_id);
      if (areNull || isNotNumber) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const img = req.files.image;
      const imgName: string = img ? `${helpers.randomNumber(100, 999)}_${Number(new Date())}${path.extname(img["name"])}` : null;
      const createdPackage = await ticket.create(req.body);
      if (createdPackage) {
        const fileDir: string = `ticket/${createdPackage["id"]}/`
        const set = { image: imgName ? `${fileDir}${imgName}` : null };
        const updatedPackage = await ticket.update(set, { where: { id: createdPackage["id"] } });
        if (updatedPackage) {
          if (imgName && img) helpers.imageProcessing(fileDir, imgName, img["data"]);
          return res.status(httpStatus.OK).json({ msg: "New Ticket created" });
        }
      }
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new ticket", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting ticket", err: "unexpected error" });
      const destinations = await new DestinationController().getAllDestinations();
      const providers = await new ProviderController().getAllProviders();
      const data = await ticket.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Tickets Booking Management");
      return res.render("dashboard/views/ticket/edit.ejs", { title: "Edit Ticket", data, destinations, providers, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get ticket data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await ticket.update({ status: req.query.status }, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "ticket edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit ticket", err: "unexpected error" });
    }
  }
}
