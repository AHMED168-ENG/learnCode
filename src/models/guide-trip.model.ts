import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import guide from "./guide.model";
import trip from "./trip.model";
const sequelize = new Sequelize(...config.database);
const guideTrip = sequelize.define(
  "tbl_guide_trips",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    guide_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid guide id. It should be an integer" } },
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid trip id. It should be an integer" } },
    },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
guideTrip.sync();
guideTrip.belongsTo(guide, { foreignKey: "guide_id" });
guideTrip.belongsTo(trip, { foreignKey: "trip_id" });
export default guideTrip;
