var serialport = require('serialport');
var Eventemitter = require("events").EventEmitter;

// /*---------------EMULATOR---------------*/
//
var rs232_takt_event = new Eventemitter ();
var rs232_cycle_event = new Eventemitter ();
var rs232_emergency_stop_event = new Eventemitter ();
rs232_takt_event.setMaxListeners(0);
rs232_cycle_event.setMaxListeners(0);
rs232_emergency_stop_event.setMaxListeners(0);
//
//
// var rs232_emulator_interval_handle = setInterval(rs232_emulator, 100);
// var rs232_emulator_cycle = setInterval(rs232_emulator_cykl, 500);
//
// function rs232_emulator () {
//     rs232_takt_event.emit("takt");
// }
//
// var i = 0;
//
// exports.phase = true;
//
// function rs232_emulator_cykl () {
//     rs232_cycle_event.emit("cykl");
//
//
//     exports.mean_force_acc = 15 +i;
//     exports.mean_force_brake = 16 +i;
//     exports.mean_force_cycle = 17 +i;
//     exports.time_acc_phase = 18 +i;
//     exports.time_brake_phase = 19 +i;
//     exports.time_cycle = 20 +i;
//     exports.max_speed_cycle = 21 +i;
//     exports.max_pos_cyc = 22 +i;
//     exports.concetrate_pointer = 30 + i;
//
//     exports.decoded_data = [1,2,3,4,5,6];
//     exports.phase = !exports.phase;
//
//     i = i + 0.01;
//
//
// }
//
//
// /*------------EMULATOR------------------*/




/*
 * INITIALIZE VARIABLES AND COM
 */
//DO pull origin dodnae XX
//Port settings
var COM_port = "COM4";
var COM_baudrate = 1000000;
var COM_buffer_size = 4096;
var COM_parse_strig = "03037e7e";
var serial_port_USB;


/* INITIALIZE VARIABLES FOR COMMUNICATION BETWEEN MODULES*/
//Recieved from COM
var decoded_data = 0;

//SEND over COM
var time_interval = 1000;           //Send data interval
var frame_header = '7E7E';          //Frame header
var rs_status = '0';                //For calibration status 0,4,1
var rs_line_length = '0';           //Line length
var rs_roller_dist = '0';          //Rollers distance 5mm - 40mm
var rs_record_stat= '7';            //Recod data start-stop
var rs_interia = '0';               //Interia moment x*0.001 eg: 1000*0.001=1
var calib_force = '0';              //Calibration Force
var damping_dynamic = '0';            //tłumienei od prędkości
var damping_static = '0';           //tłumienie statyczne
var frame_terminator = '0303';      //Frame terminator

//Receive form COM
var stop_aw = 0;
var speed_controler_off = 0;
var tryb_pracy = 0;
var induc_sens= 0;
var phase = 0;
var strength_r = 0;
var line_ok = 0;

//Formats
//Ilosciowy
var force_sum = 0;
var mean_force_acc = 0;
var mean_force_brake = 0;
var mean_force_cycle = 0;
var time_acc_phase =0;
var time_brake_phase =0;
var time_cycle =0;
var concetrate_pointer =0;

var help_count=0;
var phase0_count=0;
var speed = 0;

var phase_hist = 3;
var max_pos_cyc = 0;
var max_speed_cycle = 0;

var val_strength_table_sum = 0;
var force_mean_count = 0;
var force_sum_count = 0;


val_strength_table = new Array(3000);

var COM_port_list;



function COM_list(callback){

    serialport.list(function (err, ports) {
        ports.forEach(function (port) {
            console.log(port.comName);
            COM_port_list = port.comName;
        });
        callback(COM_port_list);
    });

    return COM_port_list
}

