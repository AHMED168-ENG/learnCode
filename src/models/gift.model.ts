import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"
import promo from "./promo.model"
import order from "./order.model"

const sequelize = new Sequelize(...config.database)

const gift = sequelize.define(
  "tbl_gift",
  {
    gift_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "Only be a number",
        },
      },
    },
    reciever: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    sender: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    occasion: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    mobile: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)

gift.hasOne(order, {foreignKey: "order_id"})
order.hasOne(gift, {foreignKey: "order_id"})

gift.sync()

export default gift
