import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import webAppsUsers from "./user.model";
const sequelize = new Sequelize(...config.database);
const favourite = sequelize.define(
  "tbl_favourites",
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    category: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    item_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, validate: { isInt: { msg: "Invalid initiative ID. It should only be an integer" } } },
    user_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, validate: { isInt: { msg: "Invalid user ID. It should only be an integer" } } },
    user_type: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  },
  { charset: "utf8", collate: "utf8_general_ci" }
);
favourite.belongsTo(webAppsUsers, { foreignKey: "user_id" });
favourite.sync();
export default favourite;
