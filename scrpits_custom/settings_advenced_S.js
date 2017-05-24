//INIT KEYBOARD
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
