$(document).ready(function(){
	next_prev_sound = function () {
        $("#next-prev-button-sound")[0].play();
    }

    $(".fc-next-button").on('click', function(){
        next_prev_sound();
    });

    $(".fc-prev-button").on('click', function(){
        next_prev_sound();
    });

    click_sound = function () {
    	$("#click-sound")[0].play();
    }

    saved_sound = function () {
    	$("#saved-sound")[0].play();
    }

    $(".modal-button-primary").on('click', function() {
    	click_sound();
    });

    $(".modal-button-danger").on('click', function() {
    	click_sound();
    });

    $(".button-warning").on('click', function(){
    	click_sound();
    });
});