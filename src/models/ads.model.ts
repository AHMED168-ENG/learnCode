import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize(...config.database);
const ads = sequelize.define(
  "tbl_ads",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    en_name: { type: DataTypes.STRING, allowNull: false },
    ar_name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
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
    current_lat: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      defaultValue: null,
      validate: { isDecimal: { msg: "The give latitude is not a valid decimal number" } },
    },
    current_long: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      defaultValue: null,
      validate: { isDecimal: { msg: "The give latitude is not a valid decimal number" } },
    },
    ar_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    from: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Invalid from date",
          args: true,
        },
      },
    },
    to: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Invalid to date",
          args: true,
        },
      },
    },
    request: {
      type: DataTypes.ENUM("new", "inprogress", "completed", "cancelled"),
      allowNull: true,
      defaultValue: "new",
      validate: { isIn: { args: [["new", "inprogress", "completed", "cancelled"]], msg: "Invalid status" } },
    },
    status: {
      type: DataTypes.ENUM("active", "deactive"),
      allowNull: true,
      defaultValue: "active",
      validate: { isIn: { args: [["active", "deactive"]], msg: "Invalid status" } },
    },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
ads.sync();
export default ads;
