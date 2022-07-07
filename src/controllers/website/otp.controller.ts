import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import helpers from "../../helper/helpers";
import otpTypeModel from "../../models/otp-type.model";
import { Op } from "sequelize";
import sendMail from "../../middlewares/send-email.middleware";
const { generateToken } = require("../../helper/token");
export class OTPController {
  public async getOtpPage(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render("website/views/otp/new.ejs", { title: "OTP Page" });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Can't get OTP page", err: error });
    }
  }
  public async sendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, emailORphone, type } = req.body;
      const isEmail = helpers.regularExprEmail(emailORphone);
      const otp = helpers.randomNumber(1000, 9999);
      const deletedOTP = await new OTPController().deleteOTP(user_id, type);
      if (!!deletedOTP) {
        const createdOTP = await otpTypeModel.create({ user_id, value: otp, emailORphone, type, expiry: new Date(new Date().getTime() + 15 * 60000) });
        if (!createdOTP) return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "Error while create otp" });
        else {
          if (isEmail) {
            sendMail([emailORphone], "Sahlan email verify", "otp", { email: emailORphone, otp });
            return res.status(httpStatus.CREATED).json({ msg: "OTP Sent by Email, expire in 15 minutes" });
          } else {
            return res.status(httpStatus.CREATED).json({ msg: "OTP Sent by phone, expire in 15 minutes" });
          }
        }
      }
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Can't send OTP number", err: error });
    }
  }
  public async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, otp, emailORphone, type } = req.body;
      const isEmail = helpers.regularExprEmail(emailORphone) ? { emailVerified: 1 } : { phoneVerified: 1 };
      const foundOtp = await new OTPController().getOTP(user_id, type);
      if (isEmail && foundOtp["value"] == otp && foundOtp["emailORphone"] == emailORphone && foundOtp["is_used"] == "no" && foundOtp["expiry"] > new Date()) {
        await otpTypeModel.update({ is_used: "yes" }, { where: { user_id } });
        return res.status(httpStatus.ACCEPTED).json({ msg: "OTP is valid", token: generateToken({ user_id, type }), status: true });
      } else {
        return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "OTP is invalid", status: false });
      }
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Can't verify otp", err: error });
    }
  }
  public async getOTP(user_id: any, type: any) {
    try {
      return await otpTypeModel.findOne({ where: { [Op.and]: [{ user_id }, { type }] } });
    } catch (error) {
      throw error;
    }
  }
  public async deleteOTP(user_id: any, type: any) {
    try {
      return await otpTypeModel.destroy({ where: { [Op.and]: [{ user_id }, { type }] } });
    } catch (error) {
      throw error;
    }
  }
}
