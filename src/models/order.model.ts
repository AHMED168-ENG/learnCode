import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"
import promo from "./promo.model"

const sequelize = new Sequelize(...config.database)

const order = sequelize.define(
  "tbl_orders",
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pay_type: {
      type: DataTypes.ENUM("cash", "online"),
      allowNull: true,
      defaultValue: "cash",
      validate: {
        isIn: {
          args: [["cash", "online"]],
          msg: "The pay type field can only be either cash or online",
        },
      },
    },
    all_sum: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "The all sum id can only be a number",
        },
      },
    },
    promo_code_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "The promo code id can only be a number",
        },
      },
    },
    promo_code_percent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          msg: "The promo code percent can only be a number",
        },
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "The user id must be an integer",
        },
      },
    },
    user_name: {
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
    action_inprogress_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      validate: {
        isDate: {
          msg: "Invalid date",
          args: true,
        },
      },
    },
    action_inprogress_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "must be an integer",
        },
      },
    },
    action_completed_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      validate: {
        isDate: {
          msg: "Invalid date",
          args: true,
        },
      },
    },
    action_completed_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "must be an integer",
        },
      },
    },
    action_cancelled_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      validate: {
        isDate: {
          msg: "Invalid date",
          args: true,
        },
      },
    },
    action_cancelled_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "must be an integer",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("new", "inprogress", "cancelled", "completed"),
      allowNull: true,
      defaultValue: "new",
      validate: {
        isIn: {
          args: [["new", "inprogress", "cancelled", "completed"]],
          msg: "Invalid status",
        },
      },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)

order.belongsTo(webAppsUsers, {foreignKey: "user_id"})
order.belongsTo(promo, {foreignKey: "promo_code_fk"})

order.sync()

export default order
