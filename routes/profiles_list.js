var express = require('express');
var router = express.Router();
var fs = require('fs');

var current_settings;

var file_list;
var file_list_without_txt = [];
var loaded_profiles = [];

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('profiles_list', { title: 'CYKLOTREN HMI' + req.session.username, user_name_show: req.session.username });
});

router.post('/', function(req, res, next) {
    console.log('X',file_list_without_txt);
    res.send({loaded_profiles: loaded_profiles, file_list: file_list_without_txt});
});

/* PRELOAD PAGE */
router.get('/zaladuj_profile_cwiczen', function(req, res, next) {
    current_settings = req.session.session_settings;
    console.log('SAVE_/:', current_settings);
    load_profiles(function () {
        prepare_data_for_post();
        res.redirect('/profile_cwiczen');
    });
});


function load_profiles(callback){
    //FILE LIST CHECK
    var settings_dir_path = 'exercise_profiles/' + current_settings.username +  '/saved_settings/';
    //LIST FILES FROM FOLDER
    file_list = fs.readdirSync(settings_dir_path);

    var number_of_saved_settings = file_list.length;

    if (number_of_saved_settings === 0){
        callback();
    } else{
        for (var i=0; i < number_of_saved_settings; i++){
            var settings_path = settings_dir_path + file_list[i];

            loaded_profiles[i] = JSON.parse(fs.readFileSync(settings_path, 'utf8'));
        }
        callback();
    }
}

function prepare_data_for_post(){
    for (var i=0; i < file_list.length; i++){
        file_list_without_txt[i] = file_list[i].replace('.txt','')
    }
}


module.exports = router;