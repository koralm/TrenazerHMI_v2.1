var express = require('express');
var router = express.Router();
var fs = require('fs');

var current_settings;

var username;

var file_list;
var file_list_without_txt = [];
var loaded_profiles = [];
var selected_ID;

/* GET home page. */
router.get('/', function(req, res, next) {
    //console.log('Y',file_list);
    //console.log('X',file_list_without_txt);
    res.render('profiles_list', { title: 'CYKLOTREN HMI' + username, user_name_show: username });
});

router.post('/', function(req, res, next) {
    //console.log('Y1',file_list);
    //console.log('X1',file_list_without_txt);
    res.send({loaded_profiles: loaded_profiles, file_list: file_list_without_txt});
});

/* PRELOAD PAGE */
router.get('/zaladuj_profile_cwiczen', function(req, res, next) {
    current_settings = req.session.session_settings;
    if (current_settings.username == null){username = req.session.username;}
    else {username = current_settings.username}

    //console.log('zaladuj_profile_cwiczen',req.session);
    //console.log('Y2',file_list);
    //console.log('X2',file_list_without_txt);
    //console.log('SAVE_/:', current_settings);
    load_profiles(function () {
        prepare_data_for_post();
        res.redirect('/profile_cwiczen');
    });
});

router.get('/zaladuj_wybrany_profil', function(req, res, next) {
});

///zaladuj_wybrany_profil'
router.post('/zaladuj_wybrany_profil', function(req, res, next) {
    //console.log('WYBRANO: ' + req.body.actual_ID);
    selected_ID = req.body.actual_ID;
    res.redirect('/profile_cwiczen/zaladuj_wybrany_profil_TO_TEMP')
});

router.get('/zaladuj_wybrany_profil_TO_TEMP', function(req, res, next) {
    current_settings = loaded_profiles[selected_ID];
    req.session.session_settings = current_settings;
    //console.log('CURR', current_settings);
    //console.log('SESS', req.session.session_settings)
    res.end(req.session.session_settings.save())
})

router.get('/delete_profile', function(req, res, next) {
    delete_profile (function () {
        res.redirect('/profile_cwiczen/zaladuj_profile_cwiczen');
    })
})

router.post('/delete_profile', function(req, res, next) {
    //res.send({loaded_profiles: loaded_profiles, file_list: file_list_without_txt});
});


function load_profiles(callback){
    //FILE LIST CHECK
    var settings_dir_path = 'exercise_profiles/' + username +  '/saved_settings/';
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
    file_list_without_txt = [];
    for (var i=0; i < file_list.length; i++){
        file_list_without_txt[i] = file_list[i].replace('.txt','')
    }
}

function delete_profile (callback){
    var filePath = 'exercise_profiles/' + username +  '/saved_settings/' + file_list[selected_ID];
    console.log(filePath);
    fs.unlinkSync(filePath);
    file_list_without_txt = [];
    file_list = [];
    loaded_profiles = [];
    load_profiles(function(){ prepare_data_for_post()});
    callback();
}

module.exports = router;