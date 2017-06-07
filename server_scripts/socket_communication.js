
var rs232 = require('../server_scripts/rs232.js');
var fs = require('fs');
var mkdirp = require('mkdirp');
var EventEmitter = require("events");
var training_doneE = new EventEmitter();

//SESION SETTINGS FROM SERVER INIT PARAMETERS
calculated_time = { training_time:  0}

var session_settings = { actual_settings:
    { username: 'INIT',
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
                folder_name_INA: 'data',
                file_name_INA: 'godzina',
                sound_toggle: true,
                menu_toggle: false } } }
//     actual_settings.session_settings.duration_min_INA: 0,
//     actual_settings.session_settings.duration_sec_INA: 0;
// };


//SESTION TO SERVER INIT PARAMETERS
var bar_button_data_to_server = {start: 0, stop: 0, rec: 0};

//VAR SEND TO HMI CYCLICALLY (RS232)
var data_from232 = {};
var calculated_time;
var elapsed_cycle;
var disp_phase_val = false;
var training_done = false;

//Handlers
var stoper_interval_handle;
var write_stream_ciagly;
var write_stream_ilosciowy;

//SEMAFORS
var rec_enable = false;
var sound_flags = { flag1: 0,
                    flag2: 0,
                    flag3: 0,
                    flag4: 0};

module.exports = function (io) {
    io.on('connection', function (socket) {

/*---------------------------//SOCKET INCOMING DATA//-------------------------------------------*/

        //INCOMING SESSION DATA ON TRAINING LOAD
        socket.on('session_settings', function (data) {
            session_settings = data;
            prepare_session_settimgs(session_settings);
            session_settings.actual_settings.session_settings.username = session_settings.actual_settings.session_settings.username.replace(/\s+/g, '')
            console.log(session_settings);
            update_init_params()

        });

        //INCOMING BAR BUTTON DATA
        socket.on('bar_button_data_to_server_socket', function (data) {

            bar_button_data_to_server = data;
            //exports.bar_button_data_to_serverE = data;
            console.log(data);
            bar_buttons_function();
        });

/*---------------------------//SOCKET INCOMING DATA//-------------------------------------------*/

/*---------------------------//MAIN CYCLE FROM RS232//-------------------------------------------*/

        rs232.rs232_cycle_eventE.on("cykl", function () {
            if (bar_button_data_to_server.start || bar_button_data_to_server.rec){
                update_values_to_display();
                socket.emit('bar_button_data_from_server_socket', {data_from232: data_from232});
                if (rec_enable === true){
                    write_stream();
                }
            }
        });

/*---------------------------//MAIN CYCLE FROM RS232//-------------------------------------------*/


/*-----------------------------END_TRAINING_EVENT---------------------------------------------*/

        training_doneE.on("training_done",function (){
            console.log('WELL DONE');

            //STOPER PAUSE
            clearInterval(stoper_interval_handle);

            //END WRTIE
            if (rec_enable === true){
                rec_enable = false;
                end_streams();
            }

            play_sound('stoper_end');
            training_done = true;

            //UPDATE DISPLAYS
            update_values_to_display();
            socket.emit('bar_button_data_from_server_socket', {data_from232: data_from232});
            bar_button_data_to_server = {start: 0, stop: 0, rec: 0}

        });

/*-----------------------------END_TRAINING_EVENT---------------------------------------------*/


        //GLOBAL STOPER FUNCTION
        function stoper () {

            console.log(calculated_time.training_time);
            if (!(calculated_time.training_time === 0)) {
                //console.log(calculated_time.training_time);

                if ((calculated_time.training_time) <= 0) {

                    training_doneE.emit("training_done");

                } else {
                    //EXTERNAL FROM RS232!!!!!
                    calculated_time.training_time = calculated_time.training_time - 1;
                    elapsed_cycle = elapsed_cycle - 1;
                    disp_phase_val = !disp_phase_val;
                }

                calculated_time.elapsed_min = Math.floor(calculated_time.training_time / 60);
                calculated_time.elapsed_sec = pad(calculated_time.training_time % 60);
            } else{
                clearInterval(stoper_interval_handle);
            }
        }

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

            //ON STOP BUTTON
            if (bar_button_data_to_server.stop){
                training_doneE.emit("training_done");
            }
        }

        //UPDATE VWALUES FROM RS232
        function update_values_to_display(){

            //BAR BUTTON
            data_from232.training_done = training_done;
            data_from232.elapsed_min = calculated_time.elapsed_min;
            data_from232.elapsed_sec = calculated_time.elapsed_sec;
            data_from232.elapsed_cycle = elapsed_cycle;
            data_from232.disp_phase_val = disp_phase_val;
            data_from232.display_1_value = calculated_time.elapsed_min + '.' + calculated_time.elapsed_sec;
            data_from232.display_2_value = calculated_time.elapsed_min + '.' + calculated_time.elapsed_sec;

            if (session_settings.actual_settings.session_settings.disp1_show === true){
                data_from232.display_1_bar = bar_precent_calculate(calculated_time.elapsed_sec, 20 , 0);
                bar_sound_detect1(bar_precent_calculate(calculated_time.elapsed_sec, 20 , 0))
            }

            if(session_settings.actual_settings.session_settings.disp2_show === true) {
                data_from232.display_2_bar = bar_precent_calculate(calculated_time.elapsed_sec, 30 , 0);
                bar_sound_detect2(bar_precent_calculate(calculated_time.elapsed_sec, 30 , 0))
            }


            //DISPLAYS
        }

        //PRECENT_CALCULATE
        function bar_precent_calculate(value_from_rs232, max_value, min_value){
            var act_val = value_from_rs232*1.0;
            var range_min = min_value*1.0;
            var range_max = max_value*1.0;
            var temp;

            if( range_min>range_max ){
                temp = range_min
                range_min=range_max;
                range_max=temp;

            }

            var precent_value = (((act_val - range_min) * 100.0) / (range_max - range_min));

            return precent_value;

        }

        //SOUNDS
        function play_sound(play_sound_type){

            if (session_settings.actual_settings.session_settings.sound_toggle === true ){
                switch(play_sound_type) {
                    case 'stoper_end':
                        console.log('stoper_end');
                        socket.emit('exercise_play_sound',{stoper_end: true});
                        break;
                    case 'up1':
                        console.log('up1');
                        socket.emit('exercise_play_sound',{up1: true});
                        break;
                    case 'down1':
                        console.log('down1');
                        socket.emit('exercise_play_sound',{down1: true});
                        break;
                    case 'up2':
                        console.log('up2');
                        socket.emit('exercise_play_sound',{up2: true});
                        break;
                    case 'down2':
                        console.log('down2');
                        socket.emit('exercise_play_sound',{down2: true});
                        break;
                    default:
                }
            } else{
                console.log('CISZA');
            }

        }

        //DETECT_SOUND_TO_PLAY
        function bar_sound_detect1(display_value) {

            if (display_value < 25 && sound_flags.flag1 === 0){
                //console.log('<25')
                play_sound('up1');
                setTimeout(function(){sound_flags.flag1 = 1}, 5);
            }

            if (display_value > 75 && sound_flags.flag2 === 0){
                //console.log('>75')
                play_sound('down1');
                setTimeout(function(){sound_flags.flag2 = 1}, 5);

            }
            if (display_value >= 25 && display_value <= 75){
                //console.log('>25<75')
                sound_flags.flag1 = 0;
                sound_flags.flag2 = 0;
            }
        }
        function bar_sound_detect2(display_value) {

            if (display_value < 25 && sound_flags.flag3 === 0){
                //console.log('<25')
                play_sound('up2');
                setTimeout(function(){sound_flags.flag3 = 1}, 5);
            }

            if (display_value > 75 && sound_flags.flag4 === 0){
                //console.log('>75')
                play_sound('down2');
                setTimeout(function(){sound_flags.flag4 = 1}, 5);

            }
            if (display_value >= 25 && display_value <= 75){
                //console.log('>25<75')
                sound_flags.flag3 = 0;
                sound_flags.flag4 = 0;
            }
        }

        //function check_training_done

    });
};


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

