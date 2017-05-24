//INIT SECTION
// KEYBOARD
$(function () {
    $('#disp1_max_INA, #disp1_min_INA, #disp2_max_INA,#disp2_min_INA, #line_length_INA, #roller_dist_INA, #mass_INA, #duration_min_INA, #duration_sec_INA, #duration_cycle_INA').keyboard({
        layout: 'custom',
        customLayout: {
            'normal' : [
                '0 1 2 3',
                '4 5 6 7',
                '    8 9 ',
                '{bksp} {a} {c}'
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

