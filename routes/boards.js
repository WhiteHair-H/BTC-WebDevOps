var express = require('express');
var router = express.Router();
var mysql = require('mysql'); //mysql 모듈을 로딩.
const ejs = require('ejs');


// TODO : 게시판의 내용을 수정하는 함수와 게시판의 데이터를 삭제하는 함수 구현해야함


// DB settings
var connection = mysql.createConnection({
    host: 'btcappdb.mysql.database.azure.com',
    user: 'dana',
    password: '~1q2w3e4r5t6y',
    database: 'btcweb'
});

connection.connect();

// 게시판 첫 화면에서 DB값 띄우기
// Boards/index
router.get('/', function (req, res, next) {


    connection.query('select bd_no,bd_title,bd_hit,DATE_FORMAT(bd_date, "%Y/%m/%d %T") as bd_date, bt_text from Boards order by bd_no desc', function (err, rows) {
        if (err) console.log(err);        // 만약 에러값이 존재한다면 로그에 표시합니다.
        else {
            //console.log(JSON.stringify(rows));
            res.render('boards/index', { result: rows }); // view 디렉토리에 있는 boards 파일로 이동합니다.

        }
    });
});

// 게시판에서 제목을 클릭해서 상세 내역을 볼 수 있게 하는 함수
// Boards/show
router.get('/show/:bd_no', function (req, res) {
    var bd_no = req.params.bd_no;
    console.log("bd_no : " + bd_no);

    connection.beginTransaction(function (err) {
        if (err) console.log(err);
        connection.query('update Boards set bd_hit=bd_hit+1 where bd_no=?', [bd_no], function (err) {
            if (err) {
                console.log(err);
                connection.rollback(function () {
                    console.error('rollback error!!');
                })
            }
            connection.query('select bd_no,bd_title,bd_hit,DATE_FORMAT(bd_date, "%Y/%m/%d %T") as moddate, DATE_FORMAT(bd_date, "%Y/%m/%d %T") as bd_date, bt_text from Boards where bd_no=?', [bd_no], function (err, rows) {
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

// GET 게시판에서 새로 내용을 작성하는 함수
router.get('/new', function (req, res) {
    res.render('boards/new');
})

// POST 게시판에서 새로 내용을 작성하는 함수
// POST는 form과 항상 같이 이동
router.post('/new', function (req, res) {
    // 제목과 내용 변수값 저장
    var bd_no = req.body.bd_no
    var bd_writer = req.body.bd_writer
    var title = req.body.title;
    var body = req.body.body;

    connection.beginTransaction(function (err) {
        if (err) console.log(err);

        connection.query('insert into Boards(bd_no,bd_writer,bd_title,bt_text,bd_date,bd_hit) values(?,?,?,?,now(),?)'
            , [bd_no, bd_writer, title, body, 0, 0]
            , function (err) {
                if (err) {
                    console.log(err);
                    connection.rollback(function () {
                        console.error('rollback error1!!');
                    })
                }
                connection.query('select bd_no as idx from Boards;', function (err, rows) {
                    if (err) {
                        console.log(err);
                        connection.rollback(function () {
                            console.error('rollback error111!!');
                        })
                    }
                    else {
                        connection.commit(function (err) {
                            if (err) console.log(err);
                            console.log("row : " + rows);
                            var idx = rows[0].idx;
                            res.redirect('/boards');
                        })
                    }
                })
            })
    })
})

// GET 게시판의 내용을 수정하기 위한 페이지로 이동
router.get('/show/:bd_no/edit', function (req, res) {
    var bd_no = req.params.bd_no;

    connection.beginTransaction(function (err) {
        if (err) console.log(err);
        connection.query('select bd_no,bd_writer,bd_title,bd_hit,DATE_FORMAT(bd_date, "%Y/%m/%d %T") as moddate, DATE_FORMAT(bd_date, "%Y/%m/%d %T") as bd_date, bt_text from Boards where bd_no=?', [bd_no], function (err, rows) {
            if (err) {
                console.log(err);
                connection.rollback(function () {
                    console.error('rollback error!!');
                })
            }
            else {
                connection.commit(function (err) {
                    if (err) console.log(err);
                    console.log('show row : ' + rows);
                    res.render('boards/edit', { title: rows[1], rows: rows });
                })
            }
        })
    })
})

// POST 게시판의 내용을 수정하기 위한 함수
// 현재 구현하는 중
router.post('/show/:bd_no/edit', function (req, res) {
    // 제목과 내용 변수값 저장
    var title = req.body.title
    var text = req.body.bd_text
    var bd_no = req.params.bd_no

    connection.beginTransaction(function (err) {
        if (err) console.log(err);
        
        connection.query('UPDATE Boards SET bd_title=? , bt_text=? where bd_no=?', [title, text, bd_no], function (err, rows) {
            if (err) throw err;
            console.log(bd_no ,title, text);
            console.log('수정한 결과값 = ', rows);
            res.redirect('/boards');
        })
    })
})

// 게시판 글 삭제
// Delete
router.post('/show/:bd_no/delete' , function(req, res){

    var num = req.params.bd_no

    connection.beginTransaction(function (err){
        if(err) console.log(err);

        connection.query('DELETE FROM Boards WHERE bd_no=?',[num] , function(err, rows){
            if(err ) throw err;
            console.log(num)
            console.log('삭제한 결과값 = ' , rows);
            res.redirect('/boards');
        })
    })
})

module.exports = router;