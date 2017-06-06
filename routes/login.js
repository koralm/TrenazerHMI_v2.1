var express = require('express');
var router = express.Router();
var fs = require('fs');
var mkdirp = require('mkdirp');

var session_variables;
var loaded_settings;

//FIRST LOGIN GET
router.get('/', function(req, res, next) {
    console.log('LOGIN', req.session);
    session_variables = req.session;
    check_directory( function () {
        session_variables = loaded_settings;
        req.session.session_settings = session_variables;
        //req.session.username = session_variables.username;
        next();
    });
});

router.get('/', function(req, res, next) {
    res.redirect('/ustawienia')
});

//CHECK USERNAME IF EXIST IN DIRECTORY
function check_directory(callback){

    var path = 'exercise_profiles/' + session_variables.username;

    //CHECK DIRECTORY
    //LOAD LAST FROM DIR BASED ON LOGIN
    if (fs.existsSync(path)) {
        console.log('LOGIN1');
        var path_exist_profile = path + '/last_settings.txt';
        load_settings_from_file_L(callback, path_exist_profile);


    //LOAD DEFAULT AND CREATE DIR
    } else {
        console.log('LOGIN2');
        mkdirp(path, function (err) {
            if (err) console.error(err);
            else console.log('created_new_user_dir');
            //LOAD DEFAULT
            var path_new_profile = 'exercise_profiles/default.txt';
            var path_saved_settings = path + '/saved_settings/';
            console.log('XZ' + path_saved_settings)
            mkdirp(path_saved_settings, function (err) {});
            load_settings_from_file_D(callback, path_new_profile);
        });


    }
}

//LOAD FROM FILE LAST
function load_settings_from_file_L(callback, path){
    fs.readFile(path, 'utf8', function (err, data) {
        loaded_settings = JSON.parse(data);
        callback();
    })
}

//LOAD FROM FILE DEFAULT
function load_settings_from_file_D(callback, path){
    fs.readFile(path, 'utf8', function (err, data) {
        loaded_settings = JSON.parse(data);
        save_default_as_last()
        callback();
    })
}

//SAVE DEFAULT AS LAST
function save_default_as_last(){
    fs.writeFile('exercise_profiles/' + session_variables.username + '/last_settings.txt', JSON.stringify(loaded_settings), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The DEF_AS_LAST file was saved!");
    });
}

module.exports = router;

