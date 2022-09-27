// 라이브러리 변수 저장
var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
var methodOverride = require('method-override');
var app = express();
var port = 8081;

var cookieParser = require("cookie-parser")
var expressSession = require("express-session")

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
app.use('/membership', require('./routes/membership')); // membership


// cookie and session assign middleWare
app.use(cookieParser());

// 세션세팅
app.use(
    expressSession({
      secret: "my key",
      resave: true,
      saveUninitialized: true,
    })
  );

app.listen(port, function () {
    console.log(`App listing as http://localhost:${port}`);
});