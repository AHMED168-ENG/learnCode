import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import webAppsUsers from "./user.model";
import trip from "./trip.model";
const sequelize = new Sequelize(...config.database);
const tripCart = sequelize.define(
  "tbl_trip_cart",
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    trip_id: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: { msg: "The trip id must be an integer" } } },
    user_id: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: { msg: "The user id must be an integer" } } },
    qty: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: { msg: "The QTY must be an integer" } } },
  },
  { charset: "utf8", collate: "utf8_general_ci" }
)
tripCart.belongsTo(trip, { foreignKey: "trip_id" });
trip.hasMany(tripCart, { foreignKey: "trip_id" });
tripCart.belongsTo(webAppsUsers, { foreignKey: "user_id" });
tripCart.sync();
export default tripCart;
