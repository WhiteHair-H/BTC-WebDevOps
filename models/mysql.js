

// DB settings
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'dana',
    password: '1234',
    database: 'btcweb'
});


module.exports = router;