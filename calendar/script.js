$(document).ready(function() {

    var modal           = $('#myModal');
    var span            = $(".close")[0];
    var confirm         = $("#confirm-button");
    var cancel          = $("#cancel-button");

    $('#calendar').fullCalendar({
        header: {
            left: 'prev',
            center: 'title',
            right: 'next'
        },
        selectable: true,
        selectHelper: true,
        select: function(start, end) {
            modal.css("display", "block");
            // var title = prompt('Event Title:');
            // var eventData;
            // if (title) {
            //     eventData = {
            //         title: title,
            //         start: start,
            //         end: end
            //     };
            //     $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            // }
            // $('#calendar').fullCalendar('unselect');
        },
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: [
        ]
    });



    span.onclick = function() {
        modal.css("display", "none");
    };

    
    modal.on("click", function (e) {
        if (e.target != $('.modal-content')[0]) {
          //  modal.css("display", "none");
        }

    });
    // modal.onclick = function(event) {
    //     if (event.target == $('#myModal')) {
    //         console.log("Hello");
    //     } else {
    //         console.log("ss");
    //     }
    // }

    //confirm

    replace_whitespaces = function(value){
            return value.replace(/\s+/, "");
    }

    confirm.on("click", function(){

        var title = replace_whitespaces($("#title").val());
        var description = replace_whitespaces($("#description").val());

        if(title != "" && description != ""){
                alert("non empty proceed with shits");
        }else{
                alert("there are some empty shits");
        }

    });

    cancel.on("click", function(){
        modal.css("display", "none");
    });

});
