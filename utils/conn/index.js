// const mysql = require("mysql2");
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'mysql',
    host: 'localhost'
  }
);

module.exports = sequelize;

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD
// });

// module.exports = pool.promise();
