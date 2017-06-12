var express = require('express');
var router = express.Router();

var cookies;


/* GET home page. */
router.get('/', function(req, res, next) {
    cookies = req.session;
    //console.log('sdsd',cookies);
    if (cookies.session_settings.duration_sec_INA.length === 1){cookies.session_settings.duration_sec_INA = pad(cookies.session_settings.duration_sec_INA).toString()}
    if (cookies.session_settings.duration_sec_INA.length === 0){cookies.session_settings.duration_sec_INA = '00'}
    if (cookies.session_settings.duration_min_INA.length === 0){cookies.session_settings.duration_min_INA = '0'}
    if (cookies.session_settings.duration_cycle_INA.length === 0){cookies.session_settings.duration_cycle_INA = '0'}
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
    res.download('./media/sounds/range_down1.mp3');
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

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

module.exports = router;