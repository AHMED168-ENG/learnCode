import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"

const sequelize = new Sequelize(...config.database)

const country = sequelize.define(
  "tbl_countries",
  {
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ar_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    en_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: null,
      validate: {
        isAlphanumeric: {
          msg: "The country code is invalid",
        },
        len: {
          args: [0, 10],
          msg: "Country code length is invalid",
        },
      },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)

country.sync()

export default country
