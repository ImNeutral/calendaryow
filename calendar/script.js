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
            addEvent(start, end);


        },
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: getAllEvents()
    });


    span.onclick = function() {
        modal.css("display", "none");
    };

    
    // modal.on("click", function (e) {
    //     if (e.target != $('.modal-content')[0]) {
    //         modal.css("display", "none");
    //     }
    // });

    // modal.onclick = function(event) {
    //     if (event.target == $('#myModal')) {
    //         console.log("Hello");
    //     } else {
    //         console.log("ss");
    //     }
    // }


    replace_whitespaces = function(value){
            return value.replace(/\s+/, "");
    }

    cancel.on("click", function(){
        modal.css("display", "none");
    });

    function addEvent(start, end) {
        confirm.on("click", function(){

            var title = replace_whitespaces($("#title").val());
            var description = replace_whitespaces($("#description").val());

            if(title != ""){
                var eventData;
                if (title) {
                    eventData = {
                        title: title,
                        description: description,
                        start: start,
                        end: end
                    };
                    $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
                }
                $('#calendar').fullCalendar('unselect');

                confirm.destroy =true;
                modal.css("display", "none");
                addEvent = null;
            }else{
                alert("Title must not be empty.");

            }
        });
        return 1;
    }

});


// function storedsEvent() {
//     var events = getAllEvents();
//
//     events[events.length] = {"title":"Meeting #4", "description": "Meeting 4"};
//     localStorage.setItem("events",JSON.stringify(events));
//
//     var storedNames = JSON.parse(localStorage.getItem("events"));
//     console.log(storedNames);
// }

function getAllEvents() {
    var events2 = defaultEvents();
    localStorage.setItem("events",JSON.stringify(events2));


    var storedEvents = JSON.parse(localStorage.getItem("events"));
    return storedEvents;
}

function defaultEvents() {
    return [
        {
            id: 1,
            title: 'Eidul-Fitr',
            description: '',
            start: '2017-06-24'
        },
        {
            title: 'Ninoy Aquino Day',
            description: '',
            start: '2017-08-21'
        },
		
        {
            title: 'National Heroes Day',
            description: '',
            start: '2017-08-26'
        },
        {
            title: 'Id-Ul-Adha',
            description: '',
            start: '2017-09-01'
        },
        {
            title: 'Amun Jadid',
            description: '',
            start: '2017-09-21'
        },
        {
            title: 'All Saints Day',
            description: '',
            start: '2017-11-01'
        },
        {
            title: 'Bonifacio Day',
            description: '',
            start: '2017-11-30'
        },
        {
            title: 'Maulid un-Nabi',
            description: '',
            start: '2017-11-30'
        },
        {
            title: 'Christmas Eve',
            description: '',
            start: '2017-12-24'
        },
        {
            title: 'Christmas Day',
            description: '',
            start: '2017-12-25'
        },
        {
            title: 'New Years Day',
            description: '',
            start: '2018-01-01'
        },
        {
            title: 'Chinese Lunar New Years Day',
            description: '',
            start: '2018-02-16'
        },
        {
            title: 'Maundy Thursday',
            description: '',
            start: '2018-04-29'
        },
        {
            title: 'Good Friday',
            description: '',
            start: '2018-04-30'
        },
		
        {
            title: 'The Day of Valor',
            description: '',
            start: '2018-04-09'
        },
        {
            title: 'Lailatul Isra Wal Mi Raj',
            description: '',
            start: '2018-04-12'
        },
        {
            title: 'Labor Day',
            description: '',
            start: '2018-05-01'
        },
        {
            title: 'Independence Day',
            description: '',
            start: '2018-06-12'
        },
        {
            title: 'Eidul-Fitr',
            description: '',
            start: '2018-06-13'
        },
    ];
}