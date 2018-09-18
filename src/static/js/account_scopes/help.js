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
