// DB settings
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'dana',
    password: 'Test1234!',
    database: 'btcweb'
});

module.exports = connection;