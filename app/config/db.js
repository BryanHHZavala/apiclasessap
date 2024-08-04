"use strict";
require("dotenv").config();

const mysql = require("mysql2/promise");

// Configura la conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Exporta el pool para usarlo en otros archivos
module.exports = pool; // Usa `.promise()` para trabajar con Promesas
