var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('settings_simple', { title: 'CYKLOTREN HMI' });
});

module.exports = router;