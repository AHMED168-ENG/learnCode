import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import modules from "./module.model";
const sequelize = new Sequelize(...config.database);
const album_video = sequelize.define(
    "tbl_album_videos",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
      video: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null, validate: { len: [0, 500] } },
      item_id: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: { msg: "Invalid item id. It should be an integer" } } },
      module_id: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: { msg: "Invalid module id. It should be an integer" } } },
    },
    { charset: "utf8", collate: "utf8_general_ci" },
);
album_video.belongsTo(modules, { foreignKey: "module_id" });
album_video.sync();
export default album_video;