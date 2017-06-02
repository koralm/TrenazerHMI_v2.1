var express = require('express');
var router = express.Router();
var fs = require('fs');
var mkdirp = require('mkdirp');

var current_settings;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('settings_save', { title: 'CYKLOTREN HMI' });
});

router.post('/', function(req, res, next) {
    current_settings = req.body.user_current_settings;
    console.log(current_settings);

});






module.exports = router;