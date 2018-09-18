// Вкладка Прогнозы
_scope.add('tote', function (){
	
	var _this = this;
	var _tab = $("#tote"); 
	var options = ('object' == jQuery.type(_tab.data('options'))) ? _tab.data('options') : JSON.parse(_tab.data('options'));
	var events = [];
	var tab_tote_inited = false;
	var table_ev = _tab.find('table[name=events]');
	var toteInner = _tab.find('#tote-inner');
	var ev_olds_is_showed = false;
	var link_ev_gone = table_ev.find('.link_ev_gone');
	
	this.tab_init = function(){

		if ( tab_tote_inited) return; 

		_tab.find('div[name=info_init_process]').css('display', 'block');
		
		$.ajax({
			url: options.url_init,
			type: 'POST',
			dataType: 'json',
			//async: false,
			data: { club_id: options.club_owner },
			error: function(){
			},
			success: handler_action 
		});
		
		tab_tote_inited = true;
	}
	
	this.tab_reinit = function(){
		tab_tote_inited = false;
		events = [];
		table_ev.find("tr:gt(1)").remove();
		_this.tab_init();
	}

	this.get_event = function(event_id){
		return events[event_id];
	}
	
	this.forecast_retister = function(event_id, score_home, score_guest){
		var tr = toteInner.find('[data-eventId="'+event_id+'"]');
		if (tr) {
			tr.find('#p-forecast').empty();
			tr.find('#p-forecast').html('Мой прогноз<br/><span id="s-forecast-home">'+score_home+'</span><span>:</span><span id="s-forecast-guest">'+score_guest+'</span>');
		}
	}
	
	function _date_format(date){
		var d     = date.split(' ')[0].split('-');
		var year  = d[0].substr(2);
		var month = d[1];
		var day   = d[2];

		return day +"."+ month +'.'+ year;
	}
	
	function _link_show(){
		link_ev_gone.css('display', 'table-row');
		var link = link_ev_gone.find('a[name=ev_gone]');
		link.html(link.data('text_for_show'));
	}

	function _link_hide(){
		link_ev_gone.css('display', 'none');
	}

	function getDateFormatted(dtString) {
		var monthNames = {
			'RU': ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
		};
		try {
			var d = new Date(dtString);
			return d.getDate() + ' '+ monthNames.RU[d.getMonth()] + ' ' + d.getFullYear() + ' в '
				+ ('0' + d.getHours()).slice(-2) + ':'
				+ ('0' + d.getMinutes()).slice(-2);
		}
		catch (e) {
			return '';
		}
	}
	
	function handler_action(res){
		_tab.find('div[name=info_init_process]').css('display', 'none');
		_link_hide();	

		if ( res.status == 'ok' ){

			var data = res.data;

			var match_tmpl_str = '<div class="wrapper_cont_prog">' +
                '<div class="col_1">' + 
                    '<div class="logo_1" id="i-home-logo"><img src="/static/img/_logo/h150/0.gif" /></div>' + 
                    '<span class="sp_logo_1"></span>' + 
                    '<span class="sp_logo_1_1"></span>' + 
                '</div>' + 
                '<div class="col_2">' + 
                    '<p id="p-score">Итог матча<br/><span id="s-score-home">&mdash;</span><span>:</span><span id="s-score-guest">&mdash;</span></p>' + 
                    '<p id="p-forecast">Мой прогноз<br/><span id="s-forecast-home">&mdash;</span><span>:</span><span id="s-forecast-guest">&mdash;</span></p>' + 
                    '<p id="p-jackpot">Мой выигрыш<br/><span class="sp_col_2" id="s-jackpot">&mdash;</span></p>' + 
                    '<div class="bckg_col_2"></div>' + 
                '</div>' + 
                '<div class="col_3">' + 
                    '<div class="logo_2" id="i-guest-logo"><img src="/static/img/_logo/h150/0.gif" /></div>' + 
                    '<span class="sp_logo_2"></span>' + 
                    '<span class="sp_logo_2_1"></span>' + 
                '</div>' + 
                '<div class="prog_data">' + 
                    '<div class="data_img"></div>' + 
                    '<span id="s-match-date"></span>' + 
                '</div>' + 
            '</div>';

			for ( var i = 0; i < data.events.length; i++ ){
				var ev = data.events[i];
				events[ev.id] = ev;
			
				var match_tmpl = $($.parseHTML(match_tmpl_str));
				match_tmpl.attr({'data-eventId':ev.id});
				
				if (ev.club_home.logo) {
					match_tmpl.find('#i-home-logo').html( $('<img src="' + ev.club_home.logo + '"/>') );
				}
				if (ev.club_guest.logo) {
					match_tmpl.find('#i-guest-logo').html( $('<img src="' + ev.club_guest.logo + '"/>') );
				}
				match_tmpl.find('.col_1 .sp_logo_1').text(ev.club_home.name);
				match_tmpl.find('.col_1 .sp_logo_1_1').text(''); //ev.club_home.name);
				match_tmpl.find('.col_3 .sp_logo_2').text(ev.club_guest.name);
				match_tmpl.find('.col_3 .sp_logo_2_1').text(''); //ev.club_guest.name);
				
				if (ev.score_home>0 || ev.score_guest>0) {
					match_tmpl.find('#s-score-home').text(ev.score_home);
					match_tmpl.find('#s-score-guest').text(ev.score_guest);
					if ( (options.club_owner == ev.club_home.id && ev.score_home > ev.score_guest) ||
						(options.club_owner == ev.club_guest.id && ev.score_home < ev.score_guest) ) {
						match_tmpl.find('#p-score').css({'color':'green'});
					} else {
						match_tmpl.find('#p-score').css({'color':'red'});
					}
				}

				var forecast;
				if ( typeof ev.forecast !== 'undefined' ){
					match_tmpl.find('#s-forecast-home').text(ev.forecast?ev.forecast.score_home:'');
					match_tmpl.find('#s-forecast-guest').text(ev.forecast?ev.forecast.score_guest:'');
					match_tmpl.find('#s-jackpot').html((ev.forecast.points ? ev.forecast.points+'&nbsp;ZEN' : '&mdash;') );
				}
				else if ( ev.forecast_not_avail ){
					match_tmpl.find('#s-forecast-home').text('N');
					match_tmpl.find('#s-forecast-guest').text('A');
				}
				else {
					match_tmpl.find('#p-forecast').html('<a name="forecast" class="do_forecast" href="#" onclick="return _scope.forecast_match.window_show('+ev.id+')">Сделать прогноз</a>');
				}
				match_tmpl.find('#s-match-date').text(getDateFormatted(ev.date));
				toteInner.append(match_tmpl);
			}
			
			if( table_ev.find('.is_gone').length == 1 ){
				_link_hide();
			}
		}
		else { /* TODO */ }
	}
	
	function _old_events_show(){
		table_ev.find('.is_gone').css('display', 'table-row');

		var link = link_ev_gone.find('a[name=ev_gone]');
		link.html(link.data('text_for_hide'));

		ev_olds_is_showed = true;
	}

	function _old_events_hide(){
		table_ev.find('.is_gone').css('display', 'none');
		table_ev.find('.is_last_gone').css('display', 'table-row');
		
		var link = link_ev_gone.find('a[name=ev_gone]');
		link.html(link.data('text_for_show'));

		ev_olds_is_showed = false;
	}
	
	table_ev.find('tr.link_ev_gone a[name=ev_gone]').bind('click', function(){
		
		if( ev_olds_is_showed ){
			_old_events_hide();
		}
		else {
			_old_events_show();
		}
		
		return false;
	});
});
