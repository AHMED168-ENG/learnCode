import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"

const sequelize = new Sequelize(...config.database)

const message = sequelize.define(
  "message",
  {
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: true,
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
message.sync()

export default message
