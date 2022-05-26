import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import hotel from "./hotel.model";
const sequelize = new Sequelize(...config.database);
const roomAmenities = sequelize.define(
  "tbl_room_amenities",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    hotel_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, validate: { isInt: { msg: "Invalid hotel id. It should be an integer" } } },
    en_name: { type: DataTypes.STRING, allowNull: false },
    ar_name: { type: DataTypes.STRING, allowNull: false },
    ar_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
roomAmenities.sync();
roomAmenities.belongsTo(hotel, { foreignKey: "hotel_id" });
export default roomAmenities;
