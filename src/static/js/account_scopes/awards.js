_scope.add('awards', function (){
	var _this = this;
	var icons = $(".prof-awards > ul > li");
	var button_more = $(".prof-awards .more-btn a:first");
	var _window = $("#modal-display-award_info");
	var window_is_actived;
	var window_num = 0;
	var progress_items;
	
	button_more.bind('click', function(){
		_scope.progress.window_show();
		return false;
	});

	icons.find('a:first').bind('click', function(){
		var award_name = $(this).parents('li:first').attr('name');
		window_show(award_name);
		return false;
	});
	
	_window.find('>div[name=close]:first').bind('click', window_hide);
	
	
	this.scope_init = function(data){
		progress_items = data;
		
		var progress_by_key = {};
		for ( var i in progress_items ){
			var pr = progress_items[i];
			progress_by_key[pr.progress_key] = pr;
		}

		for( var i = 0; i < icons.length; i++ ){
			var icon = icons[i];
			var key = $(icon).attr('name') + '000';
			key = key.replace(/z/, '');
			if( typeof progress_by_key[key] !== 'undefined' ){
				$(icon).addClass('active');
			}
		}
	}

	function window_show(award_name){
		
		window_num = window_num + 1;
		
		if( window_is_actived ) section_deactivate();

		section_activate(award_name);
		
		if( !window_is_actived ){
			_window.css('display', 'block');
		}

		window_is_actived = true;
		
		window_fadeout();
	}

	function window_hide(){
		_window.css('display', 'none');
		section_deactivate();
		window_is_actived = false;
	}

	function section_activate(name){
		_window.find('div[name="info-'+name+'"]').css('display', 'block');
	}

	function section_deactivate(){
		_window.find('div[name^="info-"]').css('display', 'none');
	}

	function window_fadeout(){
		(function(window_num_current){
			_window.fadeOut({
				duration: 3000, 
				complete: window_hide,
				step: function(){
					if( window_num_current != window_num){
						_window.stop().animate({opacity:'100'});
					}
				}
			});
		})(window_num);
	}
});
