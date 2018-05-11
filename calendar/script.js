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
    var colorPicker     = $('#colorPicker');
    var colorPicker2    = $('#colorPicker2');
    var color           = $('#colorInput');
    var colorEdit       = $('#colorInputEdit');


    colorPicker.tinycolorpicker();
    colorPicker2.tinycolorpicker();
    var picker  = colorPicker.data("plugin_tinycolorpicker");
    var picker2 = colorPicker2.data("plugin_tinycolorpicker");
    picker.setColor("#0391ce");
    picker2.setColor("#0391ce");

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
                            end: getFormattedDate(endDate),
                            color: color.val()
                        };
                        calendar.fullCalendar('renderEvent', eventData, true); // stick? = true

                    }
                    calendar.fullCalendar('unselect');
                    modal.css("display", "none");
                    saveEvents();
                    confirm.off();
                } else{
                    alert("Title must not be empty.");
                }
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
        picker2.setColor(event['color']);
        editEventModal.css('display', 'block');

        confirmEdit.on('click', function (e) {
            var newTitleInput    = $('#edited-title');
            var newTitle = replace_whitespaces(newTitleInput.val());
            if(newTitle != "") {
                event.title = newTitle;
                event.color = colorEdit.val();
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
             "end"  : getFormattedDate(dateEnd),
             "color": events[roll].color
         };
    }
    localStorage.setItem("events",JSON.stringify(newEvents));
}

function getAllEvents() {
    // localStorage.clear();
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
            end:   year + '-06-25',
            color: '#0391ce'
        },
        {
            title: 'Ninoy Aquino Day', 
            start: year + '-08-21',
            end:   year + '-08-22',
            color: '#0391ce'
        },

        {
            title: 'National Heroes Day',
            start: year + '-08-26',
            end: year + '-08-27',
            color: '#0391ce'
        },
        {
            title: 'Id-Ul-Adha',
            start: year + '-09-01',
            end: year + '-09-02',
            color: '#0391ce'
        },
        {
            title: 'Amun Jadid',
            start: year + '-09-21',
            end: year + '-09-22',
            color: '#0391ce'
        },
        {
            title: 'All Saints Day',
            start: year + '-11-01',
            end: year + '-11-02',
            color: '#0391ce'
        },
        {
            title: 'Bonifacio Day',
            start: year + '-11-30',
            end: year + '-12-01',
            color: '#0391ce'
        },
        {
            title: 'Maulid un-Nabi',
            start: year + '-11-30',
            end: year + '-12-01',
            color: '#0391ce'
        },
        {
            title: 'Christmas Eve',
            start: year + '-12-24',
            end: year + '-12-25',
            color: '#0391ce'
        },
        {
            title: 'Christmas Day',
            start: year + '-12-25',
            end: year + '-12-26',
            color: '#0391ce'
        },
        {
            title: 'New Years Day',
            start: year + '-01-01',
            end: year + '-01-02',
            color: '#0391ce'
        },
        {
            title: 'Chinese Lunar New Years Day',
            start: year + '-02-16',
            end: year + '-02-17',
            color: '#0391ce'
        },
        {
            title: 'Maundy Thursday',
            start: year + '-04-29',
            end: year + '-04-30',
            color: '#0391ce'
        },
        {
            title: 'Good Friday',
            start: year + '-04-30',
            end: year + '-05-01',
            color: '#0391ce'
        },

        {
            title: 'The Day of Valor',
            start: year + '-04-09',
            end: year + '-04-10',
            color: '#0391ce'
        },
        {
            title: 'Lailatul Isra Wal Mi Raj',
            start: year + '-04-12',
            end: year + '-04-13',
            color: '#0391ce'
        },
        {
            title: 'Labor Day',
            start: year + '-05-01',
            end: year + '-05-02',
            color: '#0391ce'
        },
        {
            title: 'Independence Day',
            start: year + '-06-12',
            end: year + '-06-13',
            color: '#0391ce'
        },
        {
            title: 'Eidul-Fitr',
            start: year + '-06-13',
            end: year + '-06-14',
            color: '#0391ce'
        },
    ];
}


 function getToday(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!

            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd;
              } 
            if(mm<10){
              mm='0'+mm;
            } 
            var today = yyyy + '-' + mm + '-' + dd;
            //dd+'/'+mm+'/'+yyyy;

            return today;
    }

    getTodayEvents();

    function getTodayEvents() {
        var date = getToday();
        var events_today = new Array();
        var events = JSON.parse(localStorage.getItem("events"));
        var today_element = $("#today-event");
        today_element.empty();
        for (var i = 0; i <= events.length-1; i++) {
            if(date >= events[i].start && date <= events[i].end)
            {
                var element = "<div class='today-event fc-event' data-notes=''>"+ events[i].title +"</div>";
                today_element.append(element);
            }
        }
    }




