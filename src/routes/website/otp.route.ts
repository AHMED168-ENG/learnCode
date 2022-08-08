import { Router } from "express";
import { OTPController } from "../../controllers/website/otp.controller";
export class OTPRoutes {
  public router: Router;
  public otpController: OTPController = new OTPController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/", this.otpController.sendOTP);
    this.router.post("/verifyOtp", this.otpController.verifyOTP);
  }
}
