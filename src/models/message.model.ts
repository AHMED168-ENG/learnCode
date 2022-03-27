import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"

const sequelize = new Sequelize(...config.database)

const message = sequelize.define(
  "message",
  {
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Invalid associated user id",
        },
      },
    },
    subject: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("read", "unread"),
      allowNull: false,
      defaultValue: "unread",
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)
message.belongsTo(webAppsUsers, {foreignKey: "user_id"})
webAppsUsers.hasMany(message, {foreignKey: "user_id"})
message.sync()

export default message
