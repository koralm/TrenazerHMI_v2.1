var express = require('express');
var router = express.Router();

var cookies;

var cookies_exports;

/* GET home page. */
router.get('/', function(req, res, next) {
    cookies = req.session;
    exports
    //console.log('EXERCISE_/:', req.session)
    res.render('exercise', { title: 'CYKLOTREN HMI' + req.session.username, user_name_show: req.session.username });
});

router.post('/', function(req, res, next)
{
    //console.log('EXERCISE_/POST', cookies)
    res.send({actual_settings: cookies});
});


//PLAY SOUNDS
router.get('/up1', function(req, res){
    res.download('./media/sounds/range_up1.mp3');
});

router.get('/down1', function(req, res){
    res.download('./media/sounds/stoper_down1.mp3');
});

router.get('/up2', function(req, res){
    res.download('./media/sounds/range_up2.mp3');
});

router.get('/down2', function(req, res){
    res.download('./media/sounds/range_down2.mp3');
});

router.get('/dzwiek_koniec', function(req, res){
    res.download('./media/sounds/stoper_end.mp3');
});

module.exports = router;