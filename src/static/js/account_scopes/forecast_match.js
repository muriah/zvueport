jQuery.fn.ForceNumericOnly = function() {
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
            // Разрешаем backspace, tab, delete, стрелки, обычные цифры и цифры на дополнительной клавиатуре
            return (
                key == 8 || 
                key == 9 ||
                key == 46 ||
                (key >= 37 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

// Форма прогноза матча
_scope.add('forecast_match', function (){
	
	var _window = $("div[name=window1]");
	var _block  = _window.find('div[name=form]');
	var form = _window.find('.forecast');
	var _this = this;
	var _event;
	
	this.window_show = function(id){
		
		document.getElementById('saving-shade').style.display = 'block';
		_window.css('display', 'block');
		_window.css({"z-index":"999"});
		_window.animate({"opacity":"1"},1000);

		_event = _scope.tote.get_event(id);

		_window.find('div[class=c-left]').html(_event.club_home.name);
		_window.find('div[class=c-right]').html(_event.club_guest.name);

		return false;
	}

	this.window_hide = function(){
		_window.fadeOut(function(){
			document.getElementById('saving-shade').style.display = 'none';
			form.find('input[name=score_home]').val('');
			form.find('input[name=score_guest]').val('');
			_event = null;
		});
	}
	
	this.block_hide = function(){
		_block.css('display', 'none');
	}

	this.block_show = function(){
		_block.css('display', 'block');
	}

	function form_save(){

		form.find('div[name^=info]').css('display', 'none');
		form.find('div[name=info-process]').css('display', 'block');
		
		var score_home = form.find('input[name=score_home]').val();
		var score_guest = form.find('input[name=score_guest]').val();

		setTimeout(function(){
		$.ajax({
			url: "/account/forecast_match",
			method: 'post',
			dataType: 'json',
			async: false,
			data: {
				score_home: score_home, 
				score_guest: score_guest,
				event_id: _event.id 
			},
			error: function(res,b,c){ 
				save_result({ status: 'error', 'message': res.statusText });
			},
			success: function(res){ save_result(res, score_home, score_guest, _event.id) }
		});
		}, 10);
	}
	
	function info(){
		return _scope.forecast_match2_info;
	}
	
	function save_result(res, score_home, score_guest, event_id){
		
		if ( !res ) res = { status: 'error' };

		if ( res.status == 'ok' ){
			info().process_hide();
			_this.window_hide();
			_scope.tote.forecast_retister(event_id, score_home, score_guest);
			_scope.tote.tab_reinit();
		}
		else {
			var mess;
			if ( res.status == 'not_numeric' ){
				mess = "Поля заполнены неправильно";
			}
			else if ( res.status == 'score_out' ){
				mess = "Общее число сетов должно быть от 3 до 5";
			}
			else if ( res.status == 'no_filled' ){
				mess = "Не все поля заполнены";
			}
			else if ( res.status == 'event_nofound' ){
				mess = "Нет данных о ближайшем матче";
			}
			else {
				mess = "Ошибка запроса к серверу";
			}

			info().process_hide();
			alert(mess);
		}
		
	}
	
	function show_tooltip(_class){
		_window.find(".i-common."+ _class).css('display', 'block').fadeOut(2000);	
	}
	
	function valid_field(e){
		var key = e.charCode || e.keyCode || 0;
		var side = $(this).hasClass('s-left') ? 'left' : 'right';
		var is_valid;
		
		var is_control_key = (
			   key == 8    // забой (←) 
			|| key == 9    // Tab
			|| key == 13   // Tab
            || key == 46   // delete
		);

		var is_back_key = (
			   key == 8    // backspace 
            || key == 46   // delete
		);
		
		if( !is_control_key ){
			
			var is_number = (
				(key >= 48 && key <= 51 ) || // numbers 0 - 3 
				(key >= 96 && key <= 99 ) 	 // numbers 0 - 3 на дополнительной клаве 
			);

			is_valid = (is_number && !$(this).val()) ? true : false;

			if ( !is_valid ){
				show_tooltip('i-'+side);
			}
		}
		else {
			// delete as backspace
			if( key == 46 ){ $(this).val('') }
			
			is_valid = true;
		}


		return is_valid;
	}
	
	$("div[name=window1] .exit").bind('click', function(){ _this.window_hide() });

	form.find("input[name=save]").bind('click', function(){
		info().process();
		form_save();
	});
	form.find('input.score').ForceNumericOnly();
	
	form.find('input.score').keydown(valid_field);
});

_scope.add('forecast_match2_info', function (){
	
	var _window = $("div[name=window1] div[name=info]");
	
	this.process = function(){
		form().block_hide();
		_window.css('display', 'block');	
		_window.find('.info-process').css('display', 'block');
	}

	this.process_hide = function(){
		_window.css('display', 'none');	
		_window.find('.info-process').css('display', 'none');
		form().block_show();
	}

	function form(){
		return _scope.forecast_match;
	}
});

