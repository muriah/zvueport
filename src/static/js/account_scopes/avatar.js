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
