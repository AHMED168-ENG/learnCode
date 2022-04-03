import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import module from "./module.model";
const sequelize = new Sequelize(...config.database);
const page = sequelize.define(
    "tbl_pages",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { isInt: { msg: "Invalid module id. It should be an integer" } },
      },
      type: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      link: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      // permission: {
      //   type: DataTypes.ENUM(Permission.ADD, Permission.EDIT, Permission.VIEW, Permission.DELETE),
      //   allowNull: true,
      //   defaultValue: null,
      // },
    },
    { charset: "utf8", collate: "utf8_general_ci" },
);
page.belongsTo(module, { foreignKey: "module_id" });
module.hasMany(page, { foreignKey: "module_id" });
page.sync();
export default page;