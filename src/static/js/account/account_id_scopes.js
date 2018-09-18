_scope.add('main', function (){
	var _this = this;
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
		_this.show_user_events();
	}
	
	this.set_url_user_events = function(url){
		url_user_events = url;
	}
	
	this.show_user_events = function(){
		_mod.account_id.showModal("Запрос данных");
		ajax_events(function(res){
			
			if ( res.status == 'ok' ){
				last_point = res.data.last_point;
				$('#feed-items').append(res.data.content);
				if( res.data.is_end ){
					is_end = true;
					$("button[name=feed_next_list]").css({ cursor: 'default', 'background-color': 'gray' });
				}
				_mod.account_id.hideModal();
			}
			else {
				var mess;
				if ( res.status == 'foo' ){
					mess = "foo message";
				}
				else {
					mess = "Ошибка запроса к серверу";
				}
				_mod.account_id.hideModal(mess);
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

	$("button[name=feed_next_list]").bind('click', function(){
		if( !is_end ){
			_this.show_user_events();
		}
	});
});