import config from "../config/config";
import {Sequelize, DataTypes} from "sequelize";
import webAppsUsers from "./user.model";
import promo from "./promo.model";
const sequelize = new Sequelize(...config.database);
const ticket = sequelize.define(
  "tbl_tickets",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    en_name: { type: DataTypes.STRING, allowNull: false },
    ar_name: { type: DataTypes.STRING, allowNull: false },
    price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "The all sum id can only be a number",
        },
      },
    },
    ar_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    promo_code_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "The promo code id can only be a number",
        },
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "The user id must be an integer",
        },
      },
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
    status: {
      type: DataTypes.ENUM("new", "inprogress", "cancelled", "completed"),
      allowNull: true,
      defaultValue: "new",
      validate: {
        isIn: {
          args: [["new", "inprogress", "cancelled", "completed"]],
          msg: "Invalid status",
        },
      },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);
ticket.belongsTo(webAppsUsers, { foreignKey: "user_id" });
ticket.belongsTo(promo, { foreignKey: "promo_code_id" });
ticket.sync();
export default ticket;
