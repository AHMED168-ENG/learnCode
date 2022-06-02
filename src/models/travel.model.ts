import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize(...config.database);
const essentials = sequelize.define(
  "tbl_essentials",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    en_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    ar_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    en_text: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    ar_text: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    file: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null, validate: { len: [0, 500] } },
    ar_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
essentials.sync();
export default essentials;
