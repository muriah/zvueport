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
