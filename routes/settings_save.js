var express = require('express');
var router = express.Router();
var fs = require('fs');
var mkdirp = require('mkdirp');

var current_settings;
var current_filename;

/* SAVE SETTINGS HOME. */
router.get('/', function(req, res, next) {
    req.session.session_settings = current_settings;
    console.log('SAVE_/:', req.session)
    res.render('settings_save', { title: 'CYKLOTREN HMI' + req.session.username, user_name_show: req.session.username });
});

router.post('/', function(req, res, next) {
});


//SAVE TEMP
router.get('/save_temp', function(req, res, next) {
});

router.post('/save_temp', function(req, res, next) {
    current_settings = req.body.user_current_settings;
    res.send({redirectUrl: "/zapisz"});
});

//SAVE TO FILE
router.get('/zapisywanie', function(req, res, next) {
    //console.log('SAVE_ZAPISYWANIE:',current_settings)
});

router.post('/zapisywanie', function(req, res, next) {
    save_settings_to_file_last(req.body.filename);
});

//SAVE TO FILE LOGOUT
router.get('/zapisywanie_LOGOUT', function(req, res, next) {
    console.log('SAVE_ZAPISYWANIE_LOGOUT:',current_settings)
    save_settings_to_file_last('');
    res.redirect('/wyloguj')
});

function save_settings_to_file_last(file_name){
    var path_last_settings = 'exercise_profiles/' + current_settings.username +  '/last_settings.txt' ;
    var path_saved_settings = 'exercise_profiles/' + current_settings.username +  '/saved_settings/' + file_name + '.txt' ;

    if (file_name.length == 0){
        fs.writeFile(path_last_settings, JSON.stringify(current_settings), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The LAST file was saved!");
        });
    }else{

        mkdirp('exercise_profiles/' + current_settings.username +  '/saved_settings/', function (err) {
            if (err) console.error(err);
            else console.log('created_new_user_dir');
        })

        fs.writeFile(path_last_settings, JSON.stringify(current_settings), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The LAST file was saved!");
        });

        fs.writeFile(path_saved_settings, JSON.stringify(current_settings), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The CUSTOM file was saved!");
        });
    }


}

module.exports = router;