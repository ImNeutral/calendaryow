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
});