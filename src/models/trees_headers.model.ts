import config from "../config/config"
import { Sequelize, DataTypes } from "sequelize"
const sequelize = new Sequelize(...config.database)
const treeHeader = sequelize.define(
  "tbl_trees_headers",
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    ar_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    en_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
treeHeader.sync();
export default treeHeader;
