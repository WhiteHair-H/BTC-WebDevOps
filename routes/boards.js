var express = require('express');
var router = express.Router();
var mysql = require('mysql'); //mysql 모듈을 로딩.
const ejs = require('ejs');

// DB settings
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'dana',
    password: '1234',
    database: 'btcweb'
});

connection.connect();

// router.get('/index', function (req, res, next) {
//     res.render('/boards/index')
// })

router.get('/', function (req, res, next) {
    connection.query('select bd_no,bd_title,bd_hit,DATE_FORMAT(bd_date, "%Y/%m/%d %T") as bd_date, bt_text from boards', function (err, rows) {
        if (err) console.log(err);        // 만약 에러값이 존재한다면 로그에 표시합니다.
        else {
            console.log(JSON.stringify(rows));
            res.render('boards/index', { result: rows}); // view 디렉토리에 있는 boards 파일로 이동합니다.

        }
    });
});

router.get('/new', function (req, res) {
    res.render('boards/new')
})

module.exports = router;