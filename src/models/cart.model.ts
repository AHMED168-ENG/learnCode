import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import initiativeLocations from "./initiative-location.model"
import initiativeTrees from "./initiative-trees.model"
import webAppsUsers from "./user.model"
import trees from "./trees.model"

const sequelize = new Sequelize(...config.database)

const cart = sequelize.define(
  "tbl_cart",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tree_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "The tree id must be an integer",
        },
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "The user id must be an integer",
        },
      },
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "The QTY must be an integer",
        },
      },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)
cart.belongsTo(initiativeTrees, {foreignKey: "tree_id"})
initiativeTrees.hasMany(cart, {foreignKey: "tree_id"})
cart.belongsTo(webAppsUsers, {foreignKey: "user_id"})
cart.sync()

export default cart
