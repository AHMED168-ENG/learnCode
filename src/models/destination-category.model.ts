import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize(...config.database);
const destinationCategory = sequelize.define(
    "tbl_destination_categories",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
      ar_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      en_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    },
    { charset: "utf8", collate: "utf8_general_ci" },
);
destinationCategory.sync();
export default destinationCategory;