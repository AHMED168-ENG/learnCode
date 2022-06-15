import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import fs from "fs"
import path from "path"
import { UserPermissionsController } from "./user-permissions.controller"

export class TermsPolicyController {
  async viewPage(req: Request, res: Response, next: NextFunction) {
    const type = req.params.type
    const contentAr = fs.readFileSync(path.join(__dirname, `../../../assets/terms/ar/${type}`), "utf8")
    const contentEn = fs.readFileSync(path.join(__dirname, `../../../assets/terms/en/${type}`), "utf8")
    const typeName = type === "terms" ? "Terms & Conditions" : type === "about" ? "About" : type === "policy" ? "Privacy Policy" : "";
    const permissions = await new UserPermissionsController().getUserPermissions(req.cookies.token, typeName);
    res.render("dashboard/views/terms and policy/view.ejs", {
      title: `${type}`,
      data: {termsAr: contentAr, termsEn: contentEn},
      type: type,
      canEdit: permissions.canEdit,
    })
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    const type = req.params.type
    const lang = req.query.lang
    const content = fs.readFileSync(path.join(__dirname, `../../../assets/terms/${lang}/${type}`), "utf8")
    res.render("dashboard/views/terms and policy/edit.ejs", {
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
