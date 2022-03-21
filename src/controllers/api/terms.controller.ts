import {Request, Response, NextFunction} from "express"
import fs from "fs"
import path from "path"

export class TermsPolicyController {
  view(req: Request, res: Response, next: NextFunction) {
    const type = req.params.type
    const content = fs.readFileSync(path.join(__dirname, `../../../assets/terms/${type}`), "utf8")
    res.status(200).json({data: content})
  }
}
