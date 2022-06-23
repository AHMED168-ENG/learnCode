import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import helpers from "../../helper/helpers";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { ModulesController } from "../dashboard/modules.controller";
import driver from "../../models/driver.model";
import { RentalCompanyController } from "./rental-company.controller";
import rentalCompany from "../../models/rental-company.model";
export class DriverController {
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/driver/list.ejs", { title: "Car Drivers" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const data = await driver.findAll({
        limit,
        offset,
        attributes: { exclude: ["ar_about", "en_about", "createdAt", "updatedAt", "address"] },
      }) || [];
      const countCompanies = await driver.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Driver Management");
      const module_id = await new ModulesController().getModuleIdByName("Driver Management");
      const dataInti = { total: countCompanies, limit, page: Number(req.query.page), pages: Math.ceil(countCompanies / limit) + 1, data, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting drivers list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting driver", err: "unexpected error" });
      const data = await driver.findOne(
        { where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: true,
      });
      const module_id = await new ModulesController().getModuleIdByName("Driver Management");
      return res.render("dashboard/views/driver/view.ejs", { title: "View Car Driver Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get driver data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const companies = await new RentalCompanyController().getAllRentalCompanies();
      return res.render("dashboard/views/driver/new.ejs", { title: "Car Driver new", companies });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get driver new page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.name || !req.body.phone || !req.body.email;
      if (areNull || !helpers.regularExprEmail(req.body.email)) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const existedDriver = await driver.findOne({ where: { email: req.body.email } });
      if (existedDriver) return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "This email is already exists" });
      await driver.create(req.body);
      return res.status(httpStatus.CREATED).json({ msg: "New Car Driver created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new driver", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting driver", err: "unexpected error" });
      const data = await driver.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: true,
      });
      const companies = await new RentalCompanyController().getAllRentalCompanies();
      const module_id = await new ModulesController().getModuleIdByName("Driver Management");
      return res.render("dashboard/views/driver/edit.ejs", { title: "Edit Car Driver", data, module_id, companies });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get driver data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id || (req.body.email && !helpers.regularExprEmail(req.body.email))) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      if (helpers.regularExprEmail(req.body.email)) {
        const existedDriver = await driver.findOne({ where: { email: req.body.email } });
        if (existedDriver) return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "This email is already exists" });
      }
      await driver.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "driver edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit driver", err: "unexpected error" });
    }
  }
  public async getAllDrivers() {
    try {
      return await driver.findAll({ attributes: ["id", "name"], raw: true });
    } catch (error) {
      throw error;
    }
  }
}
