import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { UserPermissionsController } from "./user-permissions.controller";
import { ModulesController } from "./modules.controller";
import { DestinationsController } from "./destination.controller";
import { TransportationController } from "./transportation.controller";
import destinationTransportation from "../../models/destination-transportation.model";
import transportation from "../../models/transportation.model";
import rentalCompany from "../../models/rental-company.model";
import driver from "../../models/driver.model";
import destination from "../../models/destination.model";
import { Op } from "sequelize";
export class DestinationTransportationController {
  constructor() {}
  public async listPage(req: Request, res: Response, next: NextFunction) {
    const data = await destination.findOne({ where: { id: req.params.destination_id }, attributes: ["ar_title", "en_title"], raw: true });
    return res.render("dashboard/views/destination-transportation/list.ejs", { title: "Destinations Transportations", data });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const where = { destination_id: req.params.destination_id };
      const data = await destinationTransportation.findAll({
        limit,
        offset,
        where,
        attributes: ["id", "transportation_id"],
        include: [
          { model: destination, attributes: ["ar_title", "en_title"] },
          { model: transportation, attributes: ["name", "type", "driver_id", "rental_company_id"], include: [{ model: driver, attributes: ["name"] }, { model: rentalCompany, attributes: ["name"] }] },
        ],
      }) || [];
      const countTransportations = await destinationTransportation.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Destinations Transportations Management");
      const module_id = await new ModulesController().getModuleIdByName("Destinations Transportations Management");
      const dataInti = { total: countTransportations, limit, page: Number(req.query.page), pages: Math.ceil(countTransportations / limit) + 1, data, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting trips list", msg: "Internal Server Error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await new DestinationsController().getAllDestinations();
      const transportations = await new TransportationController().getAllTransportations();
      return res.render("dashboard/views/destination-transportation/new.ejs", { title: "Destinations Transportations new", destinations, transportations });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get destination transportation new page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNotNumbers = !Number(req.body.transportation_id) || !Number(req.params.destination_id);
      if (areNotNumbers) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const payload = { destination_id: Number(req.params.destination_id), transportation_id: Number(req.body.transportation_id) };
      await destinationTransportation.create(payload);
      return res.status(httpStatus.OK).json({ msg: "new Destinations Transportations created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new Destinations Transportations", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!Number(req.params.id) || !Number(req.params.destination_id)) return res.status(404).json({ msg: "Error in getting destination transportation", err: "unexpected error" });
      const data = await destinationTransportation.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: true,
      });
      const destinations = await new DestinationsController().getAllDestinations();
      const transportations = await new TransportationController().getAllTransportations();
      return res.render("dashboard/views/destination-transportation/edit.ejs", { title: "Edit Destination Transportation", data, destinations, transportations, destination_id: req.params.destination_id });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Error in get destination transportation data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id || !Number(req.body.transportation_id) || !Number(req.params.destination_id)) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await destinationTransportation.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "Destinations Transportations edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit destination transportation", err: "unexpected error" });
    }
  }
  public async getAllDestinationTransportations(destinationIdOrIds: any) {
    try {
      const where = !Array.isArray(destinationIdOrIds) ? { destination_id: destinationIdOrIds } : { destination_id: { [Op.in]: destinationIdOrIds } };
      return await destinationTransportation.findAll({ where, include: [{ model: transportation, attributes: ["id", "name", "type"] }], raw: true });
    } catch (error) {
      throw error;
    }
  }
}
