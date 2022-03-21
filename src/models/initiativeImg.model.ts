import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"

const sequelize = new Sequelize(...config.database)

const initiativesImg = sequelize.define(
  "tbl_initiatives_imgs",
  {
    img_id: {
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
    img: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/,
          msg: "Invalid base64 image",
        },
      },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)

initiativesImg.sync()

export default initiativesImg
