import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"

const sequelize = new Sequelize(...config.database)

const FAQ = sequelize.define(
  "tbl_faq",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    question_ar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    question_en: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    answer_ar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    answer_en: {
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

FAQ.sync()

export default FAQ
