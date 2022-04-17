import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import page from "./page.model";
const sequelize = new Sequelize(...config.database);
const permissions = sequelize.define(
    "tbl_permissions",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { isInt: { msg: "Invalid role id. It should be an integer" } },
      },
      page_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { isInt: { msg: "Invalid page id. It should be an integer" } },
      },
    },
    { charset: "utf8", collate: "utf8_general_ci" },
);
permissions.belongsTo(page, { foreignKey: "page_id" });
permissions.sync();
export default permissions;