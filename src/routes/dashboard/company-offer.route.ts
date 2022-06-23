import { Router } from "express";
import { CompanyOfferController } from "../../controllers/dashboard/company-offer.controller";
export class CompanyOfferRoutes {
  public router: Router;
  public companyOfferController: CompanyOfferController = new CompanyOfferController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/:rental_company_id/", this.companyOfferController.listPage);
    this.router.get("/:rental_company_id/list", this.companyOfferController.list);
    this.router.get("/:rental_company_id/view/:id", this.companyOfferController.viewPage);
    this.router.get("/:rental_company_id/new", this.companyOfferController.newPage);
    this.router.post("/:rental_company_id/new", this.companyOfferController.addNew);
    this.router.get("/:rental_company_id/edit/:id", this.companyOfferController.editPage);
    this.router.put("/:rental_company_id/edit/:id", this.companyOfferController.edit);
  }
}
