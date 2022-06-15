import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import ticket from "../../models/ticket.model";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
export class TicketController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/ticket/list.ejs", { title: "Tickets" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const data = await ticket.findAll({ limit, offset, attributes: { include: ["id", "ar_name", "en_name", "price", "quantity", "status"] } }) || [];
      const countTickets = await ticket.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Tickets Booking Management");
      const module_id = await new ModulesController().getModuleIdByName("Tickets Management");
      const dataInti = { total: countTickets, limit, page: Number(req.query.page), pages: Math.ceil(countTickets / limit) + 1, data, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting ticket list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting ticket", err: "unexpected error" });
      const data = await ticket.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Tickets Management");
      return res.render("dashboard/views/ticket/view.ejs", { title: "View ticket Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get ticket data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render("dashboard/views/ticket/new.ejs", { title: "ticket new" });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destinations or open new ticket page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.ar_name || !req.body.en_name || !req.body.price || !req.body.quantity || !req.body.location_lat || !req.body.location_long;
      const areNumbers = !Number(req.body.location_lat) || !Number(req.body.location_long);
      if (areNull || areNumbers) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await ticket.create(req.body);
      return res.status(httpStatus.OK).json({ msg: "New Ticket created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new ticket", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting ticket", err: "unexpected error" });
      const data = await ticket.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Tickets Management");
      return res.render("dashboard/views/ticket/edit.ejs", { title: "Edit Ticket", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get ticket data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const payload = req.query.status ? { status: req.query.status } : req.body;
      await ticket.update(payload, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "ticket edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit ticket", err: "unexpected error" });
    }
  }
}
