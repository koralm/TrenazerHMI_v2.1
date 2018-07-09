$(function () {

    //$.keyboard.keyaction.enter = function( kb ) {
    //    // same as $.keyboard.keyaction.accept();
    //    kb.close( true );
    //    return false;     // return false prevents further processing
   // };

    $.keyboard.keyaction.enter = function(base){
        if (base.el.tagName === "INPUT") {
            base.accept();      // accept the content
            $('form').submit(); // submit form on enter
        } else {
            base.insertText('\r\n'); // textarea
        }
    };


    $('#user_name_input').keyboard({
        // *** choose layout & positioning ***
        // choose from 'qwerty', 'alpha', 'international', 'dvorak', 'num' or
        // 'custom' (to use the customLayout below)
        layout: 'qwerty',
        autoAccept : true,
        usePreview: false,
        visible: function(e, keyboard, el) {
            keyboard.$preview[0].select();
        }
    });

    $('#adv_calib_weight').keyboard({
        layout: 'custom',
        customLayout: {
            'normal' : [
                '0 1 2',
                '3 4 5',
                '6 7 8',
                '{a} {bksp} ,'
            ]
        },
        usePreview: false,
        visible: function(e, keyboard, el) {
            keyboard.$preview[0].select();
        }
    })
});

$(function () {
    $(".alert").alert()
});

//POST
$(function () {

});

//START BUTTON CLICK FUCTION
// - check user name exist
// - send user namer to server

var empty_username_alert = '<div role="alert" class="alert alert-danger alert-dismissible fade show"> <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button> <h2> <strong>BRAK NAZWY UŻYTKOWNIKA</strong> Wpisz nazwę użytkownika</h2> </div>';

$(function(){
    $("#button_start").click(function(){
        if ($( "#user_name_input:text" ).val().length === 0) {
            $( "#alert_no_username" ).html(empty_username_alert);
            $( "#username_input_form" ).addClass( "has-danger" );
        } else {
            $(function () {
                $.ajax({
                    url: '/',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({username: $("#user_name_input").val()}),
                    success:  function (data, textStatus, jqXHR) {
                        window.location = data.redirectUrl;
                    }
                })
            })
        }
    })
});

//CALIBRATION ADD
//Odblokowanie kalibracji
// k/miesiac/godzina/minuty

$(function() {
    $("#user_name_input").change(
        function () {
            var dateNow = new Date();
            //if ($(this).val()===('k'+(dateNow.getMonth() + 1) + '/' + dateNow.getHours() + '/' + dateNow.getMinutes())){$("#button_calibration").prop('disabled', false)}
            if ($(this).val()===('kalibracja')){$("#button_calibration").prop('disabled', false)}
            //alert('k'+(dateNow.getMonth() + 1) + '/' + dateNow.getHours()+ '/' + dateNow.getMinutes());
        }
    )
});

$(function() {
    $("#button_calibration").click( function() {
        $(this).prop('disabled', true);
        $("#adv_calib_mod2").modal('show');
    })

});

$(function() {
    $("#button_adv_calib_conf").click(function () {
        var calibration_value = $("#adv_calib_weight").val();
        //alert(calibration_value);
        $(this).prop('disabled', true);
        $('#button_adv_exit').prop('disabled', true);
        socket.emit('calib_value', calibration_value);
        setTimeout(
            function()
            {
                $("#adv_calib_mod2").modal('hide');
            }, 1000);
    });
});