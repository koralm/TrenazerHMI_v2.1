//INIT SECTION
// KEYBOARD
//DOCUMENT READY
$( document ).ready($(function () {
    $.ajax({
        url: '/ustawienia',
        type: 'POST',
        contentType: 'application/json',
        success:  function (data, textStatus, jqXHR) {

            //DISP 1
            $( "#disp1_show" ).prop('checked', data.actual_settings.session_settings.disp1_show).change();
            $( "#disp1_select" ).val(data.actual_settings.session_settings.disp1_select);
            $( "#disp1_max_INA" ).val(data.actual_settings.session_settings.disp1_max_INA);
            $( "#disp1_min_INA" ).val(data.actual_settings.session_settings.disp1_min_INA);

            //DISP 2
            $( "#disp2_show" ).prop('checked', data.actual_settings.session_settings.disp2_show).change();
            $( "#disp2_select" ).val(data.actual_settings.session_settings.disp2_select);
            $( "#disp2_max_INA" ).val(data.actual_settings.session_settings.disp2_max_INA);
            $( "#disp2_min_INA" ).val(data.actual_settings.session_settings.disp2_min_INA);

            //Exercise
            $( "#line_length_INA" ).val(data.actual_settings.session_settings.line_length_INA);
            $( "#roller_dist_INA" ).val(data.actual_settings.session_settings.roller_dist_INA);
            $( "#mass_INA" ).val(data.actual_settings.session_settings.mass_INA);

            //Duration
            $( "#duration_min_INA" ).val(data.actual_settings.session_settings.duration_min_INA);
            $( "#duration_sec_INA" ).val(data.actual_settings.session_settings.duration_sec_INA);
            $( "#duration_cycle_INA" ).val(data.actual_settings.session_settings.duration_cycle_INA)

            //FOlders
            $( "#folder_name_INA" ).val(data.actual_settings.session_settings.folder_name_INA);
            $( "#file_name_INA" ).val(data.actual_settings.session_settings.file_name_INA);

            //others
            $('#sound_toggle').prop('checked', data.actual_settings.session_settings.sound_toggle).change();
            $('#menu_toggle').prop('checked', data.actual_settings.session_settings.menu_toggle).change();
        }
    })
}))

