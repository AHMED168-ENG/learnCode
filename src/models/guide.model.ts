import config from "../config/config";
import { Sequelize, DataTypes } from "sequelize";
import city from "./city.model";
const sequelize = new Sequelize(...config.database);
const guide = sequelize.define(
  "tbl_guides",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    username: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: true,
      defaultValue: null,
      validate: { isIn: { args: [["male", "female"]], msg: "Only male and female genders are allowed" } },
    },
    image: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null, validate: { len: [0, 500] } },
    file: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null, validate: { len: [0, 500] } },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      unique: true,
      validate: { isEmail: { msg: "Invalid email format" } },
    },
    phone: {
      type: DataTypes.STRING(25),
      allowNull: true,
      defaultValue: null,
      unique: true,
      validate: { len: { args: [0, 25], msg: "Phone numbers can not exceed 25 characters in length" } },
    },
    password: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    ar_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_description: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { isInt: { msg: "Invalid city id. It should be an integer" } },
    },
    status: {
      type: DataTypes.ENUM("active", "deactive"),
      allowNull: true,
      defaultValue: "active",
      validate: { isIn: { args: [["active", "deactive"]], msg: "Invalid status" } },
    },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
guide.sync();
guide.belongsTo(city, { foreignKey: "city_id" });
export default guide;
