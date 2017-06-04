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
