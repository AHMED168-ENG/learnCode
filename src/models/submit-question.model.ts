import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"

const sequelize = new Sequelize(...config.database)

const submitQuestion = sequelize.define(
  "submit_question",
  {
    id: {
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
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)
submitQuestion.belongsTo(webAppsUsers, {foreignKey: "user_id"})
webAppsUsers.hasMany(submitQuestion, {foreignKey: "user_id"})
submitQuestion.sync()

export default submitQuestion
