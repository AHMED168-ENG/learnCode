import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import destination from "./destination.model";
import eventCategory from "./event-category.model";
import city from "./city.model";
const sequelize = new Sequelize(...config.database);
const events = sequelize.define(
  "tbl_events",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    en_name: { type: DataTypes.STRING, allowNull: false },
    ar_name: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null, validate: { len: [0, 500] } },
    destination_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid destination id. It should be an integer" } },
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid city id. It should be an integer" } },
    },
    event_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid event category id. It should be an integer" } },
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
    audience: {
      type: DataTypes.ENUM("all", "+12", "+18"),
      allowNull: true,
      defaultValue: "all",
      validate: { isIn: { args: [["all", "+12", "+18"]], msg: "Invalid audience" } },
    },
    type: {
      type: DataTypes.ENUM("paid", "free"),
      allowNull: true,
      defaultValue: "paid",
      validate: { isIn: { args: [["paid", "free"]], msg: "Invalid event type" } },
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
events.sync();
events.belongsTo(destination, { foreignKey: "destination_id" });
events.belongsTo(eventCategory, { foreignKey: "event_category_id" });
events.belongsTo(city, { foreignKey: "city_id" });
export default events;
