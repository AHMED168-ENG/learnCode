import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import initiativeLocations from "./initiative-location.model"

const sequelize = new Sequelize(...config.database)

const trees = sequelize.define(
  "tbl_trees",
  {
    tree_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ar_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      validate: {
        len: [0, 100],
      },
    },
    en_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      validate: {
        len: [0, 100],
      },
    },
    slug_en: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      validate: {
        len: [0, 100],
      },
    },
    slug_ar: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      validate: {
        len: [0, 100],
      },
    },
    img_tree: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
      validate: {
        len: [0, 500],
      },
    },
    ar_description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
    en_description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
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

trees.sync()

export default trees
