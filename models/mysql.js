// DB settings
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '{DBHostAddress}',
    user: '{DBUser}',
    password: '{DBPassword}',
    database: '{DBName}'
});

module.exports = connection;
