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

connection.connect();


// 게시판 첫 화면에서 DB값 띄우기
// membership/index
router.get('/', function (req, res, next) {
    res.render('membership/login'); // view 디렉토리에 있는 boards 파일로 이동합니다.
});

router.get('/signup', function (req, res, next) {
    res.render('membership/signup'); // view 디렉토리에 있는 boards 파일로 이동합니다.
});

// 회원가입 POST
// membership/login
router.post('/usersignup', function (req, res) {
    // html name 값을 변수에 삽입
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var pass = req.body.password;
    var com = req.body.company;

    // 모든 정보를 입력하지 않았을 때 메시지 박스 띄우기
    console.log(name, email, phone, pass ,com);
    if (!name || !email || !phone || !pass) {

        // 한글 깨짐 방지
        res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
        // 메시지 박스 띄움
        res.write("<script>alert('모든 정보를 입력해주세요.')</script>")
        // 메시지 박스가 띄워지고 나서 제자리로 돌아감
        return res.write("<script>window.location=\"/membership\"</script>");
    }


    connection.query('SELECT * FROM user WHERE user_email = ?', [email], function (error, results, fields) {
        if (results.length == 0) {
            res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
            res.write("<script>alert('회원가입성공')</script>");
            console.log(results);
            
            connection.query('insert into user(user_nickname,user_email,user_phone,user_pw,user_company) values(?,?,?,?,?)'
            , [name , email, phone, pass, com]
            , function (error, results, fields) {
                // DB 쿼리 작성과 에러가 발생하면 에러 로그 출력
                if (error) {console.log(error);} 
            });
            res.write("<script>window.location=\"/membership\"</script>");

            if (error) {console.log(error);}
            
        }else{
            res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
            res.write("<script>alert('회원가입실패')</script>");
            res.write("<script>window.location=\"/membership\"</script>");
        }
    })
})

// 로그인
// DB Select
router.post('/login_post', function (req, res) {
    // 이메일과 비번 name 변수값 저장
    var email = req.body.email;
    var pass = req.body.password;
    var com = req.body.company

    // 이메일과 비번 입력값 출력(입력값이 제대로 출력되는 테스트)
    console.log(email, pass, com)

    // 입력값의 메일과 비번을 비교하여 로그인이 될 수 있게 만드는 구문
    // 만약 이메일과 비번, 회사의 DB 조회를 통해 입력값과 비교를 하고
    // 에러가 발생하면 에러 로그를 발생시킨 뒤
    // 결과값의 길이가 0보다 클 경우 로그인이 되도록 구성
    if (email && pass) {
        connection.query('SELECT * FROM user WHERE user_email = ? AND user_pw = ? AND user_company = ?', [email, pass, com], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                //req.session.loggedin = true;
                //req.session.username = username;
                //res.redirect('/');
                //res.send("<script>alert('로그인되었습니다.')</script>");
                res.send('<script type="text/javascript">alert("로그인 되었습니다."); document.location.href="/";</script>');
                res.end();
            } else {
                res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/membership";</script>');
            }
        });
    } else if(!email && !pass){
        res.send('<script type="text/javascript">alert("Email과 Password를 입력하세요!"); document.location.href="/membership";</script>');
        res.end();
    } else if(!pass){
        res.send('<script type="text/javascript">alert("Password를 입력하세요!"); document.location.href="/membership";</script>');
        res.end();
    }else if(!email){
        res.send('<script type="text/javascript">alert("Email을 입력하세요!"); document.location.href="/membership";</script>');
        res.end();
    }
})


module.exports = router;