COM_list(function (data){
    //Open Serial port
    serial_port_USB = new serialport(data, {
        baudRate: COM_baudrate,
        bufferSize: COM_buffer_size,
        parser: serialport.parsers.readline(COM_parse_strig, 'hex'),
        autoOpen: false
    });

    serial_port_USB.open(function (error) {
        if (error) {
            console.log('failed to open COM: ' + error);
        } else {
            console.log(COM_port + ' open');
            //console.log([frame_header,'0',rs_line_length,rs_roller_dist,rs_record_stat,rs_interia,calib_force,damping_dynamic,damping_static,frame_terminator]);
        }
    });



//RECEIVE DATA
serial_port_USB.on('data', function (data) {
    //sp_ov_USB.flush();
    //decode data
    decoded_data = decode_recev_data(data);

    //CONSOLE display received data
    disp_recev_data(decoded_data);
    strength_r=decoded_data[2];

    //DECODE ERROR
    decode_speed_status(decoded_data[4]);
    decode_stop(decoded_data[4]);
    decode_work(decoded_data[4]);
    decode_induction(decoded_data[4]);
    decode_phase(decoded_data[4]);
    decode_line_ok(decoded_data[4]);

    //PARAMS TO SAVE
    force_sum = force_sum + decoded_data[2];


    //COUNTERS
    phase0_count = phase0_count + 1;

    //max position in cycle
    if (max_pos_cyc<decoded_data[3]){
        max_pos_cyc = decoded_data[3]
    }

    //max speed in cycle
    if (max_speed_cycle<decoded_data[5]){
        max_speed_cycle= decoded_data[5]
    }

    //values to mean
    val_strength_table.shift();
    val_strength_table.push(decoded_data[2]);

    //FLAG
    if (phase != phase_hist){

        if (help_count == 0){
            //console.log("wciaga");
            mean_force_brake = force_sum/phase0_count;
            exports.mean_force_brake = mean_force_brake;
            time_acc_phase = phase0_count;
            exports.time_acc_phase = time_acc_phase;
            //console.log(mean_force_brake);
        }

        if (help_count == 1){
            mean_force_acc = force_sum/phase0_count;
            exports.mean_force_acc = mean_force_acc;
            time_brake_phase =phase0_count;
            exports.time_brake_phase = phase0_count;
        }

        rs232_cycle_event.emit("faza");

        //CONSOLE LOG DATA
        phase0_count = 0;
        force_sum = 0;
        help_count ++;


        if (help_count == 2){
            help_count = 0;
            //console.log("cykl");
            exports.mean_force_cycle = (mean_force_brake + mean_force_acc)/2;
            exports.time_cycle = time_acc_phase + time_brake_phase;
            exports.max_pos_cyc = rs_line_length - max_pos_cyc;
            exports.max_speed_cycle = max_speed_cycle;


            //concentrate function
            //CALC Mean

            for (ix=0; ix < val_strength_table.length-1; ix++){
                if (val_strength_table[ix]!=0){
                    force_sum_count++;
                    val_strength_table_sum += val_strength_table[ix] ;
                }
            }

            force_mean = val_strength_table_sum/force_sum_count;


            //CALC AVV mean
            for (i=0; i < val_strength_table.length-1; i++){
                if ((parseFloat(val_strength_table[i]).toFixed(2) > parseFloat(force_mean).toFixed(2)) && (val_strength_table[i]!=0) ){
                    force_mean_count++;
                }
            }

            exports.concetrate_pointer = ((1.0-(force_mean_count/force_sum_count))*100);

            rs232_cycle_event.emit("cykl");



            //console.log(time_cycle);
            mean_force_brake=0;
            mean_force_acc=0;
            time_acc_phase = 0;
            time_brake_phase = 0;
            max_pos_cyc = 0;
            force_mean = 0;
            max_speed_cycle =0;
            val_strength_table_sum = 0;
            force_mean_count = 0;
            force_sum_count = 0;
            val_strength_table.fill(0);
        }
    }


    //SAVE TO FILE
    exports.decoded_datax = decoded_data;
    exports.phase = phase;
    exports.rs232_takt_eventE.emit("takt");
    phase_hist = phase;

});
});


function decode_recev_data(data){
    var bufferek = new Buffer(data ,'hex');
    if (bufferek.length == 27) {
        var position = bufferek.readDoubleLE(8);
        var strength = bufferek.readDoubleLE(0);
        var speed = bufferek.readDoubleLE(16);
        var induction_sens = bufferek.readUInt8(24);
        var sample_nr = bufferek.readUInt16LE(25);

        return([data,sample_nr,strength,position,induction_sens,speed]);
    }else {
        //console.log("Bad_frame_decode")
        return(decoded_data)
    }
}

function disp_recev_data(data){
//     console.log('data received: ' + data[0]);
//     console.log('probka: ' + data[1]);//.toString());
//     console.log('sila: ' + data[2]);//.toString());
//     console.log('polozenie: ' + data[3]);//.toString());
//     console.log('czujnik: ' + data[4]);//.toString());
//     console.log('predkosc: ' + data[5]);//.toString());
}

