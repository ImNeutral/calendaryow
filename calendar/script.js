$(document).ready(function() {

    var editEventModal  = $('#editEvent');
    var cancelEdit      = $("#cancel-edit");
    var spanEdit        = $("#close-edit")[0];
    var editedTitle     = $("#edited-title");


    var modal           = $('#myModal');
    var span            = $("#close")[0];
    var confirm         = $("#confirm-button");
    var cancel          = $("#cancel-button");

    var calendar        = $('#calendar');

    calendar.fullCalendar({
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
                var endDate   = new Date(end['_i']);

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
                        calendar.fullCalendar('renderEvent', eventData, true); // stick? = true
                    }
                    calendar.fullCalendar('unselect');
                    modal.css("display", "none");

                    saveEvents();
                } else{
                    alert("Title must not be empty.");
                }
                confirm.off();
            });

            cancel.on('click', function () {
                confirm.off();
            });

            span.onclick = function() {
                modal.css("display", "none");
                confirm.off();
            };

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
        viewRender: function (view, element) {
            // var calDate = calendar.fullCalendar('getDate');
            // console.log( calDate.format('Y') );

            // console.log( $('#calendar').fullCalendar('clientEvents') );
            // console.log(calendar.fullCalendar('eventSources'));
            // saveEvents();
        },
        fixedWeekCount : false,
        editable: true,
        eventLimit: true,
        events: getAllEvents()
    });


    // span.onclick = function() {
    //     modal.css("display", "none");
    // };

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
                calendar.fullCalendar('updateEvent', event);
                saveEvents();
                alert("Edit Successful!");
                editEventModal.css('display', 'none');
                offEditEvents();
            } else {
                alert("Title must not be empty!");
            }
        });
        
        deleteEvent.on('click', function (e) {
            if(window.confirm("Delete this event?")) {
                $('#calendar').fullCalendar('removeEvents', [event['_id'] ]);
                saveEvents();
                alert("Sucessfully deleted!");
                editEventModal.css('display', 'none');
                offEditEvents();
            }
        });

        spanEdit.onclick = function() {
            editEventModal.css('display', 'none');
            offEditEvents();
        };

        cancelEdit.on("click", function(){
            editEventModal.css('display', 'none');
            offEditEvents()
        });

        function offEditEvents() {
            confirmEdit.off();
            deleteEvent.off();
        }
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
    localStorage.setItem("events",JSON.stringify(newEvents));
}

function getAllEvents() {
    // setDefault();
    var storedEvents = JSON.parse(localStorage.getItem("events"));
    if(storedEvents == null) {
        setDefault();
        storedEvents = JSON.parse(localStorage.getItem("events"));
    }

    return storedEvents;
}

function setDefault() {
    // localStorage.clear();

    var d = new Date();
    var y = d.getFullYear();
    var events = defaultEvents(y-1);
    for (var i=y; i<y+5; i++) {
        events = events.concat(defaultEvents(i));
    }
    localStorage.setItem("events",JSON.stringify( events ));
}

function defaultEvents(year) {
    return [
        {
            id: 1,
            title: 'Eidul-Fitr',
            start: year + '-06-24',
            end:   year + '-06-25'
        },
        {
            title: 'Ninoy Aquino Day', 
            start: year + '-08-21',
            end:   year + '-08-22'
        },

        {
            title: 'National Heroes Day',
            start: year + '-08-26',
            end: year + '-08-27'
        },
        {
            title: 'Id-Ul-Adha',
            start: year + '-09-01',
            end: year + '-09-02'
        },
        {
            title: 'Amun Jadid',
            start: year + '-09-21',
            end: year + '-09-22'
        },
        {
            title: 'All Saints Day',
            start: year + '-11-01',
            end: year + '-11-02'
        },
        {
            title: 'Bonifacio Day',
            start: year + '-11-30',
            end: year + '-12-01'
        },
        {
            title: 'Maulid un-Nabi',
            start: year + '-11-30',
            end: year + '-12-01'
        },
        {
            title: 'Christmas Eve',
            start: year + '-12-24',
            end: year + '-12-25'
        },
        {
            title: 'Christmas Day',
            start: year + '-12-25',
            end: year + '-12-26'
        },
        {
            title: 'New Years Day',
            start: year + '-01-01',
            end: year + '-01-02'
        },
        {
            title: 'Chinese Lunar New Years Day',
            start: year + '-02-16',
            end: year + '-02-17'
        },
        {
            title: 'Maundy Thursday',
            start: year + '-04-29',
            end: year + '-04-30'
        },
        {
            title: 'Good Friday',
            start: year + '-04-30',
            end: year + '-05-01'
        },

        {
            title: 'The Day of Valor',
            start: year + '-04-09',
            end: year + '-04-10'
        },
        {
            title: 'Lailatul Isra Wal Mi Raj',
            start: year + '-04-12',
            end: year + '-04-13'
        },
        {
            title: 'Labor Day',
            start: year + '-05-01',
            end: year + '-05-02'
        },
        {
            title: 'Independence Day',
            start: year + '-06-12',
            end: year + '-06-13'
        },
        {
            title: 'Eidul-Fitr',
            start: year + '-06-13',
            end: year + '-06-14'
        },
    ];
}