// VARIBALES
//DISP 1

//FRAMES
var training_settings = {};
var bar_button_data_to_server = {start: 0, stop: 0, rec: 0};


var display_1_value = '000.000'
var display_1_bar = 73;

//DISP 2
var display_2_value = '000.000'
var display_2_bar = 43;

//TRENING PARAMS
//Cycles
var disp_cycle_number = 0;

//Phase
var disp_phase_val = 0;

//DISP 1 UPDATE
function update_display_1(display_1_value, display_1_bar, disp1_show){
    //visibility
    if (!disp1_show){
        $("#display_1").css('visibility','hidden');
    }else{
        $("#display_1").css('visibility','visible');
    }
    //display value
    $("#display_1_value").html(display_1_value);
    //bar_value
    $("#disp_1_bar").html(display_bar(display_1_bar));
}

//DISP 2 UPDATE
function update_display_2(display_2_value, display_2_bar, disp2_show){
    if (!disp2_show){
        $("#display_2").css('visibility','hidden');
    }else{
        $("#display_2").css('visibility','visible');
    }

    $("#display_2_value").html(display_2_value);
    $("#disp_2_bar").html(display_bar(display_2_bar));

}

//Training BAR UPDATE
function update_training_bar(disp_cycle_number, disp_phase_val, min, sec){
    var disp_timer = min + '.' + sec;

    $("#disp_cycle_number").html(disp_cycle_number);
    $("#disp_timer").html(disp_timer);

    //PHASE DISP TEMP !!!!!
    if (disp_phase_val){
        $("#disp_phase").removeClass('fa-arrow-up');
        $("#disp_phase").addClass( 'fa-arrow-down');
    }else if(!disp_phase_val){
        $("#disp_phase").removeClass('fa-arrow-down');
        $("#disp_phase").addClass('fa-arrow-up');
    }
}

//FUNCTION BAR %
function display_bar(value) {
    if (value<=25) {
        var display_html = '<div style="margin-top: 30px" class="progress"><div role="progressbar" style="width:' + value + '%; height: 160px;" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-danger"></div><div role="progressbar" style="width: 0%; height: 160px;" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-success"></div><div role="progressbar" style="width: 0%; height: 160px" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-danger"></div></div>'
        return display_html
    }
    else if (value>25 && value<75) {
        value = value-25;
        var display_html = '<div style="margin-top: 30px" class="progress"><div role="progressbar" style="width: 25%; height: 160px;" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-danger"></div><div role="progressbar" style="width:' + value + '%; height: 160px;" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-success"></div><div role="progressbar" style="width: 0%; height: 160px" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-danger"></div></div>'
        return display_html
    }
    else if (value>=75 && value<=100) {
        value = value-75;
        var display_html = '<div style="margin-top: 30px" class="progress"><div role="progressbar" style="width: 25%; height: 160px;" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-danger"></div><div role="progressbar" style="width: 50%; height: 160px;" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-success"></div><div role="progressbar" style="width:' + value + '%; height: 160px" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-danger"></div></div>'
        return display_html
    } else {
        return display_html = '<div style="margin-top: 30px" class="progress"><div role="progressbar" style="width: 25%; height: 160px;" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-warning"></div><div role="progressbar" style="width: 0%; height: 160px;" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-warning"></div><div role="progressbar" style="width: 0%; height: 160px" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-warning"></div></div>'

    }
}


//BUTTONS START ON CLICK
$(function(){
    $("#bar_button_start").click(function(){
        bar_button_data_to_server.stop = 0;
        bar_button_data_to_server.start = 1;
        //bar_button_data_to_server.rec = 0;
        if ($("#bar_button_start").is(':enabled')) {$("#bar_button_start").prop('disabled', true)};
        if ($("#bar_button_stop").is(':disabled')) {$("#bar_button_stop").prop('disabled', false)};
        //$("#bar_button_start").prop('disabled', true);
        //$("#bar_button_rec").prop('disabled', false);
        socket.emit('bar_button_data_to_server_socket', bar_button_data_to_server);
    });
});

