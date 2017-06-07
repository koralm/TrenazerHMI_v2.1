var express = require('express');
var router = express.Router();

var cookies;

/* GET home page. */
router.get('/', function(req, res, next) {
    cookies = req.session;
    //console.log('ADV_/', req.session)
    req.session.save()
    res.render('settings_advenced', { title: 'CYKLOTREN HMI' + req.session.username, user_name_show: req.session.username, loaded_settings: req.session.session_settings});
});

router.get('/', function(req, res, next) {
    res.render('settings_advenced', { title: 'CYKLOTREN HMI' + req.session.username, user_name_show: req.session.username, loaded_settings: req.session.session_settings});
});


router.post('/', function(req, res, next)
{
    //console.log('ADV_/POST', cookies)
    res.send({actual_settings: cookies});
});

//DO USUNIECIA
// router.get('/z_listy', function(req, res, next) {
//     cookies = req.session;
//     //console.log('ADV_Z_LISTY/', req.session)
//     res.render('settings_advenced', { title: 'CYKLOTREN HMI' + req.session.username, user_name_show: req.session.username, loaded_settings: req.session.session_settings});
// });
//
// router.post('/z_listy', function(req, res, next)
// {
//     //console.log('ADV_/POST', cookies)
//     //res.send({actual_settings: cookies});
// });



module.exports = router;