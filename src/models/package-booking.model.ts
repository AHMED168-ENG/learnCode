import config from "../config/config";
import {Sequelize, DataTypes} from "sequelize";
import webAppsUsers from "./user.model";
import promo from "./promo.model";
import packages from "./package.model";
const sequelize = new Sequelize(...config.database);
const packageBooking = sequelize.define(
  "tbl_package_bookings",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATE, allowNull: false, validate: { isDate: { msg: "Invalid date", args: true } } },
    total: { type: DataTypes.DECIMAL(18, 2), allowNull: true, defaultValue: null, validate: { isNumeric: { msg: "The total id can only be a number" } } },
    ar_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    promo_code_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, validate: { isNumeric: { msg: "The promo code id can only be a number" } } },
    user_id: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: { msg: "The user id must be an integer" } } },
    package_id: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: { msg: "The package id must be an integer" } } },
    pay_type: {
      type: DataTypes.ENUM("cash", "online"),
      allowNull: true,
      defaultValue: "cash",
      validate: { isIn: { args: [["cash", "online"]], msg: "The pay type field can only be either cash or online" } },
    },
    location_lat: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      defaultValue: null,
      validate: { isDecimal: { msg: "The give latitude is not a valid decimal number" } },
    },
    location_long: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      defaultValue: null,
      validate: { isDecimal: { msg: "The give latitude is not a valid decimal number" } },
    },
    request: {
      type: DataTypes.ENUM("new", "inprogress", "cancelled", "completed"),
      allowNull: true,
      defaultValue: "new",
      validate: { isIn: { args: [["new", "inprogress", "cancelled", "completed"]], msg: "Invalid status" } },
    },
    status: {
      type: DataTypes.ENUM("active", "deactive"),
      allowNull: true,
      defaultValue: "active",
      validate: { isIn: { args: [["active", "deactive"]], msg: "Invalid status" } },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);
packageBooking.belongsTo(webAppsUsers, { foreignKey: "user_id" });
packageBooking.belongsTo(promo, { foreignKey: "promo_code_id" });
packageBooking.belongsTo(packages, { foreignKey: "package_id" });
packageBooking.sync();
export default packageBooking;
