import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import role from "./user-roles.model"

const sequelize = new Sequelize(...config.database)

const admin = sequelize.define(
  "admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isNumeric: {
          msg: "The role id can only be a number",
        },
        len: {
          args: [1, 1],
          msg: "The role id can only be of one digit",
        },
      },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        len: {
          args: [0, 255],
          msg: "First name length should be less than 255 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid email format",
        },
      },
    },
    phone: {
      type: DataTypes.STRING(25),
      allowNull: true,
      defaultValue: null,
      unique: true,
      validate: {
        len: {
          args: [0, 25],
          msg: "Phone numbers can not exceed 25 characters in length",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: true,
      defaultValue: "active",
      validate: {
        isIn: {
          args: [["active", "inactive"]],
          msg: "Account status can only be either active or inactive",
        },
      },
    },
    deleted: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: false,
      defaultValue: "no",
      validate: {
        isIn: {
          args: [["yes", "no"]],
          msg: "Deleted should only hold yse or no values",
        },
      },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)
admin.sync()
admin.belongsTo(role, {foreignKey: "role_id"})
export default admin
