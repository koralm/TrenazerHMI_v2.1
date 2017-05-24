/**
 * Created by koralm on 24.05.2017.
 */
//INIT KEYBOARD
$(function () {
    $('#line_length_INB, #roller_dist_INB, #mass_INB').keyboard({
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
});
