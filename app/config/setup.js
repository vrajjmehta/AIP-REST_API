const dbConfig = require("../config/config.js");
const Sequelize = require("sequelize");

// Developemnt setup
const sequelize_dev = new Sequelize(dbConfig.development.database, dbConfig.development.user, dbConfig.development.password, {
    host: dbConfig.development.host,
    dialect: 'mysql',
    operatorsAliases: 0,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    dialectOptions: {
        useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: function (field, next) { // for reading from database
        if (field.type === 'DATETIME') {
            return field.string();
        }
            return next();
        },
    },
    timezone: '+11:00'
});

// Production setup
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
        socketPath: `/cloudsql/${dbConfig.production.CLOUD_SQL_CONNECTION_NAME}`,
        useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: function (field, next) { // for reading from database
        if (field.type === 'DATETIME') {
            return field.string();
        }
            return next();
        },
    },
    timezone: '+11:00'
});

const db = {};

db.Sequelize = Sequelize;

// Change variable depending on environment

let sequelize = sequelize_dev;
// let sequelize = sequelize_prod;

db.sequelize = sequelize;

db.posts = require("../models/post.js")(sequelize, Sequelize);
db.users = require("../models/user.js")(sequelize, Sequelize);
db.rewards = require("../models/reward.js")(sequelize, Sequelize);
db.postRewards = require("../models/post-reward.js")(sequelize, Sequelize);
db.transaction = require("../models/transaction.js")(sequelize, Sequelize);
db.favour = require("../models/favour.js")(sequelize, Sequelize);


module.exports = db;