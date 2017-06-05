var rs232 = require('../server_scripts/rs232.js');

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

module.exports = function (io) {
    io.on('connection', function (socket) {


        //INCOMING SESSION DATA ON TRAINING LOAD
        socket.on('session_settings', function (data) {
            session_settings = data;
            exports.session_settingsE = data;

            console.log(session_settings);
            update_init_params()

        });

        //INCOMING BAR BUTTON DATA
        socket.on('bar_button_data_to_server_socket', function (data) {


            var stoper_interval_handle;
            bar_button_data_to_server = data;
            exports.bar_button_data_to_serverE = data;
            console.log(data);

            //ON START BUTTON
            if (bar_button_data_to_server.start && !bar_button_data_to_server.rec){
                //on_start_button
                console.log('START_BUTTON');
                training_done = false;
                //UPDATE PARAMS
                update_init_params()

                //START STOPER
                stoper_interval_handle = setInterval(stoper, 1000);
                }

            //ON REC BUTTON
            //REC PUSH AND !START
            if (bar_button_data_to_server.rec && !bar_button_data_to_server.start){
                //on_start_button
                console.log('REC + !START');
                training_done = false;
                //UPDATE PARAMS
                update_init_params()

                //START STOPER
                stoper_interval_handle = setInterval(stoper, 1000);
            }

            //REC PUSH AND START
            if (bar_button_data_to_server.rec && bar_button_data_to_server.start){
                //on_start_button
                console.log('REC + START');

                //START RECORD TO FILE
            }

            //STOP BUTTON


            //GLOBAL STOPER FUNCTION
            function stoper () {

                calculated_time.training_time = calculated_time.training_time - 1 ;

                calculated_time.elapsed_min = Math.floor(calculated_time.training_time/60);
                calculated_time.elapsed_sec = pad(calculated_time.training_time%60);

                //EXTERNAL FROM RS232!!!!!
                elapsed_cycle = elapsed_cycle - 1;
                disp_phase_val = !disp_phase_val;



                console.log(calculated_time.elapsed_min + ':' + calculated_time.elapsed_sec)

                if ((calculated_time.training_time <= 0 || bar_button_data_to_server.stop || elapsed_cycle <= 0) && !training_done ){
                    clearInterval(stoper_interval_handle)
                    console.log('WELL DONE')
                    socket.emit('exercise_play_sound',{stoper_end: true});
                    training_done = true;
                    bar_button_data_to_server = {start: 0, stop: 0, rec: 0}
                }
        }});

        rs232.rs232_cycle_eventE.on("cykl", function () {
            if (bar_button_data_to_server.start || bar_button_data_to_server.rec){
                socket.emit('bar_button_data_from_server_socket', {elapsed_min: calculated_time.elapsed_min, elapsed_sec: calculated_time.elapsed_sec, elapsed_cycle: elapsed_cycle, disp_phase_val: disp_phase_val});
            };
        })

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