$(function () {

    $.keyboard.keyaction.enter = function(base){
        if (base.el.tagName === "INPUT") {
            base.accept();      // accept the content
            $('form').submit(); // submit form on enter
        } else {
            base.insertText('\r\n'); // textarea
        }
    };

    $('#line_length_INA, #roller_dist_INA, #mass_INA').keyboard({
        layout: 'custom',
        customLayout: {
            'normal' : [
                '0 1 2',
                '3 4 5',
                '6 7 8',
                '{a} {bksp} .'
            ]
        },
        autoAccept : true,
        usePreview: false,
        visible: function(e, keyboard, el) {
            keyboard.$preview[0].select();
        }
    })

    $('#disp1_max_INA, #disp1_min_INA, #disp2_max_INA,#disp2_min_INA, #duration_min_INA, #duration_sec_INA, #duration_cycle_INA').keyboard({
        layout: 'custom',
        customLayout: {
            'normal' : [
                '0 1 2',
                '3 4 5',
                '6 7 8',
                '{a} {bksp} .'
            ]
        }
        ,
        autoAccept : true,
        usePreview: false,
        visible: function(e, keyboard, el) {
            keyboard.$preview[0].select();
        }
    })

    $('#folder_name_INA, #file_name_INA').keyboard({
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

//MENU TOGGLE
$(function() {
    $('#menu_toggle').change(function() {
        if ($('#menu_toggle').is(':checked')){
            $("#settings_disp, #settings_hr, #settings_folder, #settings_time").css('visibility','hidden');
        }else{
            $("#settings_disp, #settings_hr, #settings_folder, #settings_time").css('visibility','visible');
        }
    })
})

//INPUT VALIDATION AND SAVE SETTINGS
$(function(){
    $("#button_save_settings").click(function(){

        var error_parts = '';

        if ($( "#line_length_INA" ).val() <5 || $("#line_length_INA" ).val() > 150 ) {
            //$( "#alert_bad_values" ).html(length_error_alert);
            error_parts = 'DLUGOSC LINY: (5-150 cm)'
        }
        if ($( "#roller_dist_INA" ).val() <=0 || $("#roller_dist_INA" ).val() > 50 ) {
            //$( "#alert_bad_values" ).html(length_error_alert);
            error_parts = error_parts + '  ' + 'ODL. ROLEK: (0-50 cm)'
        }

        if ($( "#mass_INA" ).val() <0.1 || $("#mass_INA" ).val() > 10000 ) {
            //$( "#alert_bad_values" ).html(length_error_alert);
            error_parts = error_parts + '  ' + 'MASA: (0.1-10000 kg)'
        }

        if ( error_parts.length > 0){
            var length_error_alert = '<div role="alert" class="alert alert-danger alert-dismissible fade show"> <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button> <h2> <strong>Błędna wartość: ' + error_parts + '</strong></h2> </div>';
            $( "#alert_bad_values" ).html(length_error_alert);
        }else
        {
            //alert('OK')
            var current_settings = {};

            //Username
            current_settings.username = $('#username').text();

            //DISP 1
            current_settings.disp1_show = $('#disp1_show ').is(':checked');
            current_settings.disp1_select = $( "#disp1_select" ).val();
            current_settings.disp1_max_INA = $( "#disp1_max_INA" ).val();
            current_settings.disp1_min_INA = $( "#disp1_min_INA" ).val();

            //DISP 2
            current_settings.disp2_show = $('#disp2_show ').is(':checked');
            current_settings.disp2_select = $( "#disp2_select" ).val();
            current_settings.disp2_max_INA = $( "#disp2_max_INA" ).val();
            current_settings.disp2_min_INA = $( "#disp2_min_INA" ).val();

            //Exercise
            current_settings.line_length_INA = $( "#line_length_INA" ).val();
            current_settings.roller_dist_INA = $( "#roller_dist_INA " ).val();
            current_settings.mass_INA = $( "#mass_INA" ).val();

            //Duration
            current_settings.duration_min_INA = $( "#duration_min_INA" ).val();
            current_settings.duration_sec_INA = $( "#duration_sec_INA" ).val();
            current_settings.duration_cycle_INA = $( "#duration_cycle_INA" ).val();

            //FOlders
            current_settings.folder_name_INA = $( "#folder_name_INA" ).val();
            current_settings.file_name_INA = $( "#file_name_INA" ).val();

            //others
            current_settings.sound_toggle = $('#sound_toggle').is(':checked');
            current_settings.menu_toggle = $('#menu_toggle').is(':checked');

            $.ajax({
                url: '/zapisz/save_temp',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({user_current_settings: current_settings}),
                success:  function (data, textStatus, jqXHR) {
                    window.location = data.redirectUrl;
                }
            })
        }

    });
});

//START EXERCISE AND VALIDATION
$(function() {
    $("#button_start_exercies").click(function () {

        var error_parts = '';

        if ($("#line_length_INA").val() < 5 || $("#line_length_INA").val() > 150) {
            //$( "#alert_bad_values" ).html(length_error_alert);
            error_parts = 'DLUGOSC LINY: (5-150 cm)'
        }
        if ($("#roller_dist_INA").val() < 1 || $("#roller_dist_INA").val() > 50) {
            //$( "#alert_bad_values" ).html(length_error_alert);
            error_parts = error_parts + '  ' + 'ODL. ROLEK: (1-50 cm)'
        }

        if ($("#mass_INA").val() < 0.1 || $("#mass_INA").val() > 10000) {
            //$( "#alert_bad_values" ).html(length_error_alert);
            error_parts = error_parts + '  ' + 'MASA: (0.1-10000 kg)'
        }

        if (error_parts.length > 0) {
            var length_error_alert = '<div role="alert" class="alert alert-danger alert-dismissible fade show"> <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button> <h2> <strong>Błędna wartość:' + error_parts + '</strong></h2> </div>';
            $("#alert_bad_values").html(length_error_alert);
        } else {
            //alert('OK')
            var current_settings = {};

            //Username
            current_settings.username = $('#username').text();

            //DISP 1
            current_settings.disp1_show = $('#disp1_show ').is(':checked');
            current_settings.disp1_select = $( "#disp1_select" ).val();
            current_settings.disp1_max_INA = $( "#disp1_max_INA" ).val();
            current_settings.disp1_min_INA = $( "#disp1_min_INA" ).val();

            //DISP 2
            current_settings.disp2_show = $('#disp2_show ').is(':checked');
            current_settings.disp2_select = $( "#disp2_select" ).val();
            current_settings.disp2_max_INA = $( "#disp2_max_INA" ).val();
            current_settings.disp2_min_INA = $( "#disp2_min_INA" ).val();

            //Exercise
            current_settings.line_length_INA = $( "#line_length_INA" ).val();
            current_settings.roller_dist_INA = $( "#roller_dist_INA " ).val();
            current_settings.mass_INA = $( "#mass_INA" ).val();

            //Duration
            current_settings.duration_min_INA = $( "#duration_min_INA" ).val();
            current_settings.duration_sec_INA = $( "#duration_sec_INA" ).val();
            current_settings.duration_cycle_INA = $( "#duration_cycle_INA" ).val();

            //FOlders
            current_settings.folder_name_INA = $( "#folder_name_INA" ).val();
            current_settings.file_name_INA = $( "#file_name_INA" ).val();

            //others
            current_settings.sound_toggle = $('#sound_toggle').is(':checked');
            current_settings.menu_toggle = $('#menu_toggle').is(':checked');

            $.ajax({
                url: '/zapisz/save_tempE',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({user_current_settings: current_settings}),
                success:  function (data, textStatus, jqXHR) {
                    window.location = data.redirectUrl
                }
            })

            $("#alert_bad_values").detach();

            var length_error_alert = '<div role="alert" class="alert alert-danger alert-dismissible fade show"> <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button> <h2> <strong>' + 'Po kliknięciu WYCIĄGNIJ LINE JESZCZE RAZ' + '</strong></h2> </div>';
            $("#alert_line_fold").html(length_error_alert);

            $("#button_start_exercies").prop('disabled', true)
        }

    });
});