import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import webAppsUsers from "./user.model";
import guide from "./guide.model";
const sequelize = new Sequelize(...config.database);
const guideMessage = sequelize.define(
  "tbl_guide_messages",
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    message: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    guide_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, validate: { isInt: { msg: "Invalid initiative ID. It should only be an integer" } } },
    user_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, validate: { isInt: { msg: "Invalid user ID. It should only be an integer" } } },
  },
  { charset: "utf8", collate: "utf8_general_ci" }
);
guideMessage.belongsTo(guide, { foreignKey: "guide_id" });
guideMessage.belongsTo(webAppsUsers, { foreignKey: "user_id" });
guideMessage.sync();
export default guideMessage;
