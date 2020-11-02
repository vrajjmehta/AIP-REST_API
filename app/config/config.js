require('dotenv').config();
module.exports = {
    // MySQL Developemnt Server
    development: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST
    },
    // MySQL local server
    local: {
        database: 'favour-tracking',
        user: 'root',
        password: 'password',
        host: '127.0.0.1'
    },
    // MySQL Production server on Google Cloud Platform (GCP)
    production: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        CLOUD_SQL_CONNECTION_NAME: process.env.CLOUD_SQL_CONNECTION_NAME
    },
    // configuration settings
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};