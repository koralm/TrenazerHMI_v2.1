var express = require('express');
var router = express.Router();
var rs232 = require('../server_scripts/rs232.js');


var cookies;

/* GET home page. */
router.get('/', function(req, res, next) {
    cookies = req.session;
    //console.log('ADV_/', req.session)
    req.session.save();
    send_reset_to_rs232();
    res.render('settings_advenced', { title: 'CYKLOTREN HMI' + req.session.username, user_name_show: req.session.username, loaded_settings: req.session.session_settings});
});

// router.get('/', function(req, res, next) {
//     res.render('settings_advenced', { title: 'CYKLOTREN HMI' + req.session.username, user_name_show: req.session.username, loaded_settings: req.session.session_settings});
// });


router.post('/', function(req, res, next)
{
    //console.log('ADV_/POST', cookies)
    //console.log("dupa");
    res.send({actual_settings: cookies});
    //console.log("dupa1");
});

function send_reset_to_rs232(callback){
    //RESET SEQUENCE
    rs232.rs_statusSET(0);
    rs232.rs_statusSET(0);
    rs232.rs_statusSET(7);
    rs232.rs_statusSET(3);
    rs232.rs_statusSET(0);}


module.exports = router;