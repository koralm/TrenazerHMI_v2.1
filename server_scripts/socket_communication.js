
var rs232 = require('../server_scripts/rs232.js');
var fs = require('fs');
var mkdirp = require('mkdirp');
var EventEmitter = require("events");
var training_doneE = new EventEmitter();
training_doneE.setMaxListeners(0);

//SESION SETTINGS FROM SERVER INIT PARAMETERS
calculated_time = { training_time:  0}

var catalog_def_name = 'Wpisz nazwę katalogu (domyślna: data)';
var file_def_name = 'Wpisz nazwę katalogu (domyślna: godzina)';

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
                folder_name_INA: catalog_def_name,
                file_name_INA: file_def_name,
                sound_toggle: true,
                menu_toggle: false } } }
//     actual_settings.session_settings.duration_min_INA: 0,
//     actual_settings.session_settings.duration_sec_INA: 0;
// };


//SESTION TO SERVER INIT PARAMETERS
var bar_button_data_to_server = {start: 0, stop: 0, rec: 0, end: 0};

//VAR SEND TO HMI CYCLICALLY (RS232)
var data_from232 = {};
var calculated_time;
var elapsed_cycle;
var disp_phase_val = false;
var training_done = false;
var rs232_measured_values = {
    values: [
        mean_force_acc= 9,
        mean_force_brake= 8,
        mean_force_cycle= 7,
        time_acc_phase= 6,
        time_brake_phase= 5,
        time_cycle= 4,
        max_speed_cycle= 3,
        max_pos_cyc= 5,
        concetrate_pointer= 0]};

//UNITS TABLE
var rs232_measured_values_units = {
    values: [
        mean_force_acc = 'N',
        mean_force_brake= 'N',
        mean_force_cycle= 'N',
        time_acc_phase= 'ms',
        time_brake_phase= 'ms',
        time_cycle= 'ms',
        max_speed_cycle= 'm/s',
        max_pos_cyc= 'cm',
        concetrate_pointer= 'N']};



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
            console.log('F', session_settings);
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
        /*---------------------------//MAIN CYCLE FROM RS232//-------------------------------------------*/

        var i = 0;
        var ii = 0;

        rs232.rs232_takt_eventE.on("takt", function () {
        //rs232.rs232_cycle_eventE.on("faza", function () {
            if ((bar_button_data_to_server.start || bar_button_data_to_server.rec) && training_done === false){

                if (i>100){
                    update_values_to_display(socket);
                    i=0;
                    console.log('takt')
                }

                if (ii>50) {
                    if (rec_enable === true) {
                        write_stream();
                    }
                }

                i++;
                ii++;
            }

        });


        /*---------------------------//MAIN CYCLE FROM RS232//-------------------------------------------*/
        /*---------------------------//MAIN CYCLE FROM RS232//-------------------------------------------*/
        //STOP_AW
        //var stop_flag = 0;

        rs232.rs232_emergency_stop_eventE.on("stop", function () {
            socket.emit('stop_RED');
        });



        rs232.rs232_emergency_stop_eventE.on("clear", function () {
            socket.emit('stop_clear')
        });

        //BAR BUTTONS LOGIC
        function bar_buttons_function() {

            //ON START BUTTON
            if (bar_button_data_to_server.start && !bar_button_data_to_server.rec){
                //on_start_button
                console.log('START_BUTTON');

                training_done = false;
                //UPDATE PARAMS


                update_init_params();

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

        //function check_training_done

        /*-----------------------------END_TRAINING_EVENT---------------------------------------------*/

        training_doneE.on("training_done",function (){
            console.log('WELL DONE');
            training_done = true;

            //STOPER PAUSE
            clearInterval(stoper_interval_handle);
            //calculated_time.training_time = calculated_time.training_time - 1;
            //END WRTIE
            if (rec_enable === true){
                rec_enable = false;
                end_streams();
            }




            //UPDATE DISPLAYS
            update_values_to_display(socket);
            socket.emit('bar_button_data_from_server_socket', {data_from232: data_from232});
            if (!(bar_button_data_to_server.end)){play_sound('stoper_end',socket);}


        });
        /*-----------------------------END_TRAINING_EVENT---------------------------------------------*/

        /*--------------------------------CALIVRATION------------------------------------------------*/
        socket.on('calib_value', function (data){
            rs232.rs_statusSET(0);
            rs232.rs_statusSET(7);
            rs232.rs_statusSET(3);
            rs232.rs_statusSET(0);
            rs232.rs_statusSET(0);
            rs232.rs_statusSET(4);
            rs232.rs_calib_forceSET(data/100);
            rs232.rs_statusSET(5);
            rs232.rs_calib_forceSET(0);
            rs232.rs_statusSET(0);
        })
    });
};




