var express = require('express')
var router = express.Router();

// home
router.get('/', function(req, res){
    res.render('home/welcome')
})
router.get('/introduction', function(req, res){
    res.render('home/introduction')
})
router.get('/rec_board', function(req, res){
    res.render('home/rec_board')
})
router.get('/restaurant', function(req, res){
    res.render('home/restaurant')
})
router.get('/review', function(req, res){
    res.render('home/review')
})

module.exports = router;

// exports.links = links; // 모듈 외부로 공개할 이름 .links / 모듈 내부에서의 이름.