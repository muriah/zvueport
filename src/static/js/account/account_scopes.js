//-- scope.avatar: Форма загрузки аватарки 
_scope.add('avatar', function (){

	var self = this;
	var form_avatar = $("#load_avatar");
	self.window_is_active = false;
	
	function window_show(){
		form_avatar[0].reset();
		form_avatar.find('div[name^=info]').css('display', 'none');
		document.getElementById('modal-display').style.display = 'block';
		document.getElementById('saving-shade').style.display = 'block';
		self.window_is_active = true;
	}
	
	self.window_hide = function(){
		document.getElementById('modal-display').style.display = 'none';
		document.getElementById('saving-shade').style.display = 'none';
		self.window_is_active = false;
	}
	
	$("#above-avatar").bind('click', window_show);
	$("#modal-display .c-1").bind('click', self.window_hide);
	
	form_avatar.ajaxForm({
		dataType: 'json',
		beforeSubmit: function(){
			form_avatar.find('div[name^=info]').css('display', 'none');
			form_avatar.find('div[name=info-process]').css('display', 'block');
		},
		success: function(res){
			form_avatar.find('div[name^=info-]').css('display', 'none');
			
			if ( res.status == 'ok' ){
				var time = new Date().getTime();
				$('img.i-avatar').attr('src', res.file +"?"+time);
				$(form_avatar).find('div[name=info-success]').css('display', 'block');
				setTimeout(self.window_hide, 1000);
			}
			else {
				var mess;
				if ( res.status == 'not_file' ){
					mess = "Не указан файл";
				}
				else if ( res.status == 'novalid_file' ){
					mess = "Неподходящий формат файла";
				}
				else if ( res.status == 'big_file' ){
					mess = "Размер файла не должен превышать 2МБ";
				}
				else {
					mess = "Ошибка запроса к серверу";
				}
				
				$(form_avatar).find('div[name=info-warn]').html(mess).css('display', 'block');
			}
		}
	});
});
_scope.add('awards', function (){
	var _this = this;
	var icons = $(".prof-awards > ul > li");
	var button_more = $(".prof-awards .more-btn a:first");
	var _window = $("#modal-display-award_info");
	var window_is_actived;
	var window_num = 0;
	var progress_items;
	
	button_more.bind('click', function(){
		_scope.progress.window_show();
		return false;
	});

	icons.find('a:first').bind('click', function(){
		var award_name = $(this).parents('li:first').attr('name');
		window_show(award_name);
		return false;
	});
	
	_window.find('>div[name=close]:first').bind('click', window_hide);
	
	
	this.scope_init = function(data){
		progress_items = data;
		
		var progress_by_key = {};
		for ( var i in progress_items ){
			var pr = progress_items[i];
			progress_by_key[pr.progress_key] = pr;
		}

		for( var i = 0; i < icons.length; i++ ){
			var icon = icons[i];
			var key = $(icon).attr('name') + '000';
			key = key.replace(/z/, '');
			if( typeof progress_by_key[key] !== 'undefined' ){
				$(icon).addClass('active');
			}
		}
	}

	function window_show(award_name){
		
		window_num = window_num + 1;
		
		if( window_is_actived ) section_deactivate();

		section_activate(award_name);
		
		if( !window_is_actived ){
			_window.css('display', 'block');
		}

		window_is_actived = true;
		
		window_fadeout();
	}

	function window_hide(){
		_window.css('display', 'none');
		section_deactivate();
		window_is_actived = false;
	}

	function section_activate(name){
		_window.find('div[name="info-'+name+'"]').css('display', 'block');
	}

	function section_deactivate(){
		_window.find('div[name^="info-"]').css('display', 'none');
	}

	function window_fadeout(){
		(function(window_num_current){
			_window.fadeOut({
				duration: 3000, 
				complete: window_hide,
				step: function(){
					if( window_num_current != window_num){
						_window.stop().animate({opacity:'100'});
					}
				}
			});
		})(window_num);
	}
});
_scope.add('events', function (){
	
	var _this = this;
	var title_events;
	var url_user_events;
	var last_point = 0;
	var is_end;
		
	// вызывается до завершения загрузки страницы
	this.set_title_events = function(data){
		title_events = data;
	}

	this.tab_activate = function(data){
		last_point = 0;
		$('#feed-items').html('');
		_this.show_user_events();
	}
	
	this.set_url_user_events = function(url){
		url_user_events = url;
	}
	
	this.show_user_events = function(){
		_mod.account.showModal("Запрос данных...");
		ajax_events(function(res){
			
			if ( res.status == 'ok' ){

				$('#feed-items').append(res.data.content);
				last_point = res.data.last_point;
				if( res.data.is_end ){
					is_end = true;
					$("button[name=feed_next_list]").css({ cursor: 'default', 'background-color': 'gray' });
				}
				_mod.account.hideModal();

				$('.s-unfreeze').bind('click', function(event){
					event.preventDefault();
					var pp_id = event.target.getAttribute('data-id');
					if (pp_id) {
						var unfreeze_url = '/account/pp_unfreeze'
						$.ajax({
							url: unfreeze_url,
							dataType: 'json',
							async: true,
							data: { "pp_id": pp_id },
							error: function() { console.log('pp unfreeze failed') },
							success: function(answer) {
								if (undefined != answer.error) {
									console.log(answer.error);
								} else {
									_update_balance(answer.points, answer.points_frozen);
									_update_feed_item(event.target);
								}
							},
						});
					}
				});
			}
			else {
				_mod.account.hideModal();
			}
		});
	}

	function ajax_events(caller){
		var url = url_user_events.replace(/\/?$/, "/"+last_point);
		$.ajax({
			url: url,
			dataType: 'json',
			async: true,
			data: { },
			error: function(){
				caller({ status: 'error' });
			},
			success: caller, 
		});
	}
	
	function _update_balance(p, pf) {
		$('[data-name="person_points"]').text(p);

		var pf_text = '';
		if (0 != pf) {
			pf_text = pf > 0 ? '(+'+pf+')' : '('+pf+')';
		}
		$('[data-name="pp_frozen"]').text(pf_text);
	}
	
	function _update_feed_item(span) {
		$(span).fadeOut(700);
		//$('.s-unfreeze').parents('li').css({'background':'white'})
	}

	$("button[name=feed_next_list]").bind('click', function(){
		if( !is_end ){
			_this.show_user_events();
		}
	});
});
//-- регистрация фан-карты
_scope.add('fancard', function (){
	var window = $("#modal-display-fan_card");
	var form = window.find('#fan_card:first');
	var self = this;
	self.window_is_active = false;
	
	function window_show(video){
		document.getElementById('saving-shade').style.display = 'block';
		window.css('display', 'block');
		self.window_is_active = true;
	}
	
	self.window_hide = function(){
		document.getElementById('saving-shade').style.display = 'none';
		window.css('display', 'none');
		self.window_is_active = false;
	}
	
	window.find('>div[name=close]:first').bind('click', function(){
		self.window_hide();
	});
	
	$("button[name=window_fancard_open]:first").bind('click', function(){
		window_show();
		return false;
	});
	
	form.find('input[name=num]').bind('keydown',function(ev){
		var Enter_code = 13;
		if( ev.keyCode == Enter_code ){
			form.find("input[name=save]").click();
			return false;
		}	
	});
	
	form.find("input[name=save]").bind('click', function(){
		
		form.find('div[name^=info]').css('display', 'none');
		form.find('div[name=info-process]').css('display', 'block');
		
		setTimeout(function(){
		$.ajax({
			url: form.attr("action"),
			method: 'post',
			dataType: 'json',
			async: false,
			data: {
				fancard_num: form.find('input[name=num]').val()
			},
			error: function(){
			},
			success: function(res){
				form.find('div[name^=info]').css('display', 'none');
				
				if ( res.status == 'ok' ){
					$(form).find('div[name=info-success]')
						.css('display', 'block')
						.fadeOut(4000);
				}
				else {
					var mess;
					if ( res.status == 'num_novalid' ){
						mess = "Неправильный номер карты";
					}
					else if ( res.status == 'not_fill' ){
						mess = "Укажите номер карты";
					}
					else if ( res.status == 'not_exists' ){
						mess = "Карта не найдена";
					}
					else if ( res.status == 'registered' ){
						mess = "Карта была ранее вами зарегистрирована";
					}
					else if ( res.status == 'registered_not_me' ){
						mess = "Карту зарегистрирована на другое лицо";
					}
					else {
						mess = "Ошибка запроса к серверу";
					}
					
					form.find('div[name=info-warn]').html(mess)
						.css('display', 'block')
						.fadeOut(4000);
				}
			}
		});
		}, 10);
		
		return false;
	});
});
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

