import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import trees from "./trees.model";
import treeHeader from "./trees_headers.model";
const sequelize = new Sequelize(...config.database);
const treesBody = sequelize.define(
  "tbl_trees_body",
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    tree_id: { type: DataTypes.INTEGER, allowNull: false },
    header_id: { type: DataTypes.INTEGER, allowNull: false },
    ar_title: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    en_title: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    ar_value: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    en_value: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    icon: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  },
  { charset: "utf8", collate: "utf8_general_ci" }
);
treesBody.belongsTo(trees, { foreignKey: "tree_id" });
treesBody.belongsTo(treeHeader, { foreignKey: "header_id" });
treesBody.sync();
export default treesBody;
