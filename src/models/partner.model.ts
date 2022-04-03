import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"
import partnerType from "./partner-type.model"

const sequelize = new Sequelize(...config.database)

const partner = sequelize.define(
  "tbl_partner",
  {
    id: {
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
    img: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)

partner.belongsTo(partnerType, {foreignKey: "type_id"})
partnerType.hasMany(partner, {foreignKey: "type_id"})

partner.sync()

export default partner
