import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize(...config.database);
const activityCategory = sequelize.define(
    "tbl_activity_categories",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
      ar_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      en_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    },
    { charset: "utf8", collate: "utf8_general_ci" },
);
activityCategory.sync();
export default activityCategory;