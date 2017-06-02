var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('settings_save', { title: 'CYKLOTREN HMI' });
});

router.post('/', function(req, res, next) {
    console.log(req.body.usernMAX)
});

module.exports = router;