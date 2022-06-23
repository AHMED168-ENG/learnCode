import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { UserPermissionsController } from "../dashboard/user-permissions.controller";
import { ModulesController } from "../dashboard/modules.controller";
import offer from "../../models/company-offers.model";
import rentalCompany from "../../models/rental-company.model";
import { RentalCompanyController } from "./rental-company.controller";
import helpers from "../../helper/helpers";
export class CompanyOfferController {
  public listPage(req: Request, res: Response, next: NextFunction) {
    return res.render("dashboard/views/company-offer/list.ejs", { title: "Company Offers" });
  }
  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) > 50 ? 50 : Number(req.query.limit);
      const offset = (Number(req.query.page) - 1) * limit;
      const data = await offer.findAll({
        limit,
        offset,
        where: { rental_company_id: req.params.rental_company_id },
        attributes: { exclude: ["ar_description", "en_description", "createdAt", "updatedAt", "from", "to"] },
        include: [{ model: rentalCompany, attributes: ["name"] }],
      }) || [];
      const countCompanyOffers = await offer.count() || 0;
      const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, "Company Offers Management");
      const module_id = await new ModulesController().getModuleIdByName("Company Offers Management");
      const dataInti = { total: countCompanyOffers, limit, page: Number(req.query.page), pages: Math.ceil(countCompanyOffers / limit) + 1, data, canAdd: permissions?.canAdd, canEdit: permissions?.canEdit, module_id, company_id: req.params.rental_company_id };
      return res.status(httpStatus.OK).json(dataInti);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json({ err: "There is something wrong while getting offers list", msg: "Internal Server Error" });
    }
  }
  public async viewPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(404).json({ msg: "Error in getting offer", err: "unexpected error" });
      const module_id = await new ModulesController().getModuleIdByName("Company Offers Management");
      const data = await offer.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: rentalCompany, attributes: ["name"] }],
        raw: true,
      });
      data['from'] = helpers.getFullTime(data['from']);
      data['to'] = helpers.getFullTime(data['to']);
      return res.render("dashboard/views/company-offer/view.ejs", { title: "View Company Offer Details", data, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get offer data in view page", err: "unexpected error" });
    }
  }
  public async newPage(req: Request, res: Response, next: NextFunction) {
    try {
      const companies = await new RentalCompanyController().getAllRentalCompanies();
      return res.render("dashboard/views/company-offer/new.ejs", { title: "Company Offer new", companies });
    } catch (error) {
      return res.status(500).json({ msg: "Can't get offer new page", err: error });
    }
  }
  public async addNew(req: Request, res: Response, next: NextFunction) {
    try {
      const areNull = !req.body.en_name || !req.body.ar_name || !req.body.rental_company_id || !req.body.from || !req.body.to || !req.body.price;
      if (areNull) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await offer.create(req.body);
      return res.status(httpStatus.CREATED).json({ msg: "New Company Offer created" });
    } catch (error) {
      return res.status(400).json({ msg: "Error in create new offer", err: "unexpected error" });
    }
  }
  public async editPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id || !req.params.rental_company_id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      const companies = await new RentalCompanyController().getAllRentalCompanies();
      const module_id = await new ModulesController().getModuleIdByName("Company Offers Management");
      const data = await offer.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, raw: true });
      data['from'] = helpers.getFullTime(data['from']);
      data['to'] = helpers.getFullTime(data['to']);
      return res.render("dashboard/views/company-offer/edit.ejs", { title: "Edit Company Offer", data, companies, module_id });
    } catch (error) {
      return res.status(500).json({ msg: "Error in get offer data in edit page", err: "unexpected error" });
    }
  }
  public async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) return res.status(400).json({ msg: "Bad Request", err: "unexpected error" });
      await offer.update(req.body, { where: { id: req.params.id } });
      return res.status(httpStatus.OK).json({ msg: "offer edited" });
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({msg: "Error in Edit offer", err: "unexpected error" });
    }
  }
}