function createDIR_rof_recordFILE() {
    var DISK_LETTER = 'C';
    var NOW_DATE = new Date().toISOString().replace(/T.+/, '');
    var NOW_TIME = new Date().getHours() + '_' + new Date().getMinutes() + '_' + new Date().getSeconds();
    var dir_path;
    var stream_path;

    if (session_settings.actual_settings.session_settings.folder_name_INA === 'data'){

        dir_path = DISK_LETTER + ':/' + session_settings.actual_settings.session_settings.username + '/' + NOW_DATE + '/';
        stream_path = dir_path + NOW_TIME

    }else {
        dir_path = DISK_LETTER + ':/' + session_settings.actual_settings.session_settings.username + '/' + session_settings.actual_settings.session_settings.folder_name_INA + '/';
        stream_path = dir_path +  session_settings.actual_settings.session_settings.file_name_INA + '_' + NOW_TIME
    }

    console.log(dir_path);

    mkdirp(dir_path, function (err) {
        if (err) console.error('CREATE_PAHT_ERROR' + err);
        else{
            console.log('CREATED_DIR_FOR_RECORD');
            write_stream_ciagly = fs.createWriteStream(stream_path + "_ciagly" + ".txt" );
            write_stream_ilosciowy = fs.createWriteStream(stream_path + "_ilosciowy" + ".txt" );
        }
    });

    rec_enable=true;

}

function write_stream(data_ciagly, data_ilosciowy) {
    write_stream_ciagly.write("ciagly" + '\r\n')
    write_stream_ilosciowy.write("ilosciowy" + '\r\n')
}

function end_streams(){
    write_stream_ciagly.end();
    write_stream_ilosciowy.end();
}

function prepare_session_settimgs(){
    if (session_settings.actual_settings.session_settings.duration_min_INA === ''){session_settings.actual_settings.session_settings.duration_min_INA = 0}
    if (session_settings.actual_settings.session_settings.duration_sec_INA === ''){session_settings.actual_settings.session_settings.duration_sec_INA = 0}
    if (session_settings.actual_settings.session_settings.duration_cycle_INA === ''){session_settings.actual_settings.session_settings.duration_cycle_INA = 0}
    if (session_settings.actual_settings.session_settings.folder_name_INA === ''){session_settings.actual_settings.session_settings.folder_name_INA = 'data'}
    if (session_settings.actual_settings.session_settings.file_name_INA === ''){session_settings.actual_settings.session_settings.file_name_INA = 'godzina'}
}

