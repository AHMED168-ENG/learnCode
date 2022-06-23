import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import driver from "../../models/driver.model";
import rentalCompany from "../../models/rental-company.model";
import transportation from "../../models/transportation.model";
import { ModulesController } from "../dashboard/modules.controller";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { DriverController } from "./driver.controller";
import { RentalCompanyController } from "./rental-company.controller";
export class TransportationController {
  constructor() {}
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/transportation/list.ejs", { title: "Destination Transportations" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const data = await transportation.findAll({
        limit,
        offset,
        attributes: ["id", "name", "type"],
        include: [{ model: driver, attributes: ["name"] }, { model: rentalCompany, attributes: ["name"] }],
      }) || [];
      const countTransportations = await transportation.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Destinations Transportations Management");
      const module_id = await new ModulesController().getModuleIdByName("Destinations Transportations Management");
      const dataInti = { total: countTransportations, limit, page: Number(req.query.page), pages: Math.ceil(countTransportations / limit) + 1, data, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting transportations list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting transportation", err: "unexpected error" });
      const data = await transportation.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: driver, attributes: ["name"] }, { model: rentalCompany, attributes: ["name"] }],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Transportations Management");
      return res.render("dashboard/views/transportation/view.ejs", { title: "View Transportation Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get transportation data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const drivers = await new DriverController().getAllDrivers();
      const companies = await new RentalCompanyController().getAllRentalCompanies();
      return res.render("dashboard/views/transportation/new.ejs", { title: "Transportation new", drivers, companies });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get drivers or open new transportation page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNotNumbers = !Number(req.body.driver_id) || !Number(req.body.rental_company_id);
      const areNull = !req.body.name || !req.body.type;
      if (areNotNumbers || areNull) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await transportation.create(req.body);
      return res.status(httpStatus.OK).json({ msg: "New Transportation created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new transportation", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting transportation", err: "unexpected error" });
      const drivers = await new DriverController().getAllDrivers();
      const companies = await new RentalCompanyController().getAllRentalCompanies();
      const data = await transportation.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: driver, attributes: ["name"] }, { model: rentalCompany, attributes: ["name"] }],
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Destinations Transportations Management");
      return res.render("dashboard/views/transportation/edit.ejs", { title: "Edit Transportation", data, drivers, companies, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get transportation data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await transportation.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "transportation edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit transportation", err: "unexpected error" });
    }
  }
  public async getAllTransportations() {
    try {
      return await transportation.findAll({ attributes: ["id", "name", "type"], raw: true });
    } catch (error) {
      throw error;
    }
  }
}