//BUTTONS STOP ON CLICK
$(function() {
    $("#bar_button_stop").click(function () {
        bar_button_data_to_server.stop = 1;
        bar_button_data_to_server.start = 0;
        bar_button_data_to_server.rec = 0;
        if ($("#bar_button_stop").is(':enabled')) {$("#bar_button_stop").prop('disabled', true)};
        if ($("#bar_button_start").is(':disabled')) {$("#bar_button_start").prop('disabled', false)};
        if ($("#bar_button_rec").is(':disabled')) {$("#bar_button_rec").prop('disabled', false)};

        socket.emit('bar_button_data_to_server_socket', bar_button_data_to_server);
    });
})

//BUTTONS REC ON CLICK
$(function() {
    $("#bar_button_rec").click(function () {
        bar_button_data_to_server.stop = 0;
        //bar_button_data_to_server.start = 1;
        bar_button_data_to_server.rec = 1;
        if ($("#bar_button_stop").is(':disabled')) {$("#bar_button_stop").prop('disabled', false)};
        if ($("#bar_button_start").is(':enabled')) {$("#bar_button_start").prop('disabled', true)};
        if ($("#bar_button_rec").is(':enabled')) {$("#bar_button_rec").prop('disabled', true)};

        socket.emit('bar_button_data_to_server_socket', bar_button_data_to_server);
    });
})

//BUTTONS END ON CLICK
$(function() {
    $("#bar_button_end").click(function () {
        bar_button_data_to_server.stop = 1;
        bar_button_data_to_server.start = 0;
        bar_button_data_to_server.rec = 0;
        if ($("#bar_button_stop").is(':enabled')) {$("#bar_button_stop").prop('disabled', true)};
        if ($("#bar_button_start").is(':disabled')) {$("#bar_button_start").prop('disabled', false)};
        if ($("#bar_button_rec").is(':disabled')) {$("#bar_button_rec").prop('disabled', false)};

        socket.emit('bar_button_data_to_server_socket', bar_button_data_to_server);

        window.location = '/ustawienia';
    });
})

//INIT DISPLAYS VALUES
$( document ).ready($(function () {
    $.ajax({
        url: '/trening',
        type: 'POST',
        contentType: 'application/json',
        success:  function (data, textStatus, jqXHR) {

            training_settings = data;

            socket.emit('session_settings', training_settings);

            //DISPLAY 1
            update_display_1(display_1_value, display_1_bar, training_settings.actual_settings.session_settings.disp1_show);

            //DISPLAY 2
            update_display_2(display_2_value, display_2_bar, training_settings.actual_settings.session_settings.disp2_show);

            //TRENING PARAMS
            update_training_bar(training_settings.actual_settings.session_settings.duration_cycle_INA, disp_phase_val, training_settings.actual_settings.session_settings.duration_min_INA, training_settings.actual_settings.session_settings.duration_sec_INA)
        }
    })
}))


//SOCKET FUNCTIONS
socket.on('bar_button_data_from_server_socket', function (data) {
    update_training_bar(data.elapsed_cycle, data.disp_phase_val, data.elapsed_min, data.elapsed_sec)
    //update_display_1(display_1_value, data, training_settings.actual_settings.session_settings.disp1_show);
});


//SOCKET PLAY SOUNDS
socket.on('exercise_play_sound', function (data) {
    if(data.up1){
        var audio1 = new Audio('/trening/up1');
        audio1.play();
    } else if(data.down1){
        var audio2 = new Audio('/trening/down1');
        audio2.play();
    } else if(data.up2){
        var audio3 = new Audio('/trening/up2');
        audio3.play();
    } else if(data.down2){
        var audio4 = new Audio('/trening/down2');
        audio4.play();
    } else if(data.stoper_end){
        if ($("#bar_button_stop").is(':enabled')) {$("#bar_button_stop").prop('disabled', true)};
        if ($("#bar_button_start").is(':disabled')) {$("#bar_button_start").prop('disabled', false)};
        if ($("#bar_button_rec").is(':disabled')) {$("#bar_button_rec").prop('disabled', false)};
        var audio5 = new Audio('/trening/dzwiek_koniec');
        audio5.play();
    }
})