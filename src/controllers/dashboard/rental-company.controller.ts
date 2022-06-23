import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import helpers from "../../helper/helpers";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { ModulesController } from "../dashboard/modules.controller";
import rentalCompany from "../../models/rental-company.model";
export class RentalCompanyController {
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/rental-company/list.ejs", { title: "Car Rental Companies" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const data = await rentalCompany.findAll({
        limit,
        offset,
        attributes: { exclude: ["ar_about", "en_about", "createdAt", "updatedAt", "address"] },
      }) || [];
      const countCompanies = await rentalCompany.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Rental Company Management");
      const module_id = await new ModulesController().getModuleIdByName("Rental Company Management");
      const dataInti = { total: countCompanies, limit, page: Number(req.query.page), pages: Math.ceil(countCompanies / limit) + 1, data, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit, module_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting rental companies list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting rental company", err: "unexpected error" });
      const data = await rentalCompany.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Rental Company Management");
      return res.render("dashboard/views/rental-company/view.ejs", { title: "View Car Rental Company Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get rental company data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render("dashboard/views/rental-company/new.ejs", { title: "Car Rental Company new" });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get rental company new page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.name || !req.body.phone || !req.body.email;
      if (areNull || !helpers.regularExprEmail(req.body.email)) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const existedCompany = await rentalCompany.findOne({ where: { email: req.body.email } });
      if (existedCompany) return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "This email is already exists" });
      await rentalCompany.create(req.body);
      return res.status(httpStatus.CREATED).json({ msg: "New Car Rental Company created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new rental company", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting rental company", err: "unexpected error" });
      const data = await rentalCompany.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      const module_id = await new ModulesController().getModuleIdByName("Rental Company Management");
      return res.render("dashboard/views/rental-company/edit.ejs", { title: "Edit Car Rental Company", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get rental company data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id || (req.body.email && !helpers.regularExprEmail(req.body.email))) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      if (req.body.email) {
        const existedCompany = await rentalCompany.findOne({ where: { email: req.body.email } });
        if (existedCompany) return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "This email is already exists" });
      }
      await rentalCompany.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "rental company edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit rental company", err: "unexpected error" });
    }
  }
  public async getAllRentalCompanies() {
    try {
      return await rentalCompany.findAll({ attributes: ["id", "name"], raw: true });
    } catch (error) {
      throw error;
    }
  }
}
