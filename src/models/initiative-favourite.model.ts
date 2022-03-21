import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import initiatives from "./initiative.model"
import webAppsUsers from "./user.model"

const sequelize = new Sequelize(...config.database)

const favouriteInitiative = sequelize.define(
  "tbl_initiatives_favourites",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    init_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "Invalid initiative ID. It should only be an integer",
        },
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "Invalid user ID. It should only be an integer",
        },
      },
    },
  },

  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)
favouriteInitiative.belongsTo(webAppsUsers, {foreignKey: "user_id"})

favouriteInitiative.sync()

export default favouriteInitiative
