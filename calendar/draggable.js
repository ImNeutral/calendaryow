$(document).ready(function () {
    var $draggableAddModal      = $('#draggable-add');
    var $draggableEditModal     = $('#draggable-edit');
    var $draggableSuccess       = $('#draggable-success');
    var $draggableEditSuccess   = $('#draggable-edit-success');
    var $draggableDeleteSuccess = $('#draggable-delete-success');
    var $draggableCancelConfirm = $('#draggable-cancelConfirmModal');

    var $draggableConfirm       = $('#draggable-confirm');
    var $draggableTitle         = $('#draggable-title');
    var $draggableColorInput    = $('#draggable-colorInput');

    var $draggableEditTitle     = $('#draggable-edited-title');

    var $draggableDeleteEvent   = $('#draggable-delete-event');

    var $externalEvents         = $('#external-events');
    var colorPicker3            = $('#colorPicker3');
    var colorPicker4            = $('#colorPicker4');

    var $currentSelectedDraggable;

    colorPicker3.tinycolorpicker();
    var picker3 = colorPicker3.data("plugin_tinycolorpicker");
    picker3.setColor("#0391ce");

    colorPicker4.tinycolorpicker();
    var picker4 = colorPicker4.data("plugin_tinycolorpicker");
    picker4.setColor("#0391ce");

    showExternalEvents();
    setTitleChecker('#draggable-title');
    setDraggableConfirm();
    clickableDraggableEvent();

    $('#button-add-draggable').on('click', function (e) {
        modalIn($draggableAddModal);
    });

    $('.close, .ok').on('click', function (e) {
        click_sound();
        modalOut($draggableAddModal);
        modalOut($draggableEditModal);
        modalOut($draggableSuccess);
        modalOut($draggableEditSuccess);
        modalOut($draggableDeleteSuccess);
    });

    $('#draggable-confirm-edit').on('click', function (e) {
        $currentSelectedDraggable.text($draggableEditTitle.val());
        $currentSelectedDraggable.css('background-color', $('#draggable-colorInputEdit').val());
        setExternalEvents();
        modalOut($draggableEditModal);
        modalIn($draggableEditSuccess);
        clickableDraggableEvent();
    });

    $draggableDeleteEvent.on('click', function (e) {
        $('#draggable-delete-title').text($currentSelectedDraggable.text());
        modalIn($draggableCancelConfirm);
    });

    $('#draggable-cc-cancel').on('click', function (e) {
        modalOut($draggableCancelConfirm);
    });

    $('#draggable-close').on('click', function (e) {
        modalOut($draggableCancelConfirm);
    });

    $('#draggable-cc-confirm').on('click', function (e) {
        saved_sound();
        modalOut($draggableEditModal);
        modalOut($draggableCancelConfirm);
        $currentSelectedDraggable.remove();
        setExternalEvents();
        showExternalEvents();
        clickableDraggableEvent();
        modalIn($draggableDeleteSuccess);
    });

    function setDraggableConfirm() {
        $draggableConfirm.on('click', function () {
            var newDraggable = "<div class='draggable-event' style='background-color: " + $draggableColorInput.val() + ";'>" + $draggableTitle.val() + "</div>";
            $draggableTitle.val('');
            $externalEvents.append(newDraggable);
            modalOut($draggableAddModal);
            modalIn($draggableSuccess);

            setExternalEvents();
            showExternalEvents();
            clickableDraggableEvent();
        });
    }

    function setExternalEvents() {
        localStorage.setItem('draggable-items', JSON.stringify( $externalEvents.html() ));
    }

    function showExternalEvents() {
        $externalEvents.html('');
        $externalEvents.append(JSON.parse( localStorage.getItem('draggable-items') ));
        setDraggableEvent();
    }

    function clickableDraggableEvent() {
        $('.draggable-event ').on('click', function (e) {
            var titleOld = $(this).text();
            var colorOld = $(this).css('background-color');

            modalIn($draggableEditModal);
            $draggableEditTitle.val(titleOld);
            picker4.setColor(colorOld);
            $currentSelectedDraggable = $(this);
        });
    }

});

function checkDraggableTitle() {
    if( isNotEmpty($("#draggable-title").val() ) ){
        enableButton('#draggable-confirm')
    }else{
        disableButton('#draggable-confirm')
    }
}

function disableButton(elementID){
    $(elementID).addClass('disabled');
}

function enableButton(elementID) {
    $(elementID).removeClass('disabled');
}

function setTitleChecker(elementID) {
    $(elementID).keyup(function(){
        checkDraggableTitle();
    });

    $(elementID).keydown(function(){
        checkDraggableTitle();
    });

    $(elementID).change(function(){
        checkDraggableTitle();
    });
}

function isNotEmpty(value_str){
    value_str = replace_whitespaces(value_str);

    return (value_str.length != 0);
}


function setDraggableEvent() {
    $('#external-events .draggable-event').each(function() {

        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true, // maintain when user navigates (see docs on the renderEvent method)
            color: $(this).css('background-color')
        });


        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });

    });
}