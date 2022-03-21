import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"

const sequelize = new Sequelize(...config.database)

const sponser = sequelize.define(
  "tbl_sponsers",
  {
    sponser_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    sponser_name: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      unique: true,
      defaultValue: null,
      validate: {
        isEmail: true,
        len: [0, 150],
      },
    },
    phone: {
      type: DataTypes.STRING(25),
      allowNull: true,
      defaultValue: null,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: [["active", "inactive"]],
      },
    },
    deleted: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: false,
      defaultValue: "no",
      validate: {
        isIn: [["yes", "no"]],
      },
    },
  },

  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)

sponser.sync()

export default sponser
