import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import initiativeLocations from "./initiative-location.model"
import city from "./city.model"
import sponser from "./sponser.model"
import region from "./region.model"
import initiativesImg from "./initiativeImg.model"
import favouriteInitiative from "./initiative-favourite.model"
import initiativeTrees from "./initiative-trees.model"

const sequelize = new Sequelize(...config.database)

const initiatives = sequelize.define(
  "tbl_initiatives",
  {
    init_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    init_ar_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    slug_ar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    init_en_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    slug_en: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    init_ar_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    init_en_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      validate: {
        isDate: {
          msg: "Invalid from date",
          args: true,
        },
      },
    },
    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      validate: {
        isDate: {
          msg: "Invalid to date",
          args: true,
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

    region_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "Invalid region id",
        },
      },
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    sponsor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "Invalid sponsor id",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: {
          args: [["active", "inactive"]],
          msg: "Invalid status. The status value should be either active or inactive",
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
          msg: "Invalid deleted value. It should be either yes or no",
        },
      },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)
initiatives.hasMany(initiativeLocations, {foreignKey: "init_id"})
initiatives.hasMany(initiativesImg, {foreignKey: "init_id"})
initiativeLocations.belongsTo(initiatives, {foreignKey: "init_id"})
initiatives.belongsTo(city, {foreignKey: "city_id"})
initiatives.belongsTo(region, {foreignKey: "region_id"})
initiatives.belongsTo(sponser, {foreignKey: "sponsor_id"})
initiatives.hasMany(favouriteInitiative, {foreignKey: "init_id"})
// initiatives.hasMany(initiativeTrees, {foreignKey: "init_id_pk"})

initiatives.sync()

export default initiatives
