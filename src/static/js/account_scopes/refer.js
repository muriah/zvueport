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
