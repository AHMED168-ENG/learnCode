import config from "../config/config";
import {Sequelize, DataTypes} from "sequelize";
const sequelize = new Sequelize(...config.database);
const ticket = sequelize.define(
  "tbl_tickets",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    en_name: { type: DataTypes.STRING, allowNull: false },
    ar_name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(18, 2), allowNull: true, defaultValue: null, validate: { isNumeric: { msg: "The price can only be a number" } } },
    quantity: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, validate: { isNumeric: { msg: "The quantity can only be a number" } } },
    ar_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
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
ticket.sync();
export default ticket;
