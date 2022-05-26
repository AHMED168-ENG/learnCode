import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import rentalCompany from "./rental-company.model";
const sequelize = new Sequelize(...config.database);
const offer = sequelize.define(
  "tbl_offers",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    en_name: { type: DataTypes.STRING, allowNull: false },
    ar_name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    rental_company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid rental company id. It should be an integer" } },
    },
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
    ar_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
offer.sync();
offer.belongsTo(rentalCompany, { foreignKey: "rental_company_id" });
export default offer;
