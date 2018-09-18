var messages = {
	missing: {
		login:  'Логин нужно заполнить',
		password:  'Пароль нужно заполнить',
		first_name:  'Имя нужно заполнить',
		last_name:  'Фамилию нужно заполнить',
		mobile: 'Телефон нужно заполнить',
		email:  'Email нужно заполнить',
		'cb-iagree':  'Пожалуйста, отметьте, что согласны с правилами',
	},
	invalid: {
		login:  'Логин должен быть не короче 5 символов. и содержать только буквы английского алфавита, цифры, точку и знак подчёркивания',
		password:  'Пароль должен быть не короче 5 символов',
		first_name:  'Имя может содержать буквы русского и английского алфавита, цифры, точку, дефис и знак подчёркивания',
		last_name:  'Фамилия может содержать буквы русского и английского алфавита, цифры, точку, дефис и знак подчёркивания',
		mobile: 'Телефон должен содержать 10 цифр',
		email:  'Неправильный формат email',
	},
	busy:    {
		login:  'Этот логин уже занят',
		mobile: 'Этот телефон уже занят',
		email:  'Это email уже занят',
	},
};

export function initJoinPage () {
	if ($("#bsubmit").length == 1) {
		// validation
		$("#ffan").on("submit", function() {
			if ($('#cb-iagree').is(':checked')) {

				invalid({});

				$('#bsubmit').attr({disabled: "disabled"});

				var required = ['first_name', 'last_name', 'mobile', 'password'];
				var inputs = $("#ffan input[type='text']");
				var validated = {'_ERROR':1,'_BUSY':[],'_MISSING':[],'_INVALID':[]};
				var ok = true;
				for (var i=0; i<required.length;i++) {
					var inp = $("#ffan input[name='"+required[i]+"']");
					if (inp) {
						if (inp.val() == '') {
							validated._MISSING.push(required[i]);
							ok = false;
						} else if (!valid(inp.attr('name'), inp.val().toUpperCase())) {
							validated._INVALID.push(required[i]);
							ok = false;
						}
					}
				}
				if (!ok) {
					invalid(validated);
					$('#bsubmit').removeAttr("disabled");
					return false;
				} else {
					$.ajax({
						type: "POST",
						url: "/join",
						data: {
							password   : $('input[name="password"]').val(),
							mobile     : $('input[name="mobile"]').val(),
							last_name  : $('input[name="last_name"]').val(),
							first_name : $('input[name="first_name"]').val(),
							agreed     : $('#iagreed').prop('checked'),
							filled     : "filled",
							refrr      : $('input[name="refrr"]').val(),
						}
					})
					.done(function( msg ) {
						try {
							var answer = JSON.parse(msg);
							if (answer._redirect2) {
								window.location = answer._redirect2;
							} else {
								invalid(answer);
							}

						} catch(e) {
							invalid({});
							console.log(msg);
							console.log(e);
						}
					})
					.error(function( msg ) {
						invalid({});
						console.log(msg);
						showWarning('saving-modal', 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.', 500);
					})
					.always(function( msg ) {
						$('#bsubmit').removeAttr("disabled");
					});
					return false;
				}
			} else {
				invalid({"_ERROR" : 1, "_MISSING": ["cb-iagree"]});
				return false;
			}
		});
	}

	var form_auth = new scope_form_auth();
	var form_reset_pwd = new scope_form_reset_pwd();
}

function valid(ftype, fvalue) {
	var rexs = {
		first_name : /^[A-ZА-Я0-9._-]{2,100}$/i,
		last_name  : /^[A-ZА-Я0-9._-]{2,100}$/i,
		mobile     : /^\d{10}$/,
		password   : /^[0-9a-z~`!@#$%^&*()_+=-\\\/|{}\[\],.:;"']{5,20}$/i
	};

	var re = rexs[ftype];
	if (re) {
		return re.test(fvalue);
	} else {
		return false;
	}
}

function showWarning(id, message, isError) {
	var elem = $('#'+id);
	if (elem.size() > 0) {
		if (isError) {
			elem.removeClass('noerr_info').addClass('err500_info');
		} else {
			elem.removeClass('err500_info').addClass('noerr_info');
		}
		elem.text(message);
		elem.fadeIn( 400, function() {
			elem.delay(2000).fadeOut( 400 );
		});
	}
}

function invalid(valid) {
	$('input[type=text],input[type=password]').removeClass('missing invalid busy');
	$('.d-error, .d-error>div').hide();
	$('.d-error>div').empty();
	if (valid['_ERROR']) {
		if (valid['_MISSING']) {
			for(var i=0;i<valid['_MISSING'].length;i++) {
				var iname = valid['_MISSING'][i];
				$('input[name="'+iname+'"]').addClass('missing');
				$('input[name="'+iname+'"]').parent().next().find('div').text(messages.missing[iname]);
			}
		}
		if (valid['_INVALID']) {
			for(var i=0;i<valid['_INVALID'].length;i++) {
				var iname = valid['_INVALID'][i];
				$('input[name="'+iname+'"]').addClass('invalid');
				$('input[name="'+iname+'"]').parent().next().find('div').text(messages.invalid[iname]);
			}
		}
		if (valid['_BUSY']) {
			for(var i=0;i<valid['_BUSY'].length;i++) {
				var iname = valid['_BUSY'][i];
				$('input[name="'+iname+'"]').addClass('busy');
				$('input[name="'+iname+'"]').parent().next().find('div').text(messages.busy[iname]);
			}

		}
		$('.d-error > div:not(:empty)').show();
		$('.d-error > div:not(:empty)').parent().show();
	}
}

function scope_form_auth(){

	var _window = $("div[name=auth]");

	var info = new scope_info();

	_window.find("input[name=login]").bind('click', function(){

		info.request_start(function(){

			var user = _window.find("input[name=username]").val();
			var pass = _window.find("input[name=password]").val();

			$.ajax({
				url: '/login',
				dataType: 'json',
				async: false,
				data: {
					username: user,
					password: pass,
					club: _window.find("input[name=club]").val(),
					ajax: true
				},
				error: function(){
					form_saved_handler({ status: 'error', mess: "Ошибка запроса к серверу" });
				},
				success: form_saved_handler
			});
		});

		return false;
	});

	function scope_info(){

		this.request_start = function(caller){
			info_clear();
			_window.find("div[name=info-request]").css('display', 'block');
			setTimeout(caller, 20);
		}

		this.request_end = function(){
			info_clear();
			_window.find("div[name=info-request]").css('display', 'none');
		}

		this.request_error = function(message){
			info_clear();
			_window.find("div[name=info-request_error]")
				.css('display', 'block')
				.text(message);
		}

		this.request_ok = function(caller){
			info_clear();
			_window.find("div[name=info-request_ok]").css('display', 'block');
			setTimeout(caller, 200);
		}

		function info_clear(){
			_window.find("div[name^=info-]").css('display', 'none');
		}
	}

	function form_saved_handler(result){
		info.request_end();

		if( result.status == 'ok' ){
			info.request_ok(function(){
				location.href = result.go2 || '/account';
			});
		}
		else if ( result.status == 'fail' ){
			info.request_error('Неверное имя пользователя или пароль');
		}
		else if ( result.status == 'no_activated' ){
			location.href = '/account/activate';
		}
		else if ( result.status == 'empty_fields' ){
			info.request_error('Не все поля заполнены');
		}
		else {
			// error
			info.request_error('Ошибка запроса к серверу');
		}
	}
}

function scope_form_reset_pwd(){

	var _window = $("form[name=reset_pwd]");

	var info = new scope_info();

	_window.find("input[name=reset_pwd]").bind('click', function(){

		info.request_start(function(){
			$.ajax({
				url: '/join/reset_pwd',
				dataType: 'json',
				data: {
					"mobile": _window.find("input[name=mobile]").val(),
					"club": _window.find("input[name=club]").val(),
					"ajax": true
				},
				error: function(){
					form_saved_handler({ status: 'error', mess: "Ошибка запроса к серверу" });
				},
				success: form_saved_handler
			});
		});

		return false;
	});

	function scope_info(){

		this.request_start = function(caller){
			info_clear();
			_window.find("div[name=info-request]").css('display', 'block');
			setTimeout(caller, 20);
		}

		this.request_end = function(){
			info_clear();
			_window.find("div[name=info-request]").css('display', 'none');
		}

		this.request_error = function(message){
			info_clear();
			_window.find("div[name=info-request_error]")
				.css('display', 'block')
				.text(message);
		}

		this.request_ok = function(caller){
			info_clear();
			_window.find("div[name=info-request_ok]").css('display', 'block');
			setTimeout(caller, 200);
		}

		function info_clear(){
			_window.find("div[name^=info-]").css('display', 'none');
		}
	}

	function form_saved_handler(result){
		info.request_end();

		if ( undefined !== result.sms_sended_to ) {
			info.request_ok(function(){
				location.href = '/join/reset_token';
			});
		}
		else if (  undefined !== result.error ){
			info.request_error('Телефон не найден');
		}
		else {
			// error
			info.request_error('Ошибка запроса к серверу');
		}
	}
}
