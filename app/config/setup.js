const dbConfig = require("../config/config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.development.database, dbConfig.development.user, dbConfig.development.password, {
    host: dbConfig.development.host,
    dialect: 'mysql',
    operatorsAliases: 0,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.posts = require("../models/post.js")(sequelize, Sequelize);
db.users = require("../models/user.js")(sequelize, Sequelize);
db.rewards = require("../models/reward.js")(sequelize, Sequelize);


module.exports = db;