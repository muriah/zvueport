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
	            mess = "Код уже была зарегистрирован";
	        }
			else if ( res.status == 'no more than one' ){
				mess = "Нельзя зарегистрировать больше кодов этой акции";
				if (res.data) { mess += "<br/>(" + res.data + ")" };
	        }
			else if ( res.status == 'pcaction_is_over' || res.status == 'no_reg_date' || res.status == 'reg_date_too_old' ){
				mess = "Время действия этого кода истекло";
	        }
	        else {
	            mess = "Ошибка запроса к серверу";
	        }

	        info.find('div[name=i-error]').html(mess)
	            .css('display', 'block')
	            .fadeOut(3000);
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
