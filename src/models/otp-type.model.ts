import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize(...config.database);
const otpTypeModel = sequelize.define(
  "otp",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: { msg: "Invalid associated user id" } } },
    type: { type: DataTypes.STRING(100), allowNull: false },
    emailORphone: { type: DataTypes.STRING(100), allowNull: false },
    value: { type: DataTypes.STRING(4), allowNull: false },
    is_used: { type: DataTypes.ENUM("yes", "no"), allowNull: false, defaultValue: "no" },
    expiry: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date(), validate: { isDate: { msg: "Invalid expiry date format", args: true } } },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
otpTypeModel.sync();
export default otpTypeModel;
