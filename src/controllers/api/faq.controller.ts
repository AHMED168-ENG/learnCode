import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import FAQ from "../../models/faq.model"
import submitQuestion from "../../models/submit-question.model"

export class FaqController extends Controller {
  constructor() {
    super()
  }
  list(req: Request, res: Response, next: NextFunction) {
    const question = req["lang"] == "en" ? "question_ar" : "question_ar"
    const answer = req["lang"] == "en" ? "answer_en" : "answer_ar"
    FAQ.findAll({
      attributes: [
        [question, "question"],
        [answer, "answer"],
      ],
    })
      .then((data) => {
        res.status(httpStatus.ACCEPTED).json(data)
      })
      .catch(() => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "error"})
      })
  }
  submitQuestion(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.user_id
    submitQuestion
      .create({user_id: userId, question: req.body.question})
      .then((data) => {
        res.status(httpStatus.ACCEPTED).json(data)
      })
      .catch(() => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "error"})
      })
  }
}
