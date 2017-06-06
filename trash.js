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




//#carousel_page_1
//   .carousel-item.active
//       .container
//          #insert_profile_html_1


//.container
//    .row#carousel_title_11_background(style='background-color: #b1aaa8')
//        .col-4
//            .card.text-center
//                .card-block
//                    h3.card-title#carousel_title_11 Profil 1
//                    p.card-text
//                    a.btn.btn-primary.btn-lg#carousel_title_button_11(href='#') Wybierz

//.col-8
//    .row(style='background-color: #d4d0cf')
//        .col-3
//            h3
//                strong Masa:
//        .col-3
//            h3
//                strong Zakres Ruchu:
//        .col-3
//            h3
//                strong Odl. rolek:
//        .col-3
//            h3
//                strong Limity:
//    .row
//        .col-3
//            h4#carousel_title_11_mass 5 kg
//        .col-3
//            h4#carousel_title_11_line_length 70
//        .col-3
//            h4#carousel_title_11_roller 40 cm
//        .col-3
//            h4#carousel_title_11_time_cycle 0 min 0s | 30 cykli
//        .container
//            .row
//                .col-4
//                    .card.text-center
//                        .card-block
//                            h3.card-title Profil 2
//                            p.card-text
//                            a.btn.btn-primary.btn-lg(href='#') Wybierz
//
//                .col-8
//                    .row(style='background-color: #d4d0cf')
//                        .col-3
//                            h3
//                                strong Masa:
//                        .col-3
//                            h3
//                                strong Zakres Ruchu:
//                        .col-3
//                            h3
//                                strong Odl. rolek:
//                        .col-3
//                            h3
//                                strong Limity:
//                    .row
//                        .col-3
//                            h4 6 kg
//                        .col-3
//                            h4 70
//                        .col-3
//                            h4 40 cm
//                        .col-3
//                            h4 0 min 0s | 30 cykli
//        .container
//            .row
//                .col-4
//                    .card.text-center
//                        .card-block
//                            h3.card-title Profil 3
//                            p.card-text
//                            a.btn.btn-primary.btn-lg(href='#') Wybierz
//                .col-8
//                    .row(style='background-color: #d4d0cf')
//                        .col-3
//                            h3
//                                strong Masa:
//                        .col-3
//                            h3
//                                strong Zakres Ruchu:
//                        .col-3
//                            h3
//                                strong Odl. rolek:
//                        .col-3
//                            h3
//                                strong Limity:
//                    .row
//                        .col-3
//                            h4 7 kg
//                        .col-3
//                            h4 70
//                        .col-3
//                            h4 40 cm
//                        .col-3
//                            h4 0 min 0s | 30 cykli
//
//        .container
//            .row
//                .col-4
//                    .card.text-center
//                        .card-block
//                            h3.card-title Profil 4
//                            p.card-text
//                            a.btn.btn-primary.btn-lg(href='#') Wybierz
//                .col-8
//                    .row(style='background-color: #d4d0cf')
//                        .col-3
//                            h3
//                                strong Masa:
//                        .col-3
//                            h3
//                                strong Zakres Ruchu:
//                        .col-3
//                            h3
//                                strong Odl. rolek:
//                        .col-3
//                            h3
//                                strong Limity:
//                    .row
//                        .col-3
//                            h4 8 kg
//                        .col-3
//                            h4 70
//                        .col-3
//                            h4 40 cm
//                        .col-3
//                            h4 0 min 0s | 30 cykli
//
//
//
//.carousel-item
//    .container
//        .container
//            .row
//                .col-4
//                    .card.text-center
//                        .card-block
//                            h3.card-title Profil 5
//                            p.card-text
//                            a.btn.btn-primary.btn-lg(href='#') Wybierz
//
//                .col-8
//                    .row(style='background-color: #d4d0cf')
//                        .col-3
//                            h3
//                                strong Masa:
//                        .col-3
//                            h3
//                                strong Zakres Ruchu:
//                        .col-3
//                            h3
//                                strong Odl. rolek:
//                        .col-3
//                            h3
//                                strong Limity:
//                    .row
//                        .col-3
//                            h4 5 kg
//                        .col-3
//                            h4 70
//                        .col-3
//                            h4 40 cm
//                        .col-3
//                            h4 0 min 0s | 30 cykli
//        .container
//            .row
//                .col-4
//                    .card.text-center
//                        .card-block
//                            h3.card-title Profil 6
//                            p.card-text
//                            a.btn.btn-primary.btn-lg(href='#') Wybierz
//
//                .col-8
//                    .row(style='background-color: #d4d0cf')
//                        .col-3
//                            h3
//                                strong Masa:
//                        .col-3
//                            h3
//                                strong Zakres Ruchu:
//                        .col-3
//                            h3
//                                strong Odl. rolek:
//                        .col-3
//                            h3
//                                strong Limity:
//                    .row
//                        .col-3
//                            h4 15 kg
//                        .col-3
//                            h4 70
//                        .col-3
//                            h4 40 cm
//                        .col-3
//                            h4 0 min 0s | 30 cykli
//        .container
//            .row
//                .col-4
//                    .card.text-center
//                        .card-block
//                            h3.card-title Profil 7
//                            p.card-text
//                            a.btn.btn-primary.btn-lg(href='#') Wybierz
//
//                .col-8
//                    .row(style='background-color: #d4d0cf')
//                        .col-3
//                            h3
//                                strong Masa:
//                        .col-3
//                            h3
//                                strong Zakres Ruchu:
//                        .col-3
//                            h3
//                                strong Odl. rolek:
//                        .col-3
//                            h3
//                                strong Limity:
//                    .row
//                        .col-3
//                            h4 25 kg
//                        .col-3
//                            h4 70
//                        .col-3
//                            h4 40 cm
//                        .col-3
//                            h4 0 min 0s | 30 cykli
//
//        .container
//            .row
//                .col-4
//                    .card.text-center
//                        .card-block
//                            h3.card-title Profil 8
//                            p.card-text
//                            a.btn.btn-primary.btn-lg(href='#') Wybierz
//
//                .col-8
//                    .row(style='background-color: #d4d0cf')
//                        .col-3
//                            h3
//                                strong Masa:
//                        .col-3
//                            h3
//                                strong Zakres Ruchu:
//                        .col-3
//                            h3
//                                strong Odl. rolek:
//                        .col-3
//                            h3
//                                strong Limity:
//                    .row
//                        .col-3
//                            h4 45 kg
//                        .col-3
//                            h4 70
//                        .col-3
//                            h4 40 cm
//                        .col-3
//                            h4 0 min 0s | 30 cykli

//a.carousel-control-prev(href='#carouselExampleIndicators', role='button', data-slide='prev')
//    span.carousel-control-prev-icon(aria-hidden='true')
//    span.sr-only Previous
//a.carousel-control-next(href='#carouselExampleIndicators', role='button', data-slide='next')
//    span.carousel-control-next-icon(aria-hidden='true')
//    span.sr-only Next