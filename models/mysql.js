// DB settings
const mysql = require('mysql');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
    path:path.join(__dirname, './.env')
});

const connection = mysql.createConnection({
    host: process.env.DBHostAddress ,
    user: process.env.DBUser,
    password: process.env.DBPassword,
    database: process.env.DBName
});

module.exports = connection;
