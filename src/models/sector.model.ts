import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"

const sequelize = new Sequelize(...config.database)

const sector = sequelize.define(
  "tbl_entity_sectors",
  {
    sector_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ar_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    en_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)

sector.sync()

export default sector
