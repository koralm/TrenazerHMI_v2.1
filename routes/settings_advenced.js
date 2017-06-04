var express = require('express');
var router = express.Router();

var cookies;

/* GET home page. */
router.get('/', function(req, res, next) {
    cookies = req.session;
    //console.log('ADV_/', req.session)
    res.render('settings_advenced', { title: 'CYKLOTREN HMI' + req.session.username, user_name_show: req.session.username, loaded_settings: req.session.session_variables});
});

router.get('/', function(req, res, next) {
    res.render('settings_advenced', { title: 'CYKLOTREN HMI' + req.session.username, user_name_show: req.session.username, loaded_settings: req.session.session_variables});
});


router.post('/', function(req, res, next)
{
    //console.log('ADV_/POST', cookies)
    res.send({actual_settings: cookies});
});



module.exports = router;