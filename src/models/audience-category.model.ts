import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize(...config.database);
const audienceCategory = sequelize.define(
    "tbl_audience_categories",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
      ar_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      en_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    },
    { charset: "utf8", collate: "utf8_general_ci" },
);
audienceCategory.sync();
export default audienceCategory;