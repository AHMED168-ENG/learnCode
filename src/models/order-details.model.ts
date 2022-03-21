import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"
import promo from "./promo.model"
import order from "./order.model"
import initiatives from "./initiative.model"
import initiativeLocations from "./initiative-location.model"
import initiativeTrees from "./initiative-trees.model"

const sequelize = new Sequelize(...config.database)

const orderDetails = sequelize.define(
  "tbl_orders_details",
  {
    id: {
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
    initiative_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "Only be a number",
        },
      },
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "Only be a number",
        },
      },
    },
    tree_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "Only be a number",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "The quantity must be an integer",
        },
      },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)

orderDetails.belongsTo(order, {foreignKey: "order_id"})
order.hasMany(orderDetails, {foreignKey: "order_id"})
orderDetails.belongsTo(initiatives, {foreignKey: "initiative_id"})
orderDetails.belongsTo(initiativeLocations, {foreignKey: "location_id"})
orderDetails.belongsTo(initiativeTrees, {foreignKey: "tree_id"})

orderDetails.sync()

export default orderDetails
