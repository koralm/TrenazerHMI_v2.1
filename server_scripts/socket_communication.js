
var rs232 = require('../server_scripts/rs232.js');
var fs = require('fs');
var mkdirp = require('mkdirp');

//SESION SETTINGS FROM SERVER INIT PARAMETERS
var session_settings = { actual_settings:
    { username: 'sada',
        session_settings:
            { username: 'sada',
                disp1_show: true,
                disp1_select: '1',
                disp1_max_INA: '50',
                disp1_min_INA: '10',
                disp2_show: true,
                disp2_select: '2',
                disp2_max_INA: '11',
                disp2_min_INA: '77',
                line_length_INA: '65',
                roller_dist_INA: '15',
                mass_INA: '100',
                duration_min_INA: '0',
                duration_sec_INA: '0',
                duration_cycle_INA: '0',
                folder_name_INA: 'domyslne',
                file_name_INA: 'zapisane',
                sound_toggle: true,
                menu_toggle: false } } }
//     actual_settings.session_settings.duration_min_INA: 0,
//     actual_settings.session_settings.duration_sec_INA: 0;
// };


//SESTION TO SERVER INIT PARAMETERS
var bar_button_data_to_server = {start: 0, stop: 0, rec: 0};


//VAR SEND TO HMI CYCLICALLY (RS232)
var calculated_time;
var elapsed_cycle;
var disp_phase_val = false;
var training_done = false;

var stoper_interval_handle;

module.exports = function (io) {
    io.on('connection', function (socket) {


        //INCOMING SESSION DATA ON TRAINING LOAD
        socket.on('session_settings', function (data) {
            session_settings = data;
            //exports.session_settingsE = data;

            console.log(session_settings);
            update_init_params()

        });

        //MAIN CYCLE FROM RS232
        rs232.rs232_cycle_eventE.on("cykl", function () {
            if (bar_button_data_to_server.start || bar_button_data_to_server.rec){
                socket.emit('bar_button_data_from_server_socket', {elapsed_min: calculated_time.elapsed_min, elapsed_sec: calculated_time.elapsed_sec, elapsed_cycle: elapsed_cycle, disp_phase_val: disp_phase_val});
            };
        });

        //INCOMING BAR BUTTON DATA
        socket.on('bar_button_data_to_server_socket', function (data) {

            bar_button_data_to_server = data;
            //exports.bar_button_data_to_serverE = data;
            console.log(data);
            bar_buttons_function();
            });


        //IN SCOKET FUNCTIONS

        //BAR BUTTONS LOGIC
        function bar_buttons_function() {


            //ON START BUTTON
            if (bar_button_data_to_server.start && !bar_button_data_to_server.rec){
                //on_start_button
                console.log('START_BUTTON');

                training_done = false;
                //UPDATE PARAMS
                update_init_params()

                //START STOPER
                stoper_interval_handle =  setInterval(stoper, 1000);
            }

            //ON REC BUTTON
            //REC PUSH AND !START
            if (bar_button_data_to_server.rec){
                //REC OR REC + START
                if (!bar_button_data_to_server.start){
                //on_start_button
                console.log('REC + !START');
                training_done = false;

                //UPDATE PARAMS
                update_init_params();

                //START STOPER
                stoper_interval_handle =  setInterval(stoper, 1000);
            } else{
                    console.log('REC + START');
                }
            //CREATE DIR AND RECORD FILE
                createDIR_rof_recordFILE()
            }

            //STOP BUTTON
            calculated_time.training_time = calculated_time.training_time - 1 ;
        }
        //GLOBAL STOPER FUNCTION
        function stoper () {


            //console.log(calculated_time.elapsed_min + ':' + calculated_time.elapsed_sec);
            //console.log(elapsed_cycle);

            calculated_time.elapsed_min = Math.floor(calculated_time.training_time/60);
            calculated_time.elapsed_sec = pad(calculated_time.training_time%60);



            if (((calculated_time.training_time) <=0 || bar_button_data_to_server.stop || elapsed_cycle <=0) && !training_done ){
                play_sound('stoper_end');
                clearInterval(stoper_interval_handle);
                console.log('WELL DONE');
                training_done = true;
                socket.emit('bar_button_data_from_server_socket', {elapsed_min: calculated_time.elapsed_min, elapsed_sec: calculated_time.elapsed_sec, elapsed_cycle: elapsed_cycle, disp_phase_val: disp_phase_val})
                bar_button_data_to_server = {start: 0, stop: 0, rec: 0}
            }

            //EXTERNAL FROM RS232!!!!!
            calculated_time.training_time = calculated_time.training_time - 1 ;
            elapsed_cycle = elapsed_cycle - 1;
            disp_phase_val = !disp_phase_val;

        }
        //SOUNDS
        function play_sound(play_sound_type){

            if (session_settings.actual_settings.session_settings.sound_toggle == true ){
                switch(play_sound_type) {
                    case 'stoper_end':
                        //console.log('stoper_end');
                        socket.emit('exercise_play_sound',{stoper_end: true});
                        break;
                    case 'up1':
                        //console.log('up1');
                        socket.emit('exercise_play_sound',{up1: true});
                        break;
                    case 'down1':
                        //console.log('down1');
                        socket.emit('exercise_play_sound',{down1: true});
                        break;
                    case 'up2':
                        //console.log('up2');
                        socket.emit('exercise_play_sound',{up2: true});
                        break;
                    case 'down2':
                        //console.log('down2');
                        socket.emit('exercise_play_sound',{down2: true});
                        break;
                    default:
                }
            } else{
                console.log('CISZA');
            }

        }

    });
}


function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

function calc_elapsed_time(min, sec){
    var training_time = parseInt(min*60) + parseInt(sec);
    var elapsed_min =  Math.floor(training_time/60);
    var elapsed_sec = pad(training_time%60);
    return {training_time: training_time, elapsed_min: elapsed_min, elapsed_sec: elapsed_sec}
}

function update_init_params() {
    calculated_time = calc_elapsed_time(session_settings.actual_settings.session_settings.duration_min_INA, session_settings.actual_settings.session_settings.duration_sec_INA);
    elapsed_cycle = session_settings.actual_settings.session_settings.duration_cycle_INA;
}

function createDIR_rof_recordFILE(){
    var DISK_LETTER = 'C';
    var NOW_DATE = new Date().toISOString();

    var dir_path = DISK_LETTER + ':/' + session_settings.actual_settings.session_settings.username + '/' + NOW_DATE + '/';

    console.log(dir_path)

    mkdirp(dir_path, function (err) {
        if (err) console.error(err);
        else console.log('CREATED_DIR_FOR_RECORD');
    })
}


