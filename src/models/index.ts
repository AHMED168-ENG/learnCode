import seq, {Sequelize, DataTypes} from "sequelize"
import config from "../config/config"
import initiativeLocations from "./initiative-location.model"
import initiativeTrees from "./initiative-trees.model"

const sequelize = new Sequelize(...config.database)

const db = {
  sequelize,
  Sequelize,
  initiativeLocations: initiativeLocations,
  initiativeTrees: initiativeTrees,
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
// db.Sequelize = Sequelize;

export default db
