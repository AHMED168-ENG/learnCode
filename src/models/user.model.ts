import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import otpModel from "./otp.model"
import city from "./city.model"
import country from "./country.model"
import region from "./region.model"
import sector from "./sector.model"

const sequelize = new Sequelize(...config.database)

const webAppsUsers = sequelize.define(
  "web_apps_users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_type: {
      type: DataTypes.ENUM("individual", "entity"),
      allowNull: true,
      defaultValue: null,
      validate: {
        isIn: {
          args: [["individual", "entity"]],
          msg: "The user type field can only be either individual or entity",
        },
      },
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
    f_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: new RegExp(/^[a-zA-Z]+$/g),
          msg: "The provided first name should only contain valid english characters",
        },
        len: {
          args: [0, 255],
          msg: "First name length should be less than 255 characters",
        },
      },
    },
    l_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: new RegExp(/^[a-zA-Z]+$/g),
          msg: "The provided last name should only contain valid english characters",
        },
        len: {
          args: [0, 255],
          msg: "Last name length should be less than 255 characters",
        },
      },
    },
    entity_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      validate: {
        // is: {
        //   args: new RegExp(/^[a-zA-Z]+$/g),
        //   msg: "The provided entity name should only contain valid english characters",
        // },
        len: {
          args: [0, 150],
          msg: "entity name length should be less than 150 characters",
        },
      },
    },
    sector_id_pk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "The sector id can only be a number",
        },
      },
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: true,
      defaultValue: null,
      validate: {
        isIn: {
          args: [["male", "female"]],
          msg: "Only male and female genders are allowed",
        },
      },
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      validate: {
        isDate: {
          msg: "Invalid birth date",
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
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "The sector id can only be a number",
        },
      },
    },
    region_id_pk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "The region id can only be a number",
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
    user_pass: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    lang_prefer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "The sector id can only be a number",
        },
        len: {
          args: [1, 1],
          msg: "The sector id can only be of one digit",
        },
      },
    },
    user_img: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
      validate: {
        // Ensures that the image string is a valid base64 encoded
        is: {
          args: new RegExp("([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$"),
          msg: "Invalid base64 string",
        },
        len: {
          args: [0, 500],
          msg: "Image string is too big",
        },
      },
    },
    account_status: {
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
    deleted_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      validate: {
        isDate: {
          msg: "Invalid deleted date",
          args: true,
        },
      },
    },
    sahlan_gained_points: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
      validate: {
        isNumeric: {
          msg: "The sahlan gained points can only be a number",
        },
      },
    },
    carbon_gained_points: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
      validate: {
        isNumeric: {
          msg: "The carbon gained points can only be a number",
        },
      },
    },
    userSalt: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    google: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    apple: {
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

webAppsUsers.hasOne(otpModel, {foreignKey: "user_id"})
webAppsUsers.belongsTo(city, {foreignKey: "city_id"})
webAppsUsers.belongsTo(country, {foreignKey: "country_id"})
webAppsUsers.belongsTo(region, {foreignKey: "region_id_pk"})
webAppsUsers.belongsTo(sector, {foreignKey: "sector_id_pk"})

webAppsUsers.sync()

export default webAppsUsers
