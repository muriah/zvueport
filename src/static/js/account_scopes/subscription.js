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
