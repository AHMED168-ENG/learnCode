import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import destination from "./destination.model";
import provider from "./provider.model";
const sequelize = new Sequelize(...config.database);
const packages = sequelize.define(
  "tbl_packages",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    en_name: { type: DataTypes.STRING, allowNull: false },
    ar_name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    days: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null, validate: { len: [0, 500] } },
    destination_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid destination id. It should be an integer" } },
    },
    provider_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: { isInt: { msg: "Invalid provider id. It should be an integer" } },
    },
    policy: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
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
packages.sync();
packages.belongsTo(destination, { foreignKey: "destination_id" });
packages.belongsTo(provider, { foreignKey: "provider_id" });
export default packages;
