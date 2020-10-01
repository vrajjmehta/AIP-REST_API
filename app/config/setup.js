const dbConfig = require("../config/config.js");
const Sequelize = require("sequelize");

const sequelize_dev = new Sequelize(dbConfig.development.database, dbConfig.development.user, dbConfig.development.password, {
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

const sequelize_prod = new Sequelize(dbConfig.production.database, dbConfig.production.user, dbConfig.production.password, {
    dialect: 'mysql',
    operatorsAliases: 0,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    dialectOptions: { 
        socketPath: `/cloudsql/${dbConfig.production.CLOUD_SQL_CONNECTION_NAME}`
        }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

var sequelize = sequelize_dev;
// var sequelize = sequelize_prod;

db.posts = require("../models/post.js")(sequelize, Sequelize);
db.users = require("../models/user.js")(sequelize, Sequelize);
db.rewards = require("../models/reward.js")(sequelize, Sequelize);
db.postRewards = require("../models/post-reward.js")(sequelize, Sequelize);


module.exports = db;