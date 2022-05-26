import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import destination from "./destination.model";
import webAppsUsers from "./user.model";
import transportation from "./transportation.model";
const sequelize = new Sequelize(...config.database);
const trip = sequelize.define(
  "tbl_trips",
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid user id. It should be an integer" } },
    },
    transportation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid transportation id. It should be an integer" } },
    },
    length: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
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
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
trip.sync();
trip.belongsTo(destination, { foreignKey: "destination_id" });
trip.belongsTo(transportation, { foreignKey: "transportation_id" });
trip.belongsTo(webAppsUsers, { foreignKey: "user_id" });
export default trip;
