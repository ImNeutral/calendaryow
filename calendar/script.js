$(document).ready(function() {

    var editEventModal  = $('#editEvent');
    var cancelEdit      = $("#cancel-edit");
    var spanEdit        = $("#close-edit")[0];
    var editedTitle     = $("#edited-title");


    var modal           = $('#myModal');
    var span            = $("#close")[0];
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

            confirm.on("click", function(){
                var startDate = new Date(start['_i']);
                var endDate = new Date(end['_i']);

                var title = replace_whitespaces($("#title").val());
                $("#title").val('');
                if(title != ""){
                    var eventData;
                    if (title) {
                        eventData = {
                            title: title,
                            start: getFormattedDate(startDate),
                            end: getFormattedDate(endDate)
                        };
                        $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
                    }
                    $('#calendar').fullCalendar('unselect');

                    confirm.off();
                    modal.css("display", "none");

                    saveEvents();
                } else{
                    alert("Title must not be empty.");
                }
            });
        },
        eventDrop: function(){
            saveEvents();
        },
        eventResize: function(){
            saveEvents();
        },
        eventRender: function(event, element) {
            element.bind('dblclick', function() {
                editEvent(event);
            });
        },
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: getAllEvents()
    });


    span.onclick = function() {
        modal.css("display", "none");
    };

    replace_whitespaces = function(value){
        return value.replace(/\s+/, "");
    };

    cancel.on("click", function(){
        modal.css("display", "none");
    });

    spanEdit.onclick = function() {
        editEventModal.css("display", "none");
    };

    cancelEdit.on("click", function(){
        editEventModal.css("display", "none");
    });


    function editEvent(event) {
        var confirmEdit = $('#confirm-edit');
        var deleteEvent = $('#delete-event');

        editedTitle.val(event['title']);
        editEventModal.css('display', 'block');

        confirmEdit.on('click', function (e) {
            var newTitleInput    = $('#edited-title');
            var newTitle = replace_whitespaces(newTitleInput.val());
            if(newTitle != "") {
                event.title = newTitle;
                $('#calendar').fullCalendar('updateEvent', event);
                saveEvents();
                editEventModal.css('display', 'none');
                alert("Edit Successful!");
            } else {
                alert("Title must not be empty!");
            }
            confirmEdit.off();
        });

        // event.title = "hello";
        // $('#calendar').fullCalendar('updateEvent', event);
        // saveEvents();
        
        deleteEvent.on('click', function (e) {
            if(window.confirm("Delete this event?")) {
                $('#calendar').fullCalendar('removeEvents', [event['_id'] ]);
                saveEvents();
                alert("Sucessfully deleted!");
                editEventModal.css('display', 'none');
            }
        });
    }


});

function getFormattedDate(date) {
    date.setDate( date.getDate() + 1 );
    return date.getFullYear() + "-" + ( ("0" + (date.getMonth() + 1)).slice(-2) ) + "-" + ( ("0" + (date.getDate())).slice(-2) );
}

function saveEvents() {
    var events = $('#calendar').fullCalendar('clientEvents');
    var newEvents = [];
    for(var roll=0; roll<events.length; roll++) {
        var dateStart = events[roll].start['_d'];
        var dateEnd;
        if( events[roll].end == null) {
            dateEnd = dateStart;
            dateEnd.setDate(dateEnd.getDate() + 1);
        } else {
            dateEnd = events[roll].end['_d'];
        }

         newEvents[roll] = {
             "title": events[roll].title,
             "start": getFormattedDate(dateStart),
             "end": getFormattedDate(dateEnd)
         };
    }
    // localStorage.clear();
    localStorage.setItem("events",JSON.stringify(newEvents));
}

function getAllEvents() {
    // localStorage.setItem("events",JSON.stringify(defaultEvents()));  //uncomment to replace all with default events
    var storedEvents = JSON.parse(localStorage.getItem("events"));
    return storedEvents;
}

function defaultEvents() {
    return [
        {
            id: 1,
            title: 'Eidul-Fitr',
            start: '2017-06-24',
            end: '2017-06-25'
        },
        {
            title: 'Ninoy Aquino Day', 
            start: '2017-08-21',
            end: '2017-08-22'
        },

        {
            title: 'National Heroes Day',
            start: '2017-08-26',
            end: '2017-08-27'
        },
        {
            title: 'Id-Ul-Adha',
            start: '2017-09-01',
            end: '2017-09-02'
        },
        {
            title: 'Amun Jadid',
            start: '2017-09-21',
            end: '2017-09-22'
        },
        {
            title: 'All Saints Day',
            start: '2017-11-01',
            end: '2017-11-02'
        },
        {
            title: 'Bonifacio Day',
            start: '2017-11-30',
            end: '2017-12-01'
        },
        {
            title: 'Maulid un-Nabi',
            start: '2017-11-30',
            end: '2017-12-01'
        },
        {
            title: 'Christmas Eve',
            start: '2017-12-24',
            end: '2017-12-25'
        },
        {
            title: 'Christmas Day',
            start: '2017-12-25',
            end: '2017-12-26'
        },
        {
            title: 'New Years Day',
            start: '2018-01-01',
            end: '2018-01-02'
        },
        {
            title: 'Chinese Lunar New Years Day',
            start: '2018-02-16',
            end: '2018-02-17'
        },
        {
            title: 'Maundy Thursday',
            start: '2018-04-29',
            end: '2018-04-30'
        },
        {
            title: 'Good Friday',
            start: '2018-04-30',
            end: '2018-05-01'
        },

        {
            title: 'The Day of Valor',
            start: '2018-04-09',
            end: '2018-04-10'
        },
        {
            title: 'Lailatul Isra Wal Mi Raj',
            start: '2018-04-12',
            end: '2018-04-13'
        },
        {
            title: 'Labor Day',
            start: '2018-05-01',
            end: '2018-05-02'
        },
        {
            title: 'Independence Day',
            start: '2018-06-12',
            end: '2018-06-13'
        },
        {
            title: 'Eidul-Fitr',
            start: '2018-06-13',
            end: '2018-06-14'
        },
    ];
}