// 라이브러리 변수 저장
var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
var methodOverride = require('method-override');
var app = express();
var port = 8001;

// DB settings
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'dana',
    password: '1234',
    database: 'btcweb'
});

// other settings
app.set('view engine', 'ejs'); // 동적 처리 (로그인, 게시판 등)
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

/*nodejs 부트스트랩 불러오기*/
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));


// 라우터
app.use('/', require('./routes/home')); // home
app.use('/boards', require('./routes/boards')); // boards


// 회원가입
// DB Insert
// TODO : 비밀번호 확인 함수
app.post('/dbinsert_post', function (req, res) {
    // html name 값을 변수에 삽입
    var name = req.body.inputName;
    var mail = req.body.inputEmail3;
    var phone = req.body.inputPhone;
    var pass = req.body.inputPassword3;
    var com = req.body.gridRadios;

    // 모든 정보를 입력하지 않았을 때 메시지 박스 띄우기
    if (!name || !mail || !phone || !pass) {

        // 한글 깨짐 방지
        res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
        // 메시지 박스 띄움
        res.write("<script>alert('모든 정보를 입력해주세요.')</script>")
        // 메시지 박스가 띄워지고 나서 제자리로 돌아감
        return res.write("<script>window.location=\"/login\"</script>");
    }

    // DB 커넥션 연결
    connection.connect();

    // DB insert 구문 변수 저장
    var insert = `insert into users values ('${name}','${mail}','${phone}','${pass}','${com}');`

    connection.query('SELECT * FROM users WHERE u_mail = ?', [mail], function (error, results, fields) {
        if (results.length == 0) {
            res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
            res.write("<script>alert('회원가입성공')</script>");

            // DB 쿼리 작성과 에러가 발생하면 에러 로그 출력
            connection.query(insert, function (error, results, fields) {
                if (error) {console.log(error);} 
            });
            res.write("<script>window.location=\"/login\"</script>");

            if (error) {console.log(error);}
            
        }else{
            res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
            res.write("<script>alert('회원가입실패')</script>");
            res.write("<script>window.location=\"/login\"</script>");
        }
    })
})


// 로그인
// DB Select
app.post('/login_post', function (req, res) {
    // 이메일과 비번 name 변수값 저장
    var mail = req.body.inputEmail3;
    var pass = req.body.inputPassword3;
    var com = req.body.gridRadios

    // 이메일과 비번 입력값 출력(입력값이 제대로 출력되는 테스트)
    console.log(mail, pass)

    // DB 커넥션 생성
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'dana',
        password: '1234',
        database: 'testdb'
    });

    // DB 커넥션 연결
    connection.connect();

    // 입력값의 메일과 비번을 비교하여 로그인이 될 수 있게 만드는 구문
    // 만약 이메일과 비번, 회사의 DB 조회를 통해 입력값과 비교를 하고
    // 에러가 발생하면 에러 로그를 발생시킨 뒤
    // 결과값의 길이가 0보다 클 경우 로그인이 되도록 구성
    if (mail && pass) {
        connection.query('SELECT * FROM users WHERE u_mail = ? AND u_password = ? AND u_company = ?', [mail, pass, com], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                //req.session.loggedin = true;
                //req.session.username = username;
                //res.redirect('/');
                //res.send("<script>alert('로그인되었습니다.')</script>");
                res.send('<script type="text/javascript">alert("로그인 되었습니다."); document.location.href="/";</script>');
                res.end();
            } else {
                res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/login";</script>');
            }
        });
    } else if(!mail && !pass){
        res.send('<script type="text/javascript">alert("Email과 Password를 입력하세요!"); document.location.href="/login";</script>');
        res.end();
    } else if(!pass){
        res.send('<script type="text/javascript">alert("Password를 입력하세요!"); document.location.href="/login";</script>');
        res.end();
    }else if(!mail){
        res.send('<script type="text/javascript">alert("Email을 입력하세요!"); document.location.href="/login";</script>');
        res.end();
    }
})



app.listen(port, function () {
    console.log(`App listing as http://localhost:${port}`);
});