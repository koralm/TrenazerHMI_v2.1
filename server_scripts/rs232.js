//EVENT EMIT

var EventEmitter = require("events");
var rs232_cycle_event = new EventEmitter();


var rs232_emulator_interval_handle = setInterval(rs232_emulator, 10);

function rs232_emulator () {
    //console.log('cykl');
    rs232_cycle_event.emit("cykl");
}

exports.rs232_cycle_eventE = rs232_cycle_event;