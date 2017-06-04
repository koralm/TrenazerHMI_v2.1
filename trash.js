//DOCUMENT READY
$( document ).ready($(function () {
    $.ajax({
        url: '/',
        type: 'GET',
        contentType: 'application/json',
        success:  function (data, textStatus, jqXHR) {
            $( "#disp1_max_INA" ).val(data.disp1_max_INA);
            $( "#disp1_min_INA" ).val(data.disp1_min_INA);
        }
    })
}))/**
 * Created by koral on 03.06.2017.
 */
if (value<=25)
    return display_html = '<div style="margin-top: 30px" class="progress"><div role="progressbar" style="width:' +  25 + '%; height: 160px;" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-danger"></div><div role="progressbar" style="width: 0%; height: 160px;" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-success"></div><div role="progressbar" style="width: 0%; height: 160px" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-danger"></div></div>'
else
    value


        .progress(style='margin-top: 30px')
            .progress-bar.bg-danger(role='progressbar', style='width: 25%; height: 160px;', aria-valuenow='15', aria-valuemin='0', aria-valuemax='100')
            .progress-bar.bg-success(role='progressbar', style='width: 50%; height: 160px;', aria-valuenow='30', aria-valuemin='0', aria-valuemax='100')
            .progress-bar.bg-danger(role='progressbar', style='width: 25%; height: 160px', aria-valuenow='20', aria-valuemin='0', aria-valuemax='100')