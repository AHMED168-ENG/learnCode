import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import initiatives from "./initiative.model"
import initiativeTrees from "./initiative-trees.model"
import city from "./city.model"

const sequelize = new Sequelize(...config.database)

const initiativeLocations = sequelize.define(
  "tbl_initiatives_locations",
  {
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    location_nameEn: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    location_nameAr: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    aboutEn: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    aboutAr: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    location_address: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: /^[0-9]?[\u0000-~\u2000-\u206e](\s)?\p{Pd}\s?/,
          msg: "The provided location name should only contain english letters, numbers or punctuation",
        },
        len: {
          args: [0, 255],
          msg: "The location name length cannot exceed 255 characters",
        },
      },
    },
    location_lat: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      defaultValue: null,
      validate: {
        isDecimal: {
          msg: "The give latitude is not a valid decimal number",
        },
      },
    },
    location_long: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      defaultValue: null,
      validate: {
        isDecimal: {
          msg: "The give latitude is not a valid decimal number",
        },
      },
    },
    init_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "The initiative id is not a valid integer",
        },
      },
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "The sector id can only be a number",
        },
      },
    },
    caverArea: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
      defaultValue: null,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "The region id can only be a number",
        },
      },
    },
    location_status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: true,
      defaultValue: "active",
      validate: {
        isIn: {
          args: [["active", "inactive"]],
          msg: "Invalid location status. It can only be either active or inactive",
        },
      },
    },
    deleted: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
      defaultValue: "no",
      validate: {
        isIn: {
          args: [["yes", "no"]],
          msg: "Invalid location deleted state. It can only be either yes or no",
        },
      },
    },
  },

  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)
initiativeLocations.hasMany(initiativeTrees, {foreignKey: "location_id"})
initiativeTrees.belongsTo(initiativeLocations, {foreignKey: "location_id"})
initiativeLocations.belongsTo(city, {foreignKey: "city_id"})

initiativeLocations.sync()

export default initiativeLocations
