var express = require('express');
var router = express.Router();

var username;

/* GET home page. */
router.get('/', function(req, res, next) {
    req.session = null;
    console.log("indeX", req.session);
    res.render('index', { title: 'CYKLOTREN HMI'});
});


router.post('/', function(req, res, next)
{
    console.log("indeX2", req.body.username);
    req.session.username = req.body.username;
    console.log("indeX2.5", req.session);
    res.send({redirectUrl: "/logowanie"});
});



router.get('/wyloguj', function(req, res, next) {
    req.session = null;
    res.redirect('/');
});


module.exports = router;


