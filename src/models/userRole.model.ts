import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import page from "./page.model"
const sequelize = new Sequelize(...config.database)
const userRole = sequelize.define(
  "tbl_userRoles",
  {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: true, defaultValue: null},
  },
  {charset: "utf8", collate: "utf8_general_ci"}
)
userRole.belongsToMany(page, {through: "actionPages"})
page.belongsToMany(userRole, {through: "actionPages"})

userRole.sync()
export default userRole
