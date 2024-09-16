'use strict'
require("dotenv").config();

module.exports = {
    PORT: process.env.DBPORT || 3300,
    HOST: process.env.DB_HOST || '127.0.0.1',
    DB: DB_NAME,
    USER: DB_USER,
    PASSWORD: DB_PASSWORD,
    DIALECT: 'mysql',
    POOL_MAX: 5,
    POOL_MIN: 0,
    POOL_ACQUIRE: 30000,
    POOL_IDLE: 10000
    
    // API_TOKEN: '',
    // SECRET_TOKEN: '',
    // PRIVATE_KEY: '',
    // CLIENT_EMAIL: '',

    //Comandos
    //CTRL + K + U PARA COMENTAR VARIAS LÍNEAS Y CTRL + K + U PARA DESCOMENTAR
}
