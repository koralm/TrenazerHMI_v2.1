var express = require('express');
var router = express.Router();

var cookies;

/* GET home page. */
router.get('/', function(req, res, next) {
    cookies = req.session;
    //console.log('EXERCISE_/:', req.session)
    res.render('exercise', { title: 'CYKLOTREN HMI' + req.session.username, user_name_show: req.session.username });
});

router.post('/', function(req, res, next)
{
    console.log('EXERCISE_/POST', cookies)
    res.send({actual_settings: cookies});
});

module.exports = router;