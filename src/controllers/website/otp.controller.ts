import { Request, Response, NextFunction, response } from "express";
import httpStatus from "http-status";
import helpers from "../../helper/helpers";
import otpTypeModel from "../../models/otp-type.model";
import { Op } from "sequelize";
import sendMail from "../../middlewares/send-email.middleware";
import { UserController } from "../api/users.controller";
const { generateToken } = require("../../helper/token");
export class OTPController {
  public async sendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.query.emailORphone || !Number(req.query.user_id)) return res.status(httpStatus.BAD_REQUEST).json({ msg: "Bad Request" });
      const emailORphone = req.query.emailORphone as string;
      const isEmail = helpers.regularExprEmail(emailORphone);
      const otp = helpers.randomNumber(100000, 999999);
      const deletedOTP = await new OTPController().deleteOTP(emailORphone, Number(req.query.user_id));
      if (!deletedOTP) return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "unexpected error while deleting old otps" });
      const payload = { user_id: Number(req.query.user_id), value: otp, emailORphone: emailORphone, type: req.query.type, expiry: new Date(new Date().getTime() + 15 * 60000) };
      if (!payload.type) delete payload.type;
      const createdOTP = await new OTPController().createOTP(payload);
      if (!createdOTP) return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "Error while creating otp" });
      let data;
      if (isEmail) {
        sendMail([createdOTP["emailORphone"]], "Sahlan email verify", "otp", { emailORphone: createdOTP["emailORphone"], otp });
        data = { msg: "OTP Sent by Email, expire in 15 minutes", otp, user_id: createdOTP["user_id"], emailORphone: createdOTP["emailORphone"], type: createdOTP["type"] };
      } else data = { msg: "OTP Sent by phone, expire in 15 minutes", otp, user_id: createdOTP["user_id"], emailORphone: createdOTP["emailORphone"], type: createdOTP["type"] };
      return res.render("website/views/otp/new.ejs", { title: "OTP Page", data });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Can't send OTP number", err: error });
    }
  }
  public async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, otp, emailORphone, type } = req.body;
      const foundOtp = await new OTPController().getOTP(user_id, type);
      if (foundOtp["value"] != otp || foundOtp["emailORphone"] != emailORphone || foundOtp["is_used"] != "no" || foundOtp["expiry"] <= new Date()) {
        return res.status(httpStatus.NOT_ACCEPTABLE).json({ msg: "OTP is invalid", status: false });
      }
      await otpTypeModel.update({ is_used: "yes" }, { where: { user_id } });
      return res.status(httpStatus.ACCEPTED).json({ msg: "OTP is valid", token: generateToken({ user_id, type, emailORphone }), status: true });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Can't verify otp", err: error });
    }
  }
  public async getOTP(user_id: any, type: any) {
    try {
      if (type === "individual" || type === "entity") return await new UserController().getOTP(user_id);
      return await otpTypeModel.findOne({ where: { [Op.and]: [{ user_id }, { type }] } });
    } catch (error) {
      throw error;
    }
  }
  public async createOTP(payload: any) {
    try {
      if (!payload.user_id || !payload.type) return await new UserController().createOTP(payload);
      return await otpTypeModel.create(payload);
    } catch (error) {
      throw error;
    }
  }
  public async deleteOTP(emailORphone: string, user_id: number, type?: string) {
    try {
      if (!type) return await new UserController().deleteOTP(user_id, emailORphone);
      return await otpTypeModel.destroy({ where: { [Op.and]: [{ user_id }, { emailORphone }, { type }] } });
    } catch (error) {
      throw error;
    }
  }
}
