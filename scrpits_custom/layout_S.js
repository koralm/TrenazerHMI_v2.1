

//$(function() {

//});

socket.on('stop_RED', function (data) {
    //alert('kon')
    $('#AW_STOP').modal({
        keyboard: false,
        backdrop: 'static'
    })
});


socket.on('stop_clear', function (data) {
    //alert('poncz')
    //window.location = '/ustawienia';
    $('#AW_STOP').modal('hide');
});

