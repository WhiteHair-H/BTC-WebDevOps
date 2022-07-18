var express = require('express');
var router = express.Router();
var mysql = require('mysql'); //mysql 모듈을 로딩.

// DB settings
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'dana',
    password: '1234',
    database: 'btcweb'
});

connection.query('select bd_no,bd_writer,bd_review,bd_title,bd_hit,DATE_FORMAT(bd_date, "%Y/%m/%d %T") as bd_date from boards', function (err, result,field) {
    if (err) console.log(err);        // 만약 에러값이 존재한다면 로그에 표시합니다.
    else {
        console.log(result);
        //console.log(field);
    }
});


module.exports = router;