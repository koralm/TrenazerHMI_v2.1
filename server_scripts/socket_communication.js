var session_settings = {};
var rs232 = require('../server_scripts/rs232.js');
var bar_button_data_to_server = {start: 0, stop: 0, rec: 0};

var calculated_time;
var elapsed_cycle;
var training_done = false;

module.exports = function (io) {
    io.on('connection', function (socket) {


        //INCOMING SESSION DATA ON TRAINING LOAD
        socket.on('session_settings', function (data) {
            session_settings = data;
            exports.session_settingsE = data;

            calculated_time = calc_elapsed_time(session_settings.actual_settings.session_settings.duration_min_INA, session_settings.actual_settings.session_settings.duration_sec_INA);
        });

        //INCOMING BAR BUTTON DATA
        socket.on('bar_button_data_to_server_socket', function (data) {
            console.log(data);
            bar_button_data_to_server = data;
            exports.bar_button_data_to_serverE = data;



            if (bar_button_data_to_server.start){

            var stoper_interval_handle = setInterval(stoper, 1000);

                //on_start_button
                console.log('START_BUTTON');

                function stoper () {

                    calculated_time.training_time = calculated_time.training_time - 1 ;

                    calculated_time.elapsed_min =  Math.floor(calculated_time.training_time/60);
                    calculated_time.elapsed_sec = pad(calculated_time.training_time%60);

                    //EXTERNAL FROM RS232!!!!!
                    elapsed_cycle = calculated_time.elapsed_sec;
                    //

                    console.log(calculated_time.elapsed_min + ':' + calculated_time.elapsed_sec)

                    if (calculated_time.training_time <= 0 || bar_button_data_to_server.stop || elapsed_cycle <= 0 ){
                        clearInterval(stoper_interval_handle)
                        console.log('WELL DONE')
                        training_done = true;
                    }

                }
        }});

        rs232.rs232_cycle_eventE.on("cykl", function () {
            if (bar_button_data_to_server.start){
                socket.emit('bar_button_data_from_server_socket', {elapsed_min: calculated_time.elapsed_min, elapsed_sec: calculated_time.elapsed_sec, elapsed_cycle: elapsed_cycle, training_done: training_done});
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