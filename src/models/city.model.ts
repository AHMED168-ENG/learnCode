import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"
import country from "./country.model"

const sequelize = new Sequelize(...config.database)

const city = sequelize.define(
  "tbl_cities",
  {
    city_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    en_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    ar_name: {
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
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "Invalid country id. It should be an integer",
        },
      },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)
city.belongsTo(country, {foreignKey: "country_id"})
city.sync()

export default city
