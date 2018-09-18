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
