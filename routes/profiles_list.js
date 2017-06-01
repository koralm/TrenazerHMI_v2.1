var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('profiles_list', { title: 'CYKLOTREN HMI' });
});

module.exports = router;