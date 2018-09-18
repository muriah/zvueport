
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
