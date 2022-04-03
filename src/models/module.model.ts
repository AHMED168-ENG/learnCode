import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize(...config.database);
const modules = sequelize.define(
    "tbl_modules",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    },
    { charset: "utf8", collate: "utf8_general_ci" },
);
modules.sync();
export default modules;