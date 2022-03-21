import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"

const sequelize = new Sequelize(...config.database)

const promo = sequelize.define(
  "tbl_promo_codes",
  {
    promo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    promo_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    num_of_uses: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      validate: {
        isNumeric: {
          msg: "Number of uses should only be an integer",
        },
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "The user id must be an integer",
        },
      },
    },
    percent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "Promotion percentage must be a valid integer",
        },
      },
    },
    promo_type: {
      type: DataTypes.ENUM("all_users", "specific_users"),
      allowNull: true,
      defaultValue: "all_users",
      validate: {
        isIn: {
          args: [["all_users", "specific_users"]],
          msg: "The allowed values for promo_type should be one of these values: all_users or specific_users",
        },
      },
    },
    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      validate: {
        isDate: {
          msg: "The provided from date is not a valid date",
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
          msg: "The provided to date is not a valid date",
          args: true,
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
          msg: "The provided status is not valid. It should be either active or inactive",
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
          msg: "The provided deleted state is not valid. It should be either yes or no",
        },
      },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)

promo.belongsTo(webAppsUsers, {foreignKey: "user_id"})

promo.sync()

export default promo
