import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import webAppsUsers from "./user.model";
import events from "./event.model";
const sequelize = new Sequelize(...config.database);
const eventCart = sequelize.define(
  "tbl_event_cart",
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    event_id: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: { msg: "The event id must be an integer" } } },
    user_id: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: { msg: "The user id must be an integer" } } },
    qty: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: { msg: "The QTY must be an integer" } } },
  },
  { charset: "utf8", collate: "utf8_general_ci" }
)
eventCart.belongsTo(events, { foreignKey: "event_id" });
events.hasMany(eventCart, { foreignKey: "event_id" });
eventCart.belongsTo(webAppsUsers, { foreignKey: "user_id" });
eventCart.sync();
export default eventCart;
