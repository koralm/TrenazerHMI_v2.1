socket.on('stop_RED', function (data) {
    if (!$('#AW_STOP').hasClass('show')){
        $('#AW_STOP').modal({
            keyboard: false,
            backdrop: 'static'
        })
    } else {
        //alert('bad')
    }
});


socket.on('stop_clear', function (data) {

    // if ($('#AW_STOP').hasClass('show')){
    //     $('#AW_STOP').modal('hide');
    //     location.reload();
    // }
    $('#AW_STOP').modal('hide')
    location.reload()
    //$('#AW_STOP').modal('hide')
});