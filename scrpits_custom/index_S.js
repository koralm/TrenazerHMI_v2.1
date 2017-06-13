$(function () {

    $.keyboard.keyaction.enter = function( kb ) {
        // same as $.keyboard.keyaction.accept();
        kb.close( true );
        return false;     // return false prevents further processing
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