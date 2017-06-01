//INIT SECTION
// KEYBOARD
$(function () {
    $('#disp1_max_INA, #disp1_min_INA, #disp2_max_INA,#disp2_min_INA, #line_length_INA, #roller_dist_INA, #mass_INA, #duration_min_INA, #duration_sec_INA, #duration_cycle_INA').keyboard({
        layout: 'custom',
        customLayout: {
            'normal' : [
                '0 1 2 3',
                '4 5 6 7',
                '{c}  8 9 .',
                '{bksp} {accept} '
            ]
        }
    })

    $('#folder_name_INA, #file_name_INA').keyboard({
        // *** choose layout & positioning ***
        // choose from 'qwerty', 'alpha', 'international', 'dvorak', 'num' or
        // 'custom' (to use the customLayout below)
        layout: 'qwerty',
    })

});

//VARIABLES
var menu_mode_flag = 'advenced';


//DOCUMENT READY
$(document).ready(
    menu_mode_check
);

//SIMPLE_SDVENCED MENU FUNCTIONS
function menu_mode_check() {
    switch (menu_mode_flag) {
        case 'advenced':
            $("#settings_disp, #settings_hr, #settings_folder, #settings_time").css('visibility','hidden');
            $("#settings_mode_text").text('zaawansowany');
            menu_mode_flag = 'simple';
            break;
        case 'simple':
            $("#settings_disp, #settings_hr, #settings_folder, #settings_time").css('visibility','visible');
            $("#settings_mode_text").text('prosty');
            menu_mode_flag = 'advenced';
            break;
        default:
    }
}

//BUTTON MENU TOGGLE
$(function () {
    $("#settings_mode_toggle").click(
        menu_mode_check);
});

//CHECK INPUT VALUES RANGE

var error_parts = '';

$(function(){


    $("#button_start_exercies, #button_save_settings").click(function(){

        var error_parts = '';

        if ($( "#line_length_INA" ).val() <5 || $("#line_length_INA" ).val() > 150 ) {
            //$( "#alert_bad_values" ).html(length_error_alert);
            error_parts = 'DLUGOSC LINY (5-150 cm)'
        }
        if ($( "#roller_dist_INA" ).val() <=0 || $("#roller_dist_INA" ).val() > 50 ) {
            //$( "#alert_bad_values" ).html(length_error_alert);
            error_parts = error_parts + ', ' + 'ODL. ROLEK (0-50 cm)'
        }

        if ( error_parts.length > 0){
            var length_error_alert = '<div role="alert" class="alert alert-danger alert-dismissible fade show"> <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button> <h2> <strong>BLAD: ' + error_parts.toString() + '</strong></h2> </div>';
            $( "#alert_bad_values" ).html(length_error_alert);

        }else
        {
            alert('OK')
            //window.location.href = '/ustawienia';
        }

    });
});