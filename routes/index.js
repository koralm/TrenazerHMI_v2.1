var express = require('express');
var router = express.Router();

var session_variables;

/* GET home page. */
router.get('/', function(req, res, next) {
    session_variables = req.session;
    res.render('index', { title: 'CYKLOTREN HMI'});
});

router.post('/', function(req, res, next) {
    session_variables.username = req.body.username;
    session_variables.save();
});

router.get('/wyloguj', function(req, res, next) {
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

router.get('/zaloguj', function(req, res, next) {
  res.redirect('/ustawienia');
});

module.exports = router;


