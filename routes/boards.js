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

router.get('/', function (req, res, next) {
    connection.query('select bd_no,bd_title,bd_hit,DATE_FORMAT(bd_date, "%Y/%m/%d %T") as bd_date, bt_text from boards order by bd_no desc', function (err, rows) {
        if (err) console.log(err);        // 만약 에러값이 존재한다면 로그에 표시합니다.
        else {
            console.log(JSON.stringify(rows));
            res.render('boards/index', { result: rows }); // view 디렉토리에 있는 boards 파일로 이동합니다.

        }
    });
});

router.get('/show/:bd_no', function (req, res) {
    var bd_no = req.params.bd_no;
    console.log("bd_no : " + bd_no);

    connection.beginTransaction(function (err) {
        if (err) console.log(err);
        connection.query('update boards set bd_hit=bd_hit+1 where bd_no=?', [bd_no], function (err) {
            if (err) {
                console.log(err);
                connection.rollback(function () {
                    console.error('rollback error!!');
                })
            }
            connection.query('select bd_no,bd_title,bd_hit,DATE_FORMAT(bd_date, "%Y/%m/%d %T") as moddate, DATE_FORMAT(bd_date, "%Y/%m/%d %T") as bd_date, bt_text from boards where bd_no=?', [bd_no], function (err, rows) {
                if (err) {
                    console.log(err);
                    connection.rollback(function () {
                        console.error('rollback error!!');
                    })
                }
                else {
                    connection.commit(function (err) {
                        if (err) console.log(err);
                        console.log('row : ' + rows);
                        res.render('boards/show', { title: rows[1], rows: rows });
                    })
                }
            })
        })
    })
})

router.get('/new', function (req, res){
    res.render('boards/new');
})

router.post('/new', function (req, res) {
    // 제목과 내용 변수값 저장
    var bd_no = req.body.bd_no
    var bd_writer = req.body.bd_writer
    var title = req.body.title;
    var body = req.body.body;

    connection.beginTransaction(function(err){
        if(err) console.log(err);
        
        connection.query('insert into boards(bd_no,bd_writer,bd_title,bt_text,bd_date,bd_hit) values(?,?,?,?,now(),?)'
        ,[bd_no, bd_writer , title , body, 0 , 0]
        ,function (err){
            if(err){
                console.log(err);
                connection.rollback(function(){
                    console.error('rollback error1!!');
                })
            }
            connection.query('select bd_no as idx from boards;', function(err, rows){
                if(err){
                    console.log(err);
                    connection.rollback(function(){
                        console.error('rollback error111!!');
                    })
                }
                else{
                    connection.commit(function (err){
                        if(err) console.log(err);
                        console.log("row : " + rows);
                        var idx = rows[0].idx;
                        res.redirect('/boards');
                    })
                }
            })
        })
    })


})






module.exports = router;