_scope.add('help', function (){
	var _this = this;
	var _window = $("#modal-display-help");
	var window_is_active;
	var css_z_index_orig;
	var css_z_index = 99;

	_window.find('>div[name=close]:first').bind('click', function(){
		window_hide();
	});
	
	$("#d-help a:first").bind('click', function(){
		window_show();
		return false;
	});

	function click_shade_bind(){
		$("#saving-shade").bind('click', window_hide);
	}

	function click_shade_unbind(){
		$("#saving-shade").unbind('click', window_hide);
	}

	function window_hide(){
		$('.top-reg-btn').css('z-index', css_z_index_orig);
		css_z_index_orig = null;

		document.getElementById('saving-shade').style.display = 'none';
		_window.css('display', 'none');
		window_is_active = false;
		section_deactivate();
		click_shade_unbind();
	}
	
	function window_show(event_id){
		section_activate();
		css_z_index_orig = $('.top-reg-btn').css('z-index');
		$('.top-reg-btn').css('z-index', css_z_index);

		document.getElementById('saving-shade').style.display = 'block';
		_window.css({ 'left': ($('body').width() - _window.width()) / 2, 'display': 'block' })
		window_is_active = true;
		click_shade_bind();
	}

	function section_activate(){
		var item_name = _scope.menu_lights.get_current_item();
		console.log(item_name);
		_window.find('div[name="help-'+item_name+'"]').css('display', 'block');
	}

	function section_deactivate(){
		_window.find('div[name^="help-"]:hidden').css('display', 'none');
	}

});
_scope.add('main', function (){
	
	var elements_data_points;
	var _this = this;
	
	this.update_points = function(points){
		if( !elements_data_points ) elements_data_points = $("*[data-name=person_points]");
		elements_data_points.text(points);
		_scope.events.show_user_events();	// TODO: вызывать только когда вкладка ленты открыта
		//_this.menu_lights(['feed', 'f_events']);
	}
});
_scope.add('menu_lights', function (){
	
	var _this = this;
	var menu_names = [
		'regticket', 'regsub', 'reg_pcoupon', 'feed.events', 'feed.prizes', 'feed.videos' 
	];
	
	var menu = {};
	var item_previous;
	var item_current;
	var events_info_actived = {
		balls_change: false,
		video_open: false
	};

	this.scope_inited = null; 	

	this.scope_init = function(_events_info_actived){

		var menu_events_info = {
			'feed.events': ['balls_change'],
			'feed.videos': ['video_open']
		};
		
		for( var i = 0; i < _events_info_actived.length; i++ ){
			var name = _events_info_actived[i];
			events_info_actived[name] = true;
		}

		// инициализация menu_names, menu 
		var root_menu = root_menu_nodes();	

		for( var i = 0; i < root_menu.length; i++ ){
			var item = root_menu[i];
			var name = $(item).find('a:first').attr('href').split('#')[1];
			menu_names.push(name);
		}
		
		for( var i = 0; i < menu_names.length; i++ ){
			var name = menu_names[i];
			var parent_item;
			if( /\./.test(name) ){
				var parts = name.split('.');
				parts.pop();
				parent_item = parts.join('.');
			}
			else {
				parent_item = null;
			}
			
			var tab_name = /^feed\./.test(name) ? name.split('.')[1] : name;

			menu[name] = {
				name: name,
				actived: null,
				parent: parent_item,
				light: null,
				lighted: null,
				events_info: null,
				tab_name: tab_name
			}

			if( typeof(menu_events_info[name]) !== 'undefined' ){
				menu[name].events_info = menu_events_info[name];
			}
		}
		
		// инициализация actived_menu, item_current 
		var actived_menu;
		for( var i = 0; i < root_menu.length; i++ ){
			var item_x = root_menu[i];

			if( $(item_x).hasClass('menu-current') ){
				actived_menu = $(item_x).find('a:first').attr('href').split('#')[1];
				break;
			}
		}

		if( !actived_menu ) actived_menu = get_item_by_tab(get_tab_name());
		
		var _item_current = menu[actived_menu];
		if (_item_current) {
			_item_current.actived = true;
			set_item_current(_item_current);
		}
		
		// init 'feed' menu 
		var feed_menu = feed_menu_nodes();	
		var feed_actived_menu = {};

		for( var i = 0; i < feed_menu.length; i++ ){
			var item_x = feed_menu[i];

			if( $(item_x).hasClass('current') ){
				feed_actived_menu = 'feed.' + $(item_x).attr('href').split('#')[1];
				feed_actived_menu = menu[feed_actived_menu];
				break;
			}
		}
		
		feed_actived_menu.actived = true;
		
		if ( menu[feed_actived_menu.parent] ? menu[feed_actived_menu.parent].actived : false ) {
			item_current = feed_actived_menu;
		}

		light_by_events_info();
		
		if (item_current) {
			_this.activate(item_current.name);
		}
		_this.scope_inited = true;
	}

	this.activate = function(tab_name){
		var item = get_item_by_tab(tab_name); 
		if( !_this.scope_inited ) return;
		var d_item = menu[item];

		if (d_item) {		
		d_item.actived = true;
		item_previous = item_current;
		
		//-- deactivate previous
		if( d_item.parent && item_previous ){
			if( item_previous.parent ){
				if( d_item.parent == item_previous.parent ){
					deactivate(item_previous.name);	
				}
				else {
					console.log('draft');
				}
			}
			else {
				console.log('draft');
			}
		}
		// choosed root menu item
		else {
			if (!item_previous) { return };
			if( item_previous.parent ){
				var root_item = get_root_item(item_previous);
				deactivate(root_item.name);	
			}
			// previous choosed root menu item
			else {
				deactivate(item_previous.name);	
			}
		}
		
		// --
		set_item_current(d_item);
		menu_light_off(d_item.name);
		events_info_del(item_current);
		}
	}

	this.set_events_info = function(events_info){

		for ( var i in events_info ){
			var ev = events_info[i];

			if( events_info_actived[ev] ) continue;
			events_info_actived[ev] = true;

			for( var name in menu ){
				var d_item = menu[name];

				if( !d_item.events_info ) continue;

				for( var i = 0; i < d_item.events_info.length; i++ ){
					if( ev == d_item.events_info[i] ){
						status_light_set(d_item.name);
					}
				}
			}
		}
		
		light_all();
	}
	
	this.get_current_item = function(){
		return item_current.name;
	}

	function light_by_events_info(){
		
		for ( var ev in events_info_actived ){

			if( !events_info_actived[ev] ) continue;
			
			for( var name in menu ){
				var d_item = menu[name];

				if( !d_item.events_info ) continue;

				for( var i = 0; i < d_item.events_info.length; i++ ){
					if( ev == d_item.events_info[i] ){
						status_light_set(d_item.name);
					}
				}
			}
		}

		light_all();
	}
	
	function get_item_by_tab(tab_name){
		if( /^(events|prizes|videos)$/.test(tab_name) ){
			return 'feed.' + tab_name;
		}
		else {
			return tab_name;
		}
	}

	function childs_is_light(d_item){
		var childs = get_childs(d_item);
		for ( var i = 0; i < childs.length; i++ ){
			var child = childs[i];
			if( child.light ){
				return true;
			}
		}

		return false;
	}

	function light_off(d_item){
		if ( !childs_is_light(d_item) ){
			d_item.light = false;
			if( d_item.parent ) light_off(menu[d_item.parent]);
		}
	}

	function events_info_del(d_item){
		
		var items_info = [];
		
		if( !d_item.events_info ) return;
		
		for( var i = 0; i < d_item.events_info.length; i++ ){
			var ev_name = d_item.events_info[i];
			if( events_info_actived[ev_name] ){
				items_info.push(ev_name);
			}
		}
		
		if( !items_info.length ) return;
		
		(function(d_item, items_info){
			function result(res){ 
				if( res.status == 'ok' ){
					light_off(d_item);
				}
				else {
					console.log('error ajax');
				}
			}

			$.ajax({
				url: "/account/events_info_del",
				dataType: 'json',
				async: true,
				data: { 
					items: items_info.join(',')
				},
				error: function(){
					result({ status: 'error' });
				},
				success: result, 
			});
		})(d_item, items_info);
	}

	function get_root_item(d_item){
		if( d_item.parent ){
			var d_parent = menu[d_item.parent];
			return get_root_item(menu[d_item.parent]);
		}
		else {
			return d_item;
		}
	}

	function get_childs(d_item){
		var childs = [];
		for( var name in menu ){
			var d_item_x = menu[name];
			if ( d_item_x.parent == d_item.name ){
				childs.push(d_item_x);
			}
		}
		
		return childs;
	}

	function set_item_current(d_item){
		
		var childs = get_childs(d_item);

		if( childs.length ){
			for( var i = 0; i < childs.length; i++){
				var d_child = childs[i];
				if ( d_child.actived ){
					set_item_current(d_child);
					break;
				}
			}
		}
		else {
			item_current = d_item;
		}
	}
	
	function deactivate(item){
		var d_item = menu[item];
		d_item.actived = false;
		menu_light(d_item.name);
	}

	// подразумевается, что еще нет подсвеченных элементов
	function light_all(){
		for( var item in menu ){
			var d_item = menu[item];
			if( d_item.light && !d_item.actived ){
				menu_light(d_item.name);
			}
		}
	}
	
	function menu_light(item){

		var d_item = menu[item];
		if (d_item) {
		// подсветка главного меню	
		if( !d_item.parent ){
			light_root_menu(item);
		}
		// подсветка подменю Ленты 
		else if( d_item.parent == 'feed' ){
			light_feed_menu(item);
		}
		else { 
			console.log("error: not implement action for menu:" + d_item.parent );
		}
	}
	}

	function menu_light_off(item){

		var d_item = menu[item];

		// подсветка главного меню	
		if( !d_item.parent ){
			light_root_menu_off(item);
		}
		// подсветка подменю Ленты 
		else if( d_item.parent == 'feed' ){
			light_feed_menu_off(item);
		}
		else { 
			console.log("error: not implement action for menu:" + d_item.parent );
		}
	}

	function light_root_menu(item){
		var d_item = menu[item];
		
		if( !d_item.light || d_item.lighted || d_item.actived ) return; 

		var node = $(".menu a[href=#"+item+"]").parents('li:first');
		    node.addClass('menu-lights');

		d_item.lighted = true;
	}

	function light_root_menu_off(item){
		var d_item = menu[item];
		
		if( !d_item.lighted || !d_item.light ) return; 

		var node = $(".menu a[href=#"+item+"]").parents('li:first');
		    node.removeClass('menu-lights');

		d_item.lighted = false;
	}

	function light_feed_menu(item){
		var d_item = menu[item];

		if( !d_item.light || d_item.lighted || d_item.actived ) return; 

		var name = item.split('.').pop();
		var node = $("#feed ul.tabs li[name='"+name+"']");
		node.addClass('feed-lights');
		d_item.lighted = true;
		menu_light(d_item.parent);
	}

	function light_feed_menu_off(item){
		var d_item = menu[item];

		if( !d_item.lighted ) return; 

		var name = item.split('.').pop();
		var node = $("#feed ul.tabs li[name='"+name+"']");
		node.removeClass('feed-lights');
		d_item.lighted = false;
		//menu_light_off(d_item.parent);
	}
	
	function status_light_set(name){
		var d_item = menu[name];
		if (d_item) {
			if ( d_item.light ) return;
			d_item.light = true;
			if( d_item.parent ){
				status_light_set(d_item.parent);
			}
		}
	}

	function root_menu_nodes(){
		var items = $(".menu > ul > li > a[href^=#]");
		for( var i = 0; i < items.length; i++ ){
			items[i] = $(items[i]).parents('li:first');
		}
		return items;
	}

	function feed_menu_nodes(){
		return $("#feed ul.tabs > li > a");
	}

	function get_tab_name(){
		return location.search.replace(/.+tab=(\w+).*/, "$1");
	}
});
//-- регистрация промо-кода 
_scope.add('pcoupon_register', function (){
	
	var _this = this;
	var page = $("#profile div[name=page-d]");
	var form = page.find("form[name=pcoupon_register]");
	var info = form.find('div[name=info]');

	form.on('submit', request);
	
	$(".reg-icon4").bind('click', function(){
	    _this.window_show();
	    return false;
	});
	
	this.window_hide = function(){
	    page.css('display', 'none');
	}

	this.window_show = function(){
	    $("#profile div[name^=page-]").css('display', 'none');
	    page.css('display', 'block');
	}

	function request_result(res){

	    info.find('div[name^=i-]').css('display', 'none');
	  
	    if ( res.status == 'ok' ){
	        _scope.main.update_points(res.data.points);
	        _scope.menu_lights.set_events_info(res.data.events_info);
	        info.find('div[name=i-success]')
	            .css('display', 'block')
	            .fadeOut(4000);
	    }
	    else {
	        var mess;
	        if ( res.status == 'num_novalid' ){
	            mess = "Неверный код";
	        }
	        else if ( res.status == 'not_fill' ){
	            mess = "Не указан код";
	        }
	        else if ( res.status == 'not_exists' ){
	            mess = "Код не найден";
	        }
	        else if ( res.status == 'registered' ){
	            mess = "Карта уже была зарегистрирована";
	        }
			else if ( res.status == 'no more than one' ){
				mess = "Карта этой акции уже была зарегистрирована";
				if (res.data) { mess += "<br/>(" + res.data + ")" };
	        }
	        else {
	            mess = "Ошибка запроса к серверу";
	        }
	  	
	        info.find('div[name=i-error]').html(mess)
	            .css('display', 'block')
	            .fadeOut(4000);
	    }
	}

	function request(){
	    info.find('div[name=i-notice]').css('display', 'block');
	    setTimeout(function(){
	        $.ajax({
	            url: "/account/pcoupon_register",
	            method: 'post',
	            dataType: 'json',
	            async: false,
	            data: {
	                code: form.find('input[name=code]').val()
	            },
	            error: function(){ 
	                request_result({ status: 'error' });
	            },
	            success: request_result
	        });
	    }, 20);
		return false;
	}
	
});
_scope.add('progress', function (){
	var _this = this;
	var _window = $("#modal-display-progress");
	var css_z_index_orig;
	var css_z_index = 99;

	_window.find('>div[name=close]:first').bind('click', window_hide);

	this.window_show = function(){
		document.getElementById('saving-shade').style.display = 'block';
		css_z_index_orig = $('.top-reg-btn').css('z-index');
		$('.top-reg-btn').css('z-index', css_z_index);
		_window.css('display', 'block');
	}

	function window_hide(){
		$('.top-reg-btn').css('z-index', css_z_index_orig);
		css_z_index_orig = null;
		_window.css('display', 'none');
		document.getElementById('saving-shade').style.display = 'none';
	}
});
//-- scope.rating: Zen рейтинг
_scope.add('rating', function () {
});
//-- Страница "Пригласить друга" 
_scope.add('refer', function (){
	var _window = $("#refer");	
	var form = _window.find('form[name=refer]');
	var info = form.find('div[name=info]');
	
	form.on('submit', form_submit);

	function form_submit(){
		
		request({
			email:	 form.find('input[name=email]').val(),
		   	subject: form.find('input[name=subject]').val(),
			body:	 form.find('textarea[name=body]').val()
		});

		return false;
	}
	
	function request_result(res){

		info.find('div[name^=i-]').css('display', 'none');
		
		if ( res.status == 'ok' ){
			info.find('div[name=i-success]')
				.css('display', 'block')
				.fadeOut(4000);
		}
		else {
			var mess;
			if ( res.status == 'email_required' ){
				mess = "Не указан e-mail";
			}
			else if ( res.status == 'limit_hour_out' ){
				mess = "Ограничение в " + res.data.limit_messages_hour + " сообщений в час";
			}
			else if ( res.status == 'send_error' ){
				mess = "Ошибка при отправке письма, попробуйте позже";
			}
			else {
				mess = "Ошибка запроса к серверу";
			}
			
			info.find('div[name=i-error]').html(mess)
				.css('display', 'block')
				.fadeOut(4000);
		}
	}

	function request(data){
		info.find('div[name=i-notice]').css('display', 'block');
		setTimeout(function(){
			$.ajax({
				url: "/account/refer_friend",
				type: 'POST',
				dataType: 'json',
				async: false,
				data: data,
				error: function(){ 
					request_result({ status: 'error' });
				},
				success: request_result
			});
		}, 20);
	}
});
//-- регистрация абонемента
_scope.add('subscription', function (){
	
	var _this = this;
	var form = $("#profile div[name=page-c] form[name=subscription]");
	var info = form.find('div[name=info]');

	form.on('submit', request);
	
	$(".reg-icon2").bind('click', function(){
		_this.window_show();
		return false;
	});
	
	this.window_hide = function(){
		$("#profile div[name=page-c]").css('display', 'none');
		$("#profile div[name=page-a]").css('display', 'block');
	}

	this.window_show = function(){
		$("#profile div[name^=page-]").css('display', 'none');
		$("#profile div[name=page-c]").css('display', 'block');
	}

	function request_result(res){

		info.find('div[name^=i-]').css('display', 'none');
		
		if ( res.status == 'ok' ){
			form.find('input[type=text]').attr({"disabled":"disabled"});
			form.find('button[name=save]').css({"visibility":"hidden"});
			_scope.main.update_points(res.data.points);
			_scope.menu_lights.set_events_info(res.data.events_info);
			info.find('div[name=i-success]')
				.css('display', 'block')
				.fadeOut(4000);
		}
		else {
			var mess;
			if ( res.status == 'subscription_num_novalid' ){
				mess = "Неправильный номер абонемента";
			}
			else if ( res.status == 'not_fill' ){
				mess = "Укажите номер абонемента";
			}
			else if ( res.status == 'subscription_not_exists' ){
				mess = "Абонемент не найден";
			}
			else if ( res.status == 'subscription_registered' ){
				mess = "Абонемент был ранее вами зарегистрирован";
			}
			else if ( res.status == 'subscription_registered_other' ){
				mess = "Абонемент на данный матч вами уже зарегистрирован";
			}
			else if ( res.status == 'subscription_registered_2' ){
				mess = "Абонемент зарегистрирован на другое лицо";
			}
			else if ( res.status == 'season_subs_limit_out' ){
				mess = "Можно зарегистрировать только один абонемент на сезон";
			}
			else {
				mess = "Ошибка запроса к серверу";
			}
			
			info.find('div[name=i-error]').html(mess)
				.css('display', 'block')
				.fadeOut(4000);
		}
	}

	function request(){
		info.find('div[name=i-notice]').css('display', 'block');
		var form_data = {}; form.find('input[type="text"]').each(function(i, el){form_data[$(el).attr('name')] = $(el).val()})
		setTimeout(function(){
			$.ajax({
				url: "/account/subscription_register",
				method: 'post',
				dataType: 'json',
				data: form_data,
				error: function(){ 
					request_result({ status: 'error' });
				},
				success: request_result
			});
		}, 20);
		return false;
	}
	
});

