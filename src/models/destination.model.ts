import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize(...config.database);
const destination = sequelize.define(
  "tbl_destinations",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    en_title: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    ar_title: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    image: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null, validate: { len: [0, 500] } },
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
    file: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null, validate: { len: [0, 500] } },
    ar_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    ar_when_visit: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_when_visit: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    ar_what_wear: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_what_wear: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    ar_trans_desc: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_trans_desc: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    ar_travel_regulation: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_travel_regulation: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
destination.sync();
export default destination;
