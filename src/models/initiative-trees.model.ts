import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import initiativeLocations from "./initiative-location.model"
import trees from "./trees.model"
import cart from "./cart.model"
import initiatives from "./initiative.model"

const sequelize = new Sequelize(...config.database)

const initiativeTrees = sequelize.define(
  "tbl_initiatives_trees",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tree_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "The tree id must be an integer",
        },
      },
    },
    init_id_pk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "The initiative id must be an integer",
        },
      },
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "The location id must be an integer",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true,
      defaultValue: null,
      validate: {
        isDecimal: {
          msg: "The price must be a valid decimal number",
        },
      },
    },
    price_points: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: null,
      validate: {
        isDecimal: {
          msg: "The price points must be a valid decimal number",
        },
      },
    },
    carbon_points: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: null,
      validate: {
        isDecimal: {
          msg: "The carbon points must be a valid decimal number",
        },
      },
    },
    target_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        isInt: {
          msg: "The target should be a valid integer",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: true,
      defaultValue: "active",
      validate: {
        isIn: {
          args: [["active", "inactive"]],
          msg: "Invalid status. It should be either active or inactive",
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
// initiativeTrees.belongsTo(initiativeLocations, {foreignKey: "location_id"})
initiativeTrees.belongsTo(initiativeLocations, {foreignKey: "location_id"})
initiativeTrees.belongsTo(initiatives, {foreignKey: "init_id_pk"})

initiativeTrees.belongsTo(trees, {foreignKey: "tree_id"})
initiativeTrees.sync()

export default initiativeTrees
