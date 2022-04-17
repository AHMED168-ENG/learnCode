import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize(...config.database);
const role = sequelize.define(
  "tbl_user_roles",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  },
  { charset: "utf8", collate: "utf8_general_ci" }
);
role.sync();
export default role;