//SOUNDS
function play_sound(play_sound_type, socket){
        if (session_settings.actual_settings.session_settings.sound_toggle === true) {
            switch (play_sound_type) {
                case 'stoper_end':
                    socket.emit('exercise_play_sound', {stoper_end: true});
                    break;
                case 'up1':
                    //console.log('up1');
                    socket.emit('exercise_play_sound', {up1: true});
                    break;
                case 'down1':
                    //console.log('down1');
                    socket.emit('exercise_play_sound', {down1: true});
                    break;
                case 'up2':
                    //console.log('up2');
                    socket.emit('exercise_play_sound', {up2: true});
                    break;
                case 'down2':
                    //console.log('down2');
                    socket.emit('exercise_play_sound', {down2: true});
                    break;
                default:
            }
        } else {
            console.log('CISZA');
        }
}


//DETECT_SOUND_TO_PLAY
function bar_sound_detect1(display_value,socket) {

    //console.log(display_value)

    if (display_value < 25 && sound_flags.flag1 === 0){
        //console.log('<25')
        play_sound('down1',socket);
        setTimeout(function(){sound_flags.flag1 = 1},1);
    }

    if (display_value > 75 && sound_flags.flag2 === 0){
        //console.log('>75')
        play_sound('up1',socket);
        setTimeout(function(){sound_flags.flag2 = 1},1);

    }
    if (display_value >= 25 && display_value <= 75){
        //console.log('>25<75')
        sound_flags.flag1 = 0;
        sound_flags.flag2 = 0;
    }
}

