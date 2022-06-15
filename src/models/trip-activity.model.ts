import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import trip from "./trip.model";
import activity from "./activity.model";
const sequelize = new Sequelize(...config.database);
const tripActivity = sequelize.define(
  "tbl_trip_activities",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    trip_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, validate: { isInt: { msg: "Invalid trip id. It should be an integer" } } },
    activity_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, validate: { isInt: { msg: "Invalid activity id. It should be an integer" } } },
    day: { type: DataTypes.DATE, allowNull: false, validate: { isDate: { msg: "Invalid day date", args: true } } },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
tripActivity.sync();
tripActivity.belongsTo(trip, { foreignKey: "trip_id" });
tripActivity.belongsTo(activity, { foreignKey: "activity_id" });
export default tripActivity;
