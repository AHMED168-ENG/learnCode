import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import activity from "./activity.model";
import trip from "./trip.model";
const sequelize = new Sequelize(...config.database);
const tripActivity = sequelize.define(
  "tbl_trip_activity",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    activity_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, validate: { isInt: { msg: "Invalid activity id. It should be an integer" } } },
    trip_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, validate: { isInt: { msg: "Invalid trip id. It should be an integer" } } },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
tripActivity.sync();
tripActivity.belongsTo(activity, { foreignKey: "activity_id" });
tripActivity.belongsTo(trip, { foreignKey: "trip_id" });
export default tripActivity;
