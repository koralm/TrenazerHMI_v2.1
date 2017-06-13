/**
 * Created by koralm on 01.06.2017.
 */
//INIT DISPLAYS VALUES
var profiles_data = {};
var selected_profile_ID = {};


$( document ).ready($(function () {
    $.ajax({
        url: '/profile_cwiczen',
        type: 'POST',
        contentType: 'application/json',
        success:  function (data, textStatus, jqXHR) {

            profiles_data = data;

            generate_cards();
            generate_profile_list();
        }

    })

    $('#carousel_select_1').trigger('click')

}))

$(function(){
    $.ajax({
        url: '/delete_profile',
        type: 'POST',
        contentType: 'application/json',
        success:  function (data, textStatus, jqXHR) {

            profiles_data = data;

            generate_cards();
            generate_profile_list();
        }

    })
})

function generate_cards(){
    for(var i = 0; i<Math.ceil(profiles_data.file_list.length/4); i++){
        var cards_html;
        cards_html = '<div id="carousel_page_'+ i +'"><div id="carousel_page_'+ i +'_active" class="carousel-item"><div class="container"><div id="insert_profile_html_' + i + '"></div></div></div></div>';
        $("#carousel_main").append(cards_html);
    }
    $("#carousel_page_0_active").addClass('active');
}

function generate_profile_list(){

    var index = 0;

    for(var i = 0; i<Math.ceil(profiles_data.file_list.length/4); i++){
        for (var j = 0; (j<4 && index<profiles_data.file_list.length); j++){
            var profile_html;
            var profile_thml_extended;
            index = i*4+j;
            var value = profiles_data.file_list[index];

            profile_thml_extended = '<div class="col-8"><div style="background-color: #d4d0cf" class="row"><div class="col-2"><h3><strong>Masa:</strong></h3></div><div class="col-4"><h3><strong>Zakres Ruchu:</strong></h3></div><div class="col-3"><h3><strong>Odl. rolek:</strong></h3></div><div class="col-3"><h3><strong>Limity:</strong></h3></div></div><div class="row"><div class="col-3"><h4 id="carousel_title_11_mass">'+ profiles_data.loaded_profiles[index].mass_INA +' kg</h4></div><div class="col-3"><h4 id="carousel_title_11_line_length">' + profiles_data.loaded_profiles[index].line_length_INA + ' </h4></div><div class="col-3"><h4 id="carousel_title_11_roller">' + profiles_data.loaded_profiles[index].roller_dist_INA + ' cm</h4></div><div class="col-3"> <h4 id="carousel_title_11_time_cycle">' + profiles_data.loaded_profiles[index].duration_min_INA + 'min ' + profiles_data.loaded_profiles[index].duration_sec_INA + 's | ' + profiles_data.loaded_profiles[index].duration_cycle_INA + ' cykli</h4></div>'
            //profile_html = '<div id="carousel_data_row_' + index + '" ' +'class="container"><div id="carousel_title_1' + index + '_background" class="row"><div class="col-4"><div class="card text-center"><div class="card-block"><h3 id="carousel_title_1' + index + '" class="card-title">' + value + '</h3><p class="card-text"></p><a id="carousel_title_button_1' + index + '" href="#" class="btn btn-primary btn-lg">Wybierz</a></div></div></div>' + profile_thml_extended + '</div></div>'
            profile_html = '<div id="carousel_data_row_' + index + '" ' +'class="container"><div id="carousel_title_1' + index + '_background" class="row"><div class="col-4"><div class="card text-center"><div class="card-block"><p class="card-text"></p><a id="carousel_title_button_1' + index + '" href="#" class="btn btn-primary btn-lg"><h1 id="carousel_title_1' + index + '" class="card-title" style="font-size:30px">' + value + '</h1></a></div></div></div>' + profile_thml_extended + '</div></div>'

            var profile_line = '#insert_profile_html_' + i;
            $(profile_line).append(profile_html);
        }
    }
}

$(function () {

    var select_active = 1;

    $('#carousel_select_1').click(function () {
        $("#carousel_page_0_active").addClass('active');
        $("#carousel_page_1_active, #carousel_page_2_active, #carousel_page_3_active, #carousel_page_4_active").removeClass('active');
        select_active = 1;
        //$('#carouselExampleIndicators').carousel('next')
    });
    $('#carousel_select_2').click(function () {
        $("#carousel_page_0_active, #carousel_page_2_active, #carousel_page_3_active, #carousel_page_4_active").removeClass('active');
        $("#carousel_page_1_active").addClass('active');
        select_active = 2;
        //$('#carouselExampleIndicators').carousel('next')
    });
    $('#carousel_select_3').click(function () {
        $("#carousel_page_0_active, #carousel_page_1_active, #carousel_page_3_active, #carousel_page_4_active").removeClass('active');
        $("#carousel_page_2_active").addClass('active');
        select_active = 3;
        //$('#carouselExampleIndicators').carousel('next')
    });
    $('#carousel_select_4').click(function () {
        $("#carousel_page_0_active, #carousel_page_1_active, #carousel_page_2_active, #carousel_page_4_active").removeClass('active');
        $("#carousel_page_3_active").addClass('active');
        select_active = 4;
        //$('#carouselExampleIndicators').carousel('next')
    });
    $('#carousel_select_5').click(function () {
        $("#carousel_page_0_active, #carousel_page_1_active, #carousel_page_3_active, #carousel_page_2_active").removeClass('active');
        $("#carousel_page_4_active").addClass('active');
        select_active = 5;
        //$('#carouselExampleIndicators').carousel('next')
    });

    $('#carousel_backward').click(function () {
        select_active--;
        select_active = select_active > 5 ? 1 : select_active;
        select_active = select_active < 1 ? 5 : select_active;
        $("#carousel_page_0_active, #carousel_page_1_active, #carousel_page_2_active, #carousel_page_3_active, #carousel_page_4_active, #carousel_page_5_active").removeClass('active');
        $("#carousel_page_" + select_active + "_active").addClass('active');
        $("#carousel_select_1, #carousel_select_2, #carousel_select_3, #carousel_select_4, #carousel_select_5").removeClass('btn-danger');
        $('#carousel_select_' + select_active).addClass('btn-danger');

    })

    $('#carousel_forward').click(function () {
        select_active++;
        select_active = select_active > 5 ? 1 : select_active;
        select_active = select_active < 1 ? 5 : select_active;
        $("#carousel_page_0_active, #carousel_page_1_active, #carousel_page_2_active, #carousel_page_3_active, #carousel_page_4_active, #carousel_page_5_active").removeClass('active');
        $("#carousel_page_" + select_active + "_active").addClass('active');
        $("#carousel_select_1, #carousel_select_2, #carousel_select_3, #carousel_select_4, #carousel_select_5").removeClass('btn-danger');
        $('#carousel_select_' + select_active).addClass('btn-danger');
    })


})

//DETECT BUTTON CLICK
$(document).on('click', '.btn', function () {
    var x = $(this).attr('id');
    selected_profile_ID.actual_ID = x.substr(23, 24);
    var selected_row = '#carousel_data_row_' + selected_profile_ID.actual_ID;

    //HIGHLIGHT
    if ((x.indexOf("carousel_title_button") >= 0)) {

        for (var j = 0; (j < profiles_data.file_list.length); j++) {
            var IN_ID = '#carousel_data_row_' + j;
            $(IN_ID).css('background-color', '');
        }

        $(selected_row).css('background-color', '#b1aaa8');

        $.ajax({
            url: '/profile_cwiczen/zaladuj_wybrany_profil',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(selected_profile_ID),
            success: function () {alert('dddX')}
        })


    }
});

