import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"
import city from "./city.model"
import country from "./country.model"

const sequelize = new Sequelize(...config.database)

const region = sequelize.define(
  "tbl_regions",
  {
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ar_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      validate: {
        len: [0, 150],
      },
    },
    en_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      validate: {
        len: [0, 150],
      },
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: true,
      },
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: true,
      },
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      defaultValue: null,
      validate: {
        isDecimal: true,
      },
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      defaultValue: null,
      validate: {
        isDecimal: true,
      },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)
region.belongsTo(city, {foreignKey: "city_id"})
region.belongsTo(country, {foreignKey: "country_id"})

region.sync()

export default region
