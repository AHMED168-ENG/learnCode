import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import fs from "fs"
import path from "path"

export class TermsPolicyController {
  viewPage(req: Request, res: Response, next: NextFunction) {
    const type = req.params.type
    const content = fs.readFileSync(path.join(__dirname, `../../../assets/terms/${type}`), "utf8")
    res.render("terms and policy/view.ejs", {
      title: `${type}`,
      data: {terms: content},
      type: type,
    })
  }
  async editPage(req: Request, res: Response, next: NextFunction) {
    const type = req.params.type
    const content = fs.readFileSync(path.join(__dirname, `../../../assets/terms/${type}`), "utf8")
    res.render("terms and policy/edit.ejs", {
      title: `Edit ${type}`,
      data: {terms: content},
      type: type,
    })
  }
  edit(req, res: Response, next: NextFunction) {
    const type = req.params.type
    const terms = req.body.code
    fs.writeFileSync(path.join(__dirname, `../../../assets/terms/${type}`), terms.trim().replace(/\n/g, ""))
    res.status(httpStatus.OK).json({msg: "edited"})
  }
}
