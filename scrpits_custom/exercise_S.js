// VARIBALES
//DISP 1
var display_1_value = '000.000'
var display_1_bar = 73;

//DISP 2
var display_2_value = '000.000'
var display_2_bar = 43;

//TRENING PARAMS
//Cycles
var disp_cycle_number = 50;

//Phase
var disp_phase_val = 0;

//Timer
var min = 1;
var sec = 30;
var disp_timer = min + '.' + sec;


//INIT DISPLAYS VALUES
$( document ).ready($(function () {
    $.ajax({
        url: '/trening',
        type: 'POST',
        contentType: 'application/json',
        success:  function (data, textStatus, jqXHR) {


            //DISPLAY 1
            //visibility
            if (!data.actual_settings.session_settings.disp1_show){
                $("#display_1").css('visibility','hidden');
            }else{
                $("#display_1").css('visibility','visible');
            }
            //display value
            $("#display_1_value").html(display_1_value);
            //bar_value
            $("#disp_1_bar").html(display_bar(display_1_bar));


            //DISPLAY 2
            if (!data.actual_settings.session_settings.disp2_show){
                $("#display_2").css('visibility','hidden');
            }else{
                $("#display_2").css('visibility','visible');
            }
            $("#display_2_value").html(display_2_value);
            $("#disp_2_bar").html(display_bar(display_2_bar));

            //TRENING PARAMS
            $("#disp_cycle_number").html(disp_cycle_number);
            $("#disp_timer").html(disp_timer);

            //PHASE DISP TEMP !!!!!
            if (disp_phase_val){
                $("#disp_phase").addClass( 'fa-arrow-down');
            }else if(!disp_phase_val){
                $("#disp_phase").addClass('fa-arrow-up');
            }
        }
    })
}))

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