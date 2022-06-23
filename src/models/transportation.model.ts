import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import rentalCompany from "./rental-company.model";
import driver from "./driver.model";
const sequelize = new Sequelize(...config.database);
const transportation = sequelize.define(
  "tbl_transportations",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    type: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    rental_company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid rental company id. It should be an integer" } },
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid driver id. It should be an integer" } },
    },
    ar_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
transportation.sync();
transportation.belongsTo(rentalCompany, { foreignKey: "rental_company_id" });
transportation.belongsTo(driver, { foreignKey: "driver_id" });
export default transportation;
