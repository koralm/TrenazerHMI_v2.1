var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('settings_advenced', { title: 'CYKLOTREN HMI' + req.session.username, user_name_show: req.session.username});
});




module.exports = router;