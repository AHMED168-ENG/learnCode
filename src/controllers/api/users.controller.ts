import Controller from "./main.controller"
import {Request, Response, NextFunction} from "express"
import httpStatus from "http-status"
import bcrypt from "bcrypt"
import webAppsUsers from "../../models/user.model"
import helpers from "../../helper/helpers"
import IUser from "../../interfaces/user.interface"
import token from "../../helper/token"
import otpModel from "../../models/otp.model"
import sendMail from "../../middlewares/send-email.middleware"
import {Model, where} from "sequelize/types"
import {googleTokenInfo} from "../../middlewares/auth-google.middleware"
import {fbTokenInfo} from "../../middlewares/auth-fb.middleware"

export class UserController extends Controller {
  secretFields: string[] = ["user_pass", "userSalt", "updatedAt", "createdAt"]
  constructor() {
    super()
  }
  /**
   * Login method for normal USER
   * @param req { emailORphone , user_pass }
   * @param res 201 if login is done successfully , 500 if there is login problem
   * @param next
   */
  login(req: any, res: Response, next: NextFunction) {
    if (!helpers.checkFields(req.body, ["emailORphone", "user_pass"])) {
      res.status(httpStatus.BAD_REQUEST).json({msg: "require field is missing"})
    } else {
      const {emailORphone, user_pass} = req.body
      const conditionLogin = helpers.regularExprEmail(emailORphone) ? {email: emailORphone} : {phone: emailORphone}
      const isEmail = helpers.regularExprEmail(emailORphone) ? "emailVerified" : "phoneVerified"
      webAppsUsers
        .findOne({where: conditionLogin})
        .then((data) => {
          if (!data) {
            res.status(httpStatus.BAD_REQUEST).json({msg: "Can not found user by this Email or Phone"})
          } else {
            if (bcrypt.compareSync(user_pass, data["user_pass"] ? data["user_pass"] : "")) {
              if (data[isEmail] == 0) {
                res.status(httpStatus.BAD_REQUEST).json({isverified: false, user_id: data["user_id"]})
              } else if (data["fullName"] == null || data["fullName"].length == 0) {
                res
                  .status(httpStatus.BAD_REQUEST)
                  .json({isCompleted: false, type: data["user_type"], token: token.generateToken({user_id: data["user_id"], type: "normal"})})
              } else {
                const user: IUser = data.toJSON()
                delete user.user_pass
                delete user.userSalt
                delete user.createdAt
                delete user.updatedAt
                user["token"] = token.generateToken({user_id: user["user_id"], type: "normal"})
                res.status(httpStatus.ACCEPTED).json(user)
              }
            } else {
              res.status(httpStatus.BAD_REQUEST).json({msg: "password wrong"})
            }
          }
        })
        .catch((err) => res.status(httpStatus.BAD_REQUEST).json({msg: "There is while search for user", err: err.errors[0].message || "error"}))
    }
  }
  /**
   * Sign up method for normal user
   * @param req { type, emailORphone, user_pass }
   */
  signup(req: Request, res: Response, next: NextFunction) {
    if (!helpers.checkFields(req.body, ["user_type", "emailORphone", "user_pass"])) {
      res.status(httpStatus.BAD_REQUEST).json({msg: "require field is missing"})
    } else {
      const {user_type, emailORphone} = req.body
      const userSalt: string = bcrypt.genSaltSync(8)
      const user_pass: string = bcrypt.hashSync(req.body.user_pass, userSalt)
      const conditionLogin = helpers.regularExprEmail(emailORphone) ? {email: emailORphone} : {phone: emailORphone}
      const userData = {user_type, ...conditionLogin, user_pass, userSalt}
      const isEmail = helpers.regularExprEmail(emailORphone) ? "emailVerified" : "phoneVerified"
      webAppsUsers
        .findOne({where: conditionLogin})
        .then((data) => {
          if (!data) {
            webAppsUsers
              .create(userData)
              .then((dataCreated) => {
                const user: IUser = dataCreated.toJSON()
                delete user.user_pass
                delete user.userSalt
                delete user.createdAt
                delete user.updatedAt
                return res.status(httpStatus.CREATED).json(user)
              })
              .catch((err: object) => {
                if (err) {
                  res.status(httpStatus.BAD_REQUEST).json({msg: "Error while Sign up user", err: err["errors"][0]["message"]})
                }
              })
          } else {
            if (data[isEmail] == 0) {
              webAppsUsers
                .update({user_pass, userSalt}, {where: conditionLogin})
                .then(() => res.status(httpStatus.BAD_REQUEST).json({isverified: false, user_id: data["user_id"]}))
            } else if (data["fullName"] == null || data["fullName"].length == 0) {
              res
                .status(httpStatus.BAD_REQUEST)
                .json({isCompleted: false, type: data["user_type"], token: token.generateToken({user_id: data["user_id"], type: "normal"})})
            } else {
              res.status(httpStatus.BAD_REQUEST).json({msg: "user is found you can Login"})
            }
          }
        })
        .catch((err) => res.status(httpStatus.BAD_REQUEST).json({msg: "There is while search for user", err: err.errors[0].message || "error"}))
    }
  }
  sendOtp(req: Request, res: Response, next: NextFunction) {
    const {userId, emailORphone} = req.body
    const isEmail = helpers.regularExprEmail(emailORphone)
    // const otp = helpers.randomNumber(1000, 9999)
    const otp = "1111"
    otpModel
      .destroy({
        where: {
          user_id: userId,
        },
      })
      .then(() => {
        otpModel
          .create({user_id: userId, otp_value: otp, emailORphone: emailORphone, expiry: new Date(new Date().getTime() + 15 * 60000)})
          .then(() => {
            if (isEmail) {
              sendMail([emailORphone], "Sahlan email verify", "otp", {email: emailORphone, otp: otp})
              res.status(httpStatus.CREATED).json({msg: "OTP Sent by Email, expire in 15 minutes"})
            } else {
              return res.status(httpStatus.CREATED).json({msg: "OTP Sent by phone, expire in 15 minutes"})
            }
          })
          .catch((err) => {
            res.status(httpStatus.NOT_ACCEPTABLE).json({msg: "Error while create otp"})
          })
      })
  }
  /**
   * This method to verify otp
   * @param req OTP in body
   * @param res OTP is valid || invalid
   */
  verifyOtp(req: Request, res: Response, next: NextFunction) {
    const {userId, otp, emailORphone} = req.body
    const isEmail = helpers.regularExprEmail(emailORphone) ? {emailVerified: 1} : {phoneVerified: 1}
    otpModel
      .findOne({where: {user_id: userId}})
      .then((data) => {
        if (data["otp_value"] == otp && data["emailORphone"] == emailORphone && data["is_used"] == "no" && data["expiry"] > new Date()) {
          otpModel.update({is_used: "yes"}, {where: {user_id: userId}}).then(() => {
            webAppsUsers.update(isEmail, {where: {user_id: userId}})
            res.status(httpStatus.ACCEPTED).json({msg: "OTP is valid", token: token.generateToken({user_id: userId, type: "normal"}), status: true})
          })
        } else {
          res.status(httpStatus.NOT_ACCEPTABLE).json({msg: "OTP is invalid", status: false})
        }
      })
      .catch(() => res.status(httpStatus.BAD_REQUEST).json({msg: " error happened", status: false}))
  }
  /**
   * This method to reset password
   * @param req OTP, email,password in body
   * @param res true || false
   */
  resetPassword(req: Request, res: Response, next: NextFunction) {
    const {userId, otp, emailORphone, password} = req.body
    const userSalt: string = bcrypt.genSaltSync(8)
    const user_pass: string = bcrypt.hashSync(password, userSalt)
    const conditionLogin = helpers.regularExprEmail(emailORphone) ? {email: emailORphone} : {phone: emailORphone}
    const userData = {user_pass, userSalt}
    otpModel
      .findOne({where: {user_id: userId}})
      .then((data) => {
        if (data["otp_value"] == otp && data["emailORphone"] == emailORphone && data["is_used"] == "yes") {
          webAppsUsers.update(userData, {where: conditionLogin}).then(() => {
            otpModel.destroy({where: {user_id: userId}})
            res.status(httpStatus.ACCEPTED).json({msg: "password changed", status: true})
          })
        } else {
          res.status(httpStatus.BAD_REQUEST).json({msg: " error happened", status: false})
        }
      })
      .catch(() => res.status(httpStatus.BAD_REQUEST).json({msg: " error happened", status: false}))
  }
  changePassword(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.user_id
    const {oldPassword, password} = req.body
    const userSalt: string = bcrypt.genSaltSync(8)
    const user_pass: string = bcrypt.hashSync(password, userSalt)
    const userData = {user_pass, userSalt}
    webAppsUsers.findOne({where: {user_id: userId}, attributes: ["user_pass"]}).then((data) => {
      if (bcrypt.compareSync(oldPassword, data["user_pass"])) {
        webAppsUsers.update(userData, {where: {user_id: userId}}).then(() => {
          res.status(httpStatus.ACCEPTED).json({msg: "password changed", status: true})
        })
      } else {
        res.status(httpStatus.BAD_REQUEST).json({msg: "password wrong", status: false})
      }
    })
  }
  emailORphoneExisted(req: Request, res: Response, next: NextFunction) {
    const {emailORphone} = req.body
    if (!emailORphone || emailORphone == null || emailORphone == "") {
      res.status(httpStatus.BAD_REQUEST).json({msg: "require field is missing"})
    } else {
      const conditionLogin = helpers.regularExprEmail(emailORphone) ? {email: emailORphone} : {phone: emailORphone}
      webAppsUsers
        .findOne({where: conditionLogin, attributes: ["user_id"], raw: true})
        .then((data) => {
          if (!data) {
            res.status(httpStatus.BAD_REQUEST).json({msg: "not existed", status: false})
          } else {
            res.status(httpStatus.OK).json({user_id: data["user_id"], status: true})
          }
        })
        .catch(() => {
          res.status(httpStatus.BAD_REQUEST).json({msg: "not existed", status: false})
        })
    }
  }
  updateInfo(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.user_id
    delete req.body.user
    let body = req.body
    delete body.user_pass
    delete body.userSalt
    delete body.role_id
    delete body.email
    delete body.phone
    delete body.account_status
    webAppsUsers
      .update(body, {where: {user_id: userId}})
      .then((data) => {
        webAppsUsers.findOne({where: {user_id: userId}}).then((userData) => {
          const user: IUser = userData.toJSON()
          delete user.user_pass
          delete user.userSalt
          delete user.createdAt
          delete user.updatedAt
          res.status(httpStatus.ACCEPTED).json(user)
        })
      })
      .catch((err) => {
        res.status(httpStatus.BAD_REQUEST).json({msg: "error", err: err["errors"][0]["message"]})
      })
  }
  async homeData(lang: string, userId) {
    const ar_en = lang == "en" ? "en_name" : "ar_name"
    let data
    await webAppsUsers
      .findOne({where: {user_id: userId}, attributes: ["fullName", "carbon_gained_points", "sahlan_gained_points", "user_img"], raw: true})
      .then((d) => {
        if (!d) {
          data = null
        } else {
          data = d
        }
      })
      .catch((err) => {
        data = null
      })
    return data
  }
  /**
   * Google auth method for USER
   * @param req { tokenId }
   * @param res 201 if login is done successfully , 400 if there is login problem
   * @param next
   */
  async googleLogin(req: any, res: Response, next: NextFunction) {
    const tokenId = req.body.tokenId
    if (!helpers.checkFields(req.body, ["tokenId", "user_type"])) {
      res.status(httpStatus.BAD_REQUEST).json({msg: "require field is missing"})
    } else {
      // send req to google for check token
      const googleInfo = await googleTokenInfo(tokenId)
      if (googleInfo == null) {
        res.status(httpStatus.BAD_REQUEST).json({msg: "invalid token"})
      } else {
        const userData = {google: googleInfo.email, fullName: googleInfo.name, user_img: googleInfo.picture, emailVerified: 1}
        webAppsUsers.findOne({where: {email: googleInfo.email}, attributes: ["user_id", "google"], raw: true}).then((data) => {
          if (data) {
            webAppsUsers
              .update(userData, {where: {email: googleInfo.email}})
              .then((userUpdate) => {
                webAppsUsers
                  .findOne({where: {email: googleInfo.email}})
                  .then((userDataFind) => {
                    const user: IUser = userDataFind.toJSON()
                    delete user.user_pass
                    delete user.userSalt
                    delete user.createdAt
                    delete user.updatedAt
                    res.status(httpStatus.ACCEPTED).json({...user, token: token.generateToken({user_id: userDataFind["user_id"], type: "google"})})
                  })
                  .catch(() => res.status(httpStatus.BAD_REQUEST).json({msg: "error", code: 5226}))
              })
              .catch(() => res.status(httpStatus.BAD_REQUEST).json({msg: "error", code: 54586}))
          } else {
            webAppsUsers
              .create({...userData, email: googleInfo.email, user_type: req.body.user_type})
              .then((userCreated) => {
                webAppsUsers
                  .findOne({where: {email: googleInfo.email}})
                  .then((userDataFind) => {
                    const user: IUser = userDataFind.toJSON()
                    delete user.user_pass
                    delete user.userSalt
                    delete user.createdAt
                    delete user.updatedAt
                    res.status(httpStatus.ACCEPTED).json({...user, token: token.generateToken({user_id: userDataFind["user_id"], type: "google"})})
                  })
                  .catch(() => res.status(httpStatus.BAD_REQUEST).json({msg: "error", code: 46226}))
              })
              .catch((err) => {
                res.status(httpStatus.BAD_REQUEST).json({msg: "error", code: 47826})
                console.log(err)
              })
          }
        })
      }
    }
  }
  /**
   * Google auth method for USER
   * @param req { tokenId }
   * @param res 201 if login is done successfully , 400 if there is login problem
   * @param next
   */
  async facebookLogin(req: any, res: Response, next: NextFunction) {
    const tokenId = req.body.tokenId
    if (!helpers.checkFields(req.body, ["tokenId", "user_type"])) {
      res.status(httpStatus.BAD_REQUEST).json({msg: "require field is missing"})
    } else {
      // send req to fb for check token
      const fbInfo = await fbTokenInfo(tokenId)
      if (fbInfo == null) {
        res.status(httpStatus.BAD_REQUEST).json({msg: "invalid token"})
      } else {
        const userData = {
          facebook: fbInfo.id,
          fullName: fbInfo.name,
          user_img: `https://graph.facebook.com/${fbInfo.id}/picture?type=large`,
          emailVerified: 1,
        }
        const emailIfnotfound = fbInfo.email ? fbInfo.email : `${fbInfo.id}@facebook.com`
        webAppsUsers.findOne({where: {email: emailIfnotfound}, attributes: ["user_id", "facebook"], raw: true}).then((data) => {
          if (data) {
            webAppsUsers
              .update(userData, {where: {email: emailIfnotfound}})
              .then((userUpdate) => {
                webAppsUsers
                  .findOne({where: {email: emailIfnotfound}})
                  .then((userDataFind) => {
                    const user: IUser = userDataFind.toJSON()
                    delete user.user_pass
                    delete user.userSalt
                    delete user.createdAt
                    delete user.updatedAt
                    res.status(httpStatus.ACCEPTED).json({...user, token: token.generateToken({user_id: userDataFind["user_id"], type: "facebook"})})
                  })
                  .catch(() => res.status(httpStatus.BAD_REQUEST).json({msg: "error", code: 5226}))
              })
              .catch(() => res.status(httpStatus.BAD_REQUEST).json({msg: "error", code: 54586}))
          } else {
            webAppsUsers
              .create({...userData, email: emailIfnotfound, user_type: req.body.user_type})
              .then((userCreated) => {
                webAppsUsers
                  .findOne({where: {email: emailIfnotfound}})
                  .then((userDataFind) => {
                    const user: IUser = userDataFind.toJSON()
                    delete user.user_pass
                    delete user.userSalt
                    delete user.createdAt
                    delete user.updatedAt
                    res.status(httpStatus.ACCEPTED).json({...user, token: token.generateToken({user_id: userDataFind["user_id"], type: "facebook"})})
                  })
                  .catch(() => res.status(httpStatus.BAD_REQUEST).json({msg: "error", code: 46226}))
              })
              .catch((err) => res.status(httpStatus.BAD_REQUEST).json({msg: "error", code: 47826}))
          }
        })
      }
    }
  }
}
