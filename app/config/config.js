require('dotenv').config();
module.exports = {
    // MySQL Server on Google Cloud Platform (GCP)
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
    production: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        CLOUD_SQL_CONNECTION_NAME: process.env.CLOUD_SQL_CONNECTION_NAME
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};