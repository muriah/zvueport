_scope.add('progress', function (){
	var _this = this;
	var _window = $("#modal-display-progress");
	var css_z_index_orig;
	var css_z_index = 99;

	_window.find('>div[name=close]:first').bind('click', window_hide);

	this.window_show = function(){
		document.getElementById('saving-shade').style.display = 'block';
		css_z_index_orig = $('.top-reg-btn').css('z-index');
		$('.top-reg-btn').css('z-index', css_z_index);
		_window.css('display', 'block');
	}

	function window_hide(){
		$('.top-reg-btn').css('z-index', css_z_index_orig);
		css_z_index_orig = null;
		_window.css('display', 'none');
		document.getElementById('saving-shade').style.display = 'none';
	}
});
