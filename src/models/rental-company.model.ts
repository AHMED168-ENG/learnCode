import config from "../config/config";
import { Sequelize, DataTypes} from "sequelize";
const sequelize = new Sequelize(...config.database);
const rentalCompany = sequelize.define(
  "tbl_rental_companies",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    email: { type: DataTypes.STRING, allowNull: true, defaultValue: null, unique: true, validate: { isEmail: { msg: "Invalid email format" } } },
    phone: { type: DataTypes.STRING(25), allowNull: true, defaultValue: null, unique: true, validate: { len: { args: [0, 25], msg: "Phone numbers can not exceed 25 characters in length" } } },
    address: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    ar_about: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    en_about: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
  },
  { charset: "utf8", collate: "utf8_general_ci" },
);
rentalCompany.sync();
export default rentalCompany;
