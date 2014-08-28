var addEvent = function (title, priority, start, end, icon) {
	title = title.length === 0 ? "Untitled Event" : title;
	icon = icon.length === 0 ? " " : icon;
	priority = priority.length === 0 ? "bg-default" : 'bg-' + priority;
	
	eventData = {
		title: title,
		className: priority,
		start: start,
		end: end,
		icon: icon
	};
	
	Api.put('calendar', eventData, function(response) {
		if(response.response) {
			eventData['id'] = response.response;
			$('#calendar').fullCalendar('renderEvent', eventData, true);
		}
	});
};

cms.init.add(['calendar_index'], function () {
	$('#add-event-form').on('submit', function (e) {
		var title = $('input[name="event_title"]').val(),
			priority = $('input:radio[name=event_color]:checked').val(),
			start = $('input[name="event_start"]').val(),
			end = $('input[name="event_end"]').val(),
			icon = $('input:radio[name=event_icon]:checked').val();

		addEvent(title, priority, start, end, icon);
		
		$(':input:not(:radio)', this).val('');
		e.preventDefault();
	});
	
	$('input[name="event_start"]').add('input[name="event_end"]').on('change', function() {
		var $input_start = $('input[name="event_start"]');
		var $input_end = $('input[name="event_end"]');
		
		var start = false;
		if($input_start.val().length > 0)
			var start = moment($input_start.val());
		
		var end = false;
		if($input_end.val().length > 0)
			var end = moment($input_end.val());

		$('#calendar').fullCalendar('select', start, end);
	});

	// build options
	var options = {
		header: {
			left: 'prev,next,today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		minTime: '07:00:00',
		lazyFetching: false,
		selectable: true,
		//unselectAuto: false,
		eventLimit: true,
		editable: true,
		unselectCancel: '#add-event-form',
		select: function(start, end, e, allDay) {
			$('input[name="event_start"]').val(start.format('YYYY-MM-DD HH:mm:00').toString());
			$('input[name="event_end"]').val(end.format('YYYY-MM-DD HH:mm:00').toString());
		},
		eventRender: function(event, element) {
			var content = element.find('.fc-content');
			if (event.icon) {
				content.prepend("<i class='fa-icon fa fa-" + event.icon + "'></i>");
			}
			
			var close = $("<span class='close'>x</span>")
				.appendTo(content)
				.on('click', function() {
					if(event.id)
						Api.delete('calendar', {id: event.id}, function() {
							$('#calendar').fullCalendar('removeEvents', event.id );
						});
					else
						$('#calendar').fullCalendar('removeEvents', event.id );
				});
		},
		events: {
			url: 'api-calendar',
			success: function(response) {
                var events = response.response;
				
				for(i in events) {
					events[i]['allDay'] = events[i]['allDay'] == 1;
					events[i]['editable'] = true;
				}
                return events;
            }
		},
		eventResize: function(event, delta, revertFunc) {
			Api.post('calendar', {
				id: event.id,
				start: event.start,
				end: event.end
			});
		},
		eventDrop: function(event, delta, revertFunc) {
			Api.post('calendar', {
				id: event.id,
				start: event.start,
				end: event.end
			});
		}
	};

	$('#calendar').fullCalendar(options);
});