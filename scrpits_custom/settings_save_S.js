//INIT SECTION
// KEYBOARD
$(function () {

    $('#settings_profile_name_IN').keyboard({
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


//START BUTTON CLICK FUCTION
// - check user name exist
// - send user namer to server



    //SEND SETTIINGS TO SERVER
    $(function(){

        var filename = {};

        $("#save_settings").click(function(){
            filename.filename = $('#settings_profile_name_IN').val();

            if (filename.filename == 0){
                var saved_settings_alert = '<div role="alert" class="alert alert-success alert-dismissible fade show"> <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button> <h2> <strong>Zapisano ustawienia</strong> pod wybraną nazwą: ' + 'wygenerowaną automatycznie' + '</h2> </div>';
            } else {
                var saved_settings_alert = '<div role="alert" class="alert alert-success alert-dismissible fade show"> <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button> <h2> <strong>Zapisano ustawienia</strong> pod wybraną nazwą: ' + JSON.stringify(filename.filename) + '</h2> </div>';
            }


            $( "#alert_setting_saved" ).html(saved_settings_alert);

            $.ajax({
                url: '/zapisz/zapisywanie',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(filename),
                success: function () {}
            })
        })});

});

$(function() {
    $("#button_start_exercies").click(function () {
        $("#alert_bad_values").empty();

        var length_error_alert = '<div role="alert" class="alert alert-danger alert-dismissible fade show"> <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button> <h2> <strong>' + 'Po kliknięciu WYCIĄGNIJ LINE JESZCZE RAZ' + '</strong></h2> </div>';
        $("#alert_line_fold").html(length_error_alert);

        $("#button_start_exercies").prop('disabled', true)
    })
});