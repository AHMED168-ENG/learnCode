import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import destination from "./destination.model";
const sequelize = new Sequelize(...config.database);
const destinationStore = sequelize.define(
  "tbl_destination_stores",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    en_name: { type: DataTypes.STRING, allowNull: false },
    ar_name: { type: DataTypes.STRING, allowNull: false },
    logo: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null, validate: { len: [0, 500] } },
    destination_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid destination id. It should be an integer" } },
    },
    ar_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    status: {
      type: DataTypes.ENUM("active", "deactive"),
      allowNull: true,
      defaultValue: "active",
      validate: { isIn: { args: [["active", "deactive"]], msg: "Invalid status" } },
    },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
destinationStore.sync();
destinationStore.belongsTo(destination, { foreignKey: "destination_id" });
export default destinationStore;