//-- регистрация билета
_scope.add('ticket', function (){
	
	var _this = this;
	var form = $("#profile div[name=page-b] form[name=ticket]");
	var info = form.find('div[name=info]');

	form.on('submit', request);
	
	$(".reg-icon1").bind('click', function(){
		_this.window_show();
		return false;
	});
	
	this.window_hide = function(){
		$("#profile div[name=page-b]").css('display', 'none');
		$("#profile div[name=page-a]").css('display', 'block');
	}

	this.window_show = function(){
		$("#profile div[name^=page-]").css('display', 'none');
		$("#profile div[name=page-b]").css('display', 'block');
	}

	function request_result(res){

		info.find('div[name^=i-]').css('display', 'none');
		
		if ( res.status == 'ok' ){
			_scope.main.update_points(res.data.points);
			_scope.menu_lights.set_events_info(res.data.events_info);
			info.find('div[name=i-success]')
				.css('display', 'block')
				.fadeOut(4000);
		}
		else {
			var mess;
			if ( res.status == 'ticket_num_novalid' ){
				mess = "Неправильный номер билета";
			}
			else if ( res.status == 'not_fill' ){
				mess = "Укажите номер билета";
			}
			else if ( res.status == 'ticket_not_exists' ){
				mess = "Билет не найден";
			}
			else if ( res.status == 'ticket_registered' ){
				mess = "Билет вами уже зарегистрирован";
			}
			else if ( res.status == 'ticket_registered_other' ){
				mess = "Билет на данный матч вами уже зарегистрирован";
			}
			else if ( res.status == 'ticket_registered_2' ){
				mess = "Билет зарегистрирован на другое лицо";
			}
			else {
				mess = "Ошибка запроса к серверу";
			}
			
			info.find('div[name=i-error]').html(mess)
				.css('display', 'block')
				.fadeOut(4000);
		}
	}

	function request(){
		info.find('div[name=i-notice]').css('display', 'block');
		setTimeout(function(){
			$.ajax({
				url: "/account/ticket_register",
				method: 'post',
				dataType: 'json',
				data: {
					ticket_num: form.find('input[name=ticket_num]').val()
				},
				error: function(){ 
					request_result({ status: 'error' });
				},
				success: request_result
			});
		}, 20);
		return false;
	}

});
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
//-- видео
// require video.js
_scope.add('video', function (){
	var window_video = $("#modal-display-video");
	var myPlayer = videojs('example_video_1');
	var current_is_youtube;

	function window_wideo_show(video){
		
		if ( video.is_youtube && video.ytid != 0 ){
			current_is_youtube = true;
			window_video.find('div[name=html5]').css('display', 'none');
			$("<iframe/>", {
				name: 'a',
				src:   "//www.youtube.com/embed/"+video.ytid+"?autoplay=1&amp;autohide=1&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1", 
				style: "width: 800px; height: 400px; border: 0;"
			}).appendTo(window_video);
		}
		else {
			current_is_youtube = false;
			window_video.find('div[name=html5]').css('display', 'block');
			myPlayer.src(video.file);
		}
		
		document.getElementById('saving-shade').style.display = 'block';
		window_video.css('display', 'block');
	}
	
	function window_video_hide(){
		if ( current_is_youtube ){
			window_video.find('iframe[name=a]').remove();
		}
		else {
			myPlayer.pause();
		}
		document.getElementById('saving-shade').style.display = 'none';
		window_video.css('display', 'none');
	}
	
	$("div[name=videos] div[name=video]").bind('click', function(){
		var video = JSON.parse($(this).attr('data-video'));
		video.is_youtube = typeof video.is_youtube !== 'undefined' ? true : false;
		video.ytid       = typeof video.ytid !== 'undefined' ? video.ytid : 0;
		window_wideo_show(video);
	});
	
	window_video.find('>div[name=close]:first').bind('click', function(){
		window_video_hide();
	});
});
