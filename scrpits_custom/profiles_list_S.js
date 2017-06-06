/**
 * Created by koralm on 01.06.2017.
 */
//INIT DISPLAYS VALUES
var profiles_data = {};



$( document ).ready($(function () {
    $.ajax({
        url: '/profile_cwiczen',
        type: 'POST',
        contentType: 'application/json',
        success:  function (data, textStatus, jqXHR) {

            profiles_data = data;

            generate_cards();
            generate_profile_list();

            //alert(Math.ceil(profiles_data.file_list.length/4))
        }

    })
}))

// $(document).on('click', '.btn', function () {
//     var x = $(this).attr('id');
//     alert(x)
// });

function generate_cards(){
    for(var i = 0; i<Math.ceil(profiles_data.file_list.length/4); i++){
        var cards_html;
        cards_html = '<div id="carousel_page_'+ i +'"><div id="carousel_page_'+ i +'_active" class="carousel-item"><div class="container"><div id="insert_profile_html_' + i + '"></div></div></div></div>';

        $("#carousel_main").append(cards_html);
    }
}

function generate_profile_list(){

    $.each(profiles_data.file_list, function( index, value ) {
        if (index<5){
            var profile_html;
            profile_html = '<div class="container"><div id="carousel_title_1' + index + '_background" class="row"><div class="col-4"><div class="card text-center"><div class="card-block"><h3 id="carousel_title_1' + index + '" class="card-title">' + value + '</h3><p class="card-text"></p><a id="carousel_title_button_1' + index + '" href="#" class="btn btn-primary btn-lg">Wybierz</a></div></div></div></div></div>'

            $("#insert_profile_html_0").append(profile_html);
        } else if((index>=5)){
            var profile_html;
            profile_html = '<div class="container"><div id="carousel_title_1' + index + '_background" class="row"><div class="col-4"><div class="card text-center"><div class="card-block"><h3 id="carousel_title_1' + index + '" class="card-title">' + value + '</h3><p class="card-text"></p><a id="carousel_title_button_1' + index + '" href="#" class="btn btn-primary btn-lg">Wybierz</a></div></div></div></div></div>'

            $("#insert_profile_html_1").append(profile_html);
        }

        $("#carousel_page_0_active").addClass('active');
    });
}

$(function () {
    $('#carousel_select_1').click(function () {
        $("#carousel_page_0_active").addClass('active');
        $("#carousel_page_1_active, #carousel_page_2_active, #carousel_page_3_active, #carousel_page_4_active").removeClass('active');
        //$('#carouselExampleIndicators').carousel('next')
    });
    $('#carousel_select_2').click(function () {
        $("#carousel_page_0_active, #carousel_page_2_active, #carousel_page_3_active, #carousel_page_4_active").removeClass('active');
        $("#carousel_page_1_active").addClass('active');
        //$('#carouselExampleIndicators').carousel('next')
    });
    $('#carousel_select_3').click(function () {
        $("#carousel_page_0_active, #carousel_page_1_active, #carousel_page_3_active, #carousel_page_4_active").removeClass('active');
        $("#carousel_page_2_active").addClass('active');
        //$('#carouselExampleIndicators').carousel('next')
    });
    $('#carousel_select_4').click(function () {
        $("#carousel_page_0_active, #carousel_page_1_active, #carousel_page_2_active, #carousel_page_4_active").removeClass('active');
        $("#carousel_page_3_active").addClass('active');
        //$('#carouselExampleIndicators').carousel('next')
    });
    $('#carousel_select_5').click(function () {
        $("#carousel_page_0_active, #carousel_page_1_active, #carousel_page_3_active, #carousel_page_2_active").removeClass('active');
        $("#carousel_page_4_active").addClass('active');
        //$('#carouselExampleIndicators').carousel('next')
    });

})

//cards_html = <div id="carousel_page_1"><div class="carousel-item"><div class="container"> <div id="insert_profile_html"></div> </div> </div></div>