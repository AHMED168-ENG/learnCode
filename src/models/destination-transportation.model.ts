import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import destination from "./destination.model";
import transportation from "./transportation.model";
const sequelize = new Sequelize(...config.database);
const destinationTransportation = sequelize.define(
    "tbl_destination_transportations",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
      destination_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { isInt: { msg: "Invalid role id. It should be an integer" } },
      },
      transportation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { isInt: { msg: "Invalid page id. It should be an integer" } },
      },
    },
    { charset: "utf8", collate: "utf8_general_ci" },
);
destinationTransportation.belongsTo(transportation, { foreignKey: "transportation_id" });
destinationTransportation.belongsTo(destination, { foreignKey: "destination_id" });
destinationTransportation.sync();
export default destinationTransportation;