function code_send_data(send_frame){
    var header = new Buffer(send_frame[0] ,'hex');
    var send_buffer = new Buffer(12);
    send_buffer.writeUInt8(send_frame[1].toString(16),0,'hex');
    send_buffer.writeUInt8(send_frame[2].toString(16),1,'hex');
    send_buffer.writeUInt8(send_frame[3].toString(16),2,'hex');
    send_buffer.writeUInt8(send_frame[4].toString(16),3,'hex');
    send_buffer.writeUInt16LE(send_frame[5].toString(16),4,'hex');
    send_buffer.writeUInt16LE(send_frame[6].toString(16),6,'hex');
    send_buffer.writeUInt16LE(send_frame[7].toString(16),8,'hex');
    send_buffer.writeUInt16LE(send_frame[8].toString(16),10,'hex');
    var terminator = new Buffer(send_frame[9] ,'hex');
    var rs_frameout = Buffer.concat([header,send_buffer,terminator]);
    //console.log(rs_frameout)
    return(rs_frameout);
}

//*1000 from g to kg 0.3 = 300 (to string)
function push_rs232(){
    var send_frame = [frame_header,rs_status,rs_line_length,(rs_roller_dist*10).toString(),rs_record_stat,(rs_interia*100).toString(),calib_force.toString(),damping_dynamic,damping_static,frame_terminator];
    serial_port_USB.write(code_send_data(send_frame));
    console.log(send_frame);
    //console.log(code_send_data(send_frame))
}

function decode_speed_status(data) {
    if ((data & 32) == 32) {
        //console.log("STOP ok")
        speed_controler_off = 1;
    } else {
        //console.log("STOP wcisnięty")
        speed_controler_off = 0;
    }
}

function decode_stop(data){
    if ((data & 64) == 64) {
        //console.log("STOP ok")
        if (stop_aw === 0){
            rs232_emergency_stop_event.emit("clear");
            console.log('OK')
        }


        stop_aw=1;
    } else {
        //console.log("STOP wcisnięty")
        if (stop_aw === 1){
            rs232_emergency_stop_event.emit("stop");
            console.log('STOP')
        }
        stop_aw=0;
    }
}

function decode_work(data){
    if ((data & 128) == 128) {
        //console.log("Tryb pracy")
        tryb_pracy = 1;
    } else {
        //console.log("Tryb kalibracji")
        tryb_pracy = 0;
    }
}

function decode_line_ok(data){
    if ((data & 8) == 8) {
        //console.log("lina_ok");
        line_ok = 1;
    } else {
        //console.log("lina_fail");
        //console.log(parseInt(data, 10).toString(2))
        line_ok = 0;
    }
}

function decode_phase(data){
    if ((data & 2) == 2) {
        //console.log("faza_1");
        phase= 1;
    } else {
        //console.log("faza_0");
        phase = 0;
    }
}

function decode_induction(data){
    if ((data & 1) == 1) {
        //console.log("Czujnik krzywo")
        induc_sens = 1;
    } else {
        //console.log("Czujnik OK")
        induc_sens = 0;
    }
}

//tryb||stopAW||UDP||XX||lina_ok||XX||faza||czujnik

//EXPORTS

exports.rs_damp_dynamicSET = function (data) {
    damping_dynamic = data;
    push_rs232();
};

exports.rs_damp_staticSET= function (data) {
    damping_static = data;
    push_rs232();
};

exports.rs_statusSET = function (data) {
    rs_status = data;
    push_rs232();
};

exports.rs_line_lengthSET = function (data) {
    rs_line_length = data;
    push_rs232();
};

exports.rs_roller_distSET = function (data) {
    rs_roller_dist = data;
    push_rs232();
};

exports.rs_interiaSET = function (data) {
    rs_interia = data;
    push_rs232();
};

exports.rs_calib_forceSET = function (data) {
    calib_force = data;
    push_rs232();
};



//exports.rs_startSET = function (data) {
//    rs_start_F(data);
//    console.log(data);
//};

exports.rs_receivedREAD = function () {
    return decoded_data;
};

exports.rs_inductionREAD = function () {
    return decoded_data[4];
};

exports.rs_speedSTAT = function () {
    return speed_controler_off;
};

//Edycja stop awaryjny lub speed contorler

var stat_stop = 0;
exports.rs_stopRED = function () {
    if (stop_aw && speed_controler_off){
        stat_stop = 1;
    }else{
        stat_stop = 0;
    }

    //console.log(stat_stop)
    return stat_stop;
    //return stop_aw;
};

exports.rs_ind_sens = function () {
    return induc_sens;
};

exports.rs_line_ok = function () {
    return line_ok;
};

exports.rs_phase_sens = function () {
    return phase;
};

exports.rs_positon_READ = function (){
    return decoded_data[3];
};

exports.rs_strength_READ = function (){
    return strength_r;
};

exports.rs_speedREAD = function (){
    return speed;
};

exports.rs232_cycle_eventE = rs232_cycle_event;
exports.rs232_takt_eventE = rs232_takt_event;
exports.rs232_emergency_stop_eventE = rs232_emergency_stop_event;