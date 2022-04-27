import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import fs from "fs"
import path from "path"
import modules from "../../models/module.model"
import page from "../../models/page.model"
import permissions from "../../models/permissions.model"
const { verify } = require("../../helper/token")

export class TermsPolicyController {
  async viewPage(req: Request, res: Response, next: NextFunction) {
    const type = req.params.type
    const contentAr = fs.readFileSync(path.join(__dirname, `../../../assets/terms/ar/${type}`), "utf8")
    const contentEn = fs.readFileSync(path.join(__dirname, `../../../assets/terms/en/${type}`), "utf8")
    const payload = verify(req.cookies.token);
    const isHighestAdmin = payload.role_id === "0";
    let userPermissions, canEdit;
    if (!isHighestAdmin) {
      userPermissions = await permissions.findAll({
        where: { role_id: payload.role_id },
        attributes: { exclude: ["role_id", "page_id", "createdAt", "updatedAt"] },
        include: [{
          model: page,
          attributes: ["type"],
          include: [{ model: modules, attributes: ["name"] }],
        }],
      });
      const typeName = type === "terms" ? "Terms & Conditions" : type === "about" ? "About" : type === "policy" ? "Privacy Policy" : "";
      canEdit = userPermissions.filter((per) => per["tbl_page"]["type"] === "Edit" && per["tbl_page"]["tbl_module"]["name"] === typeName);
    }
    res.render("terms and policy/view.ejs", {
      title: `${type}`,
      data: {termsAr: contentAr, termsEn: contentEn},
      type: type,
      canEdit,
    })
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    const type = req.params.type
    const lang = req.query.lang
    const content = fs.readFileSync(path.join(__dirname, `../../../assets/terms/${lang}/${type}`), "utf8")
    res.render("terms and policy/edit.ejs", {
      title: `Edit ${type}`,
      data: {terms: content},
      type: type,
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const type = req.params.type
    const terms = req.body.code
    const lang = req.query.lang
    fs.writeFileSync(path.join(__dirname, `../../../assets/terms/${lang}/${type}`), terms.trim().replace(/\n/g, ""))
    res.status(httpStatus.OK).json({msg: "edited"})
  }
}
