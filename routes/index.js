var express = require('express');
var router = express.Router();

var session_variables;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'CYKLOTREN HMI'});
    session_variables = req.session;
    console.log('PO GECIE:');
    console.log(session_variables);
});


router.post('/', function(req, res, next) {
    session_variables.username = ' ' + req.body.username;
    session_variables.save();
    console.log('PO POSCIE:', req.session);
    console.log('PO POSCIE LOC:', session_variables);
    console.log('PO POSCIE BODY:', req.body);
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


module.exports = router;


