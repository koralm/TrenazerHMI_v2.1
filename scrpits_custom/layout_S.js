/**
 * Created by koralm on 23.05.2017.
 */
$(function () {

    var liczba = 0;


    socket.on('message', function (message) {
        liczba = message;
    });

    socket.emit('connection', { line_l: 15});
});