function bar_sound_detect2(display_value,socket) {

    if (display_value < 25 && sound_flags.flag3 === 0){
        //console.log('<25')
        play_sound('down2',socket);
        setTimeout(function(){sound_flags.flag3 = 1}, 1);
    }

    if (display_value > 75 && sound_flags.flag4 === 0){
        //console.log('>75')
        play_sound('up2',socket);
        //sound_flags.flag4 = 1
        setTimeout(function(){sound_flags.flag4 = 1}, 1);

    }
    if (display_value >= 25 && display_value <= 75){
        //console.log('>25<75')
        sound_flags.flag3 = 0;
        sound_flags.flag4 = 0;
    }
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

function createDIR_rof_recordFILE() {
    var DISK_LETTER = 'C';
    var NOW_DATE = new Date().toISOString().replace(/T.+/, '');
    var NOW_TIME = new Date().getHours() + '_' + new Date().getMinutes() + '_' + new Date().getSeconds();
    var dir_path;
    var stream_path;

    if (session_settings.actual_settings.session_settings.folder_name_INA === catalog_def_name &&  session_settings.actual_settings.session_settings.file_name_INA === file_def_name){

        dir_path = DISK_LETTER + ':/' + session_settings.actual_settings.session_settings.username + '/' + NOW_DATE + '/';
        stream_path = dir_path + NOW_TIME

    }else if (session_settings.actual_settings.session_settings.folder_name_INA === catalog_def_name &&  !(session_settings.actual_settings.session_settings.file_name_INA === file_def_name)) {
        dir_path = DISK_LETTER + ':/' + session_settings.actual_settings.session_settings.username + '/' + NOW_DATE + '/';
        stream_path = dir_path + session_settings.actual_settings.session_settings.file_name_INA

    }else if (!(session_settings.actual_settings.session_settings.folder_name_INA === catalog_def_name) &&  session_settings.actual_settings.session_settings.file_name_INA === file_def_name) {
        dir_path = DISK_LETTER + ':/' + session_settings.actual_settings.session_settings.username + '/' + session_settings.actual_settings.session_settings.folder_name_INA + '/';
        stream_path = dir_path + NOW_TIME

    }else{
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
    write_stream_ciagly.write(prepare_string_to_save_ciagly());
    write_stream_ilosciowy.write(prepare_string_to_save_ilosciowy())
}

function end_streams(){
    write_stream_ciagly.end();
    write_stream_ilosciowy.end();
}

function prepare_session_settimgs(){
    //console.log(session_settings.actual_settings.session_settings.duration_sec_INA.length);
    //console.log(pad(session_settings.actual_settings.session_settings.duration_sec_INA));
    if (session_settings.actual_settings.session_settings.duration_min_INA === ''){session_settings.actual_settings.session_settings.duration_min_INA = 0}
    if (session_settings.actual_settings.session_settings.duration_sec_INA === ''){session_settings.actual_settings.session_settings.duration_sec_INA = 0}
    if (session_settings.actual_settings.session_settings.duration_cycle_INA === ''){session_settings.actual_settings.session_settings.duration_cycle_INA = 0}
    if (session_settings.actual_settings.session_settings.folder_name_INA === ''){session_settings.actual_settings.session_settings.folder_name_INA = catalog_def_name}
    if (session_settings.actual_settings.session_settings.file_name_INA === ''){session_settings.actual_settings.session_settings.file_name_INA = file_def_name}
}

//GLOBAL STOPER FUNCTION
function stoper () {

    if (!(calculated_time.training_time === 0)) {
        //console.log('X' + calculated_time.training_time);

        if ((calculated_time.training_time) <= 1) {
            calculated_time.elapsed_sec = calculated_time.elapsed_sec - 1;
            //console.log('XXXXXXX' + calculated_time.training_time);
            training_doneE.emit("training_done");

        } else {
            calculated_time.training_time = calculated_time.training_time - 1;
        }

        calculated_time.elapsed_min = Math.floor(calculated_time.training_time / 60);
        calculated_time.elapsed_sec = pad(calculated_time.training_time % 60);
    } else{
        clearInterval(stoper_interval_handle);
    }
}

//CYCLE COUNTER
function cycle_counter(){
    //disp_phase_val = !disp_phase_val;
    //console.log('1')
    if (!(session_settings.actual_settings.session_settings.duration_cycle_INA === '0') && !(session_settings.actual_settings.session_settings.duration_cycle_INA == 0)){
        elapsed_cycle = elapsed_cycle - 1;
        //console.log('2')
        if (elapsed_cycle <= 0){training_doneE.emit("training_done")}
    } else {
        elapsed_cycle++;
        ///console.log('3')
    }
}

//UPDATE VWALUES FROM RS232
function update_values_to_display(socket){

    //console.log('update');


    rs232_measured_values.values[0] = rs232.mean_force_acc.toFixed(2);
    rs232_measured_values.values[1] = rs232.mean_force_brake.toFixed(2);
    rs232_measured_values.values[2] = rs232.mean_force_cycle.toFixed(2);
    rs232_measured_values.values[3] = Math.round(rs232.time_acc_phase);
    rs232_measured_values.values[4] = Math.round(rs232.time_brake_phase);
    rs232_measured_values.values[5] = Math.round(rs232.time_cycle);
    rs232_measured_values.values[6] = rs232.max_speed_cycle.toFixed(2);
    rs232_measured_values.values[7] = rs232.max_pos_cyc.toFixed(2);
    rs232_measured_values.values[8] = rs232.concetrate_pointer.toFixed(2);

    //BAR BUTTON
    data_from232.training_done = training_done;
    data_from232.elapsed_min = calculated_time.elapsed_min;
    data_from232.elapsed_sec = calculated_time.elapsed_sec;
    data_from232.elapsed_cycle = elapsed_cycle;
    data_from232.disp_phase_val = rs232.phase;
    data_from232.display_1_value = rs232_measured_values.values[session_settings.actual_settings.session_settings.disp1_select - 1] + '   ' + rs232_measured_values_units.values[session_settings.actual_settings.session_settings.disp1_select - 1];
    data_from232.display_2_value = rs232_measured_values.values[session_settings.actual_settings.session_settings.disp2_select - 1] + '   ' + rs232_measured_values_units.values[session_settings.actual_settings.session_settings.disp2_select - 1];


    if (session_settings.actual_settings.session_settings.disp1_show === true){
        var disp_1_val = bar_precent_calculate( rs232_measured_values.values[session_settings.actual_settings.session_settings.disp1_select - 1], session_settings.actual_settings.session_settings.disp1_max_INA , session_settings.actual_settings.session_settings.disp1_min_INA);
        data_from232.display_1_bar = disp_1_val;
        bar_sound_detect1(disp_1_val,socket)
    }

    if(session_settings.actual_settings.session_settings.disp2_show === true) {
        var disp_2_val = bar_precent_calculate( rs232_measured_values.values[session_settings.actual_settings.session_settings.disp2_select - 1], session_settings.actual_settings.session_settings.disp2_max_INA , session_settings.actual_settings.session_settings.disp2_min_INA);
        data_from232.display_2_bar = disp_2_val;
        bar_sound_detect2(disp_2_val,socket)
    }
        socket.emit('bar_button_data_from_server_socket', {data_from232: data_from232})

}

//PRECENT_CALCULATE
function bar_precent_calculate(value_from_rs232, max_value, min_value){
    var act_val = value_from_rs232*1.0;
    var range_min = min_value*1.0;
    var range_max = max_value*1.0;
    var temp;

    if( range_min>range_max ){
        temp = range_min;
        range_min=range_max;
        range_max=temp;

    }

    var precent_value = (((act_val - range_min) * 100.0) / (range_max - range_min));

    precent_value = (precent_value <= 100) ? precent_value :  100;

    //console.log(precent_value);

    return precent_value;

}

function prepare_string_to_save_ciagly(){

    return (parseFloat(rs232.mean_force_brake).toFixed(2) + '\t' + parseFloat(rs232.mean_force_acc).toFixed(2)
    + '\t' + parseFloat(rs232.mean_force_cycle).toFixed(2) + '\t' + rs232.time_brake_phase.toFixed(2) + '\t' + rs232.time_acc_phase.toFixed(2)
    + '\t' + rs232.time_cycle.toFixed(2) + '\t' + parseFloat(rs232.max_speed_cycle).toFixed(2) + '\t' + parseFloat(rs232.max_pos_cyc).toFixed(2)
    + '\t' + parseFloat(rs232.concetrate_pointer).toFixed(1) + '\r\n')
}

function prepare_string_to_save_ilosciowy(){
    return(parseFloat(rs232.decoded_datax[2]).toFixed(2) + '\t' + parseFloat(rs232.decoded_datax[3]).toFixed(1) + '\t' + rs232.phase + '\r\n')
}

rs232.rs232_cycle_eventE.on("cykl", function () {
    if ((bar_button_data_to_server.start || bar_button_data_to_server.rec) && training_done === false){
        //console.log(rs232_measured_values.values[0]);
        cycle_counter()
        //update_values_to_display();
    }
});