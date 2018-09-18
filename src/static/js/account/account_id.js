var _scope = (function(){

	var scope = function(){
		this.add = function(name, func){
			this[name] = new func();
		}
	};
	return new scope();
})();

$( document ).ready( function() {
	
	$(".scrollbar").scroller({
		customClass: "advanced",
		handleSize: 58
	});
	
	$('.jcarousel-skin-tango').hide();
	$('.prof-rating-btn').click(function(){
 		if($(this).is('.open-active')){
			$(this).removeClass('open-active');
  			$('.prod-rating').find('.jcarousel-skin-tango').slideUp(200);
 		}else{
			$(this).addClass('open-active');
  			$('.prod-rating').find('.jcarousel-skin-tango').slideDown(200);
 		}
 	});
	
	function select_tab(tab_id) {

		if ('#profile' == tab_id ){
			$('.top-reg-btn').show();
			$('#wrapper').addClass('profile-border-page');
		} else {
			$('.top-reg-btn').hide();
			$('#wrapper').removeClass('profile-border-page');
		}

		// mark selected tab's header
		$( '#ul-tab-headers li.menu-current' ).removeClass('menu-current');
		$( '#ul-tab-headers a[href="'+ tab_id +'"]' ).parents("li:first").addClass('menu-current');

		// show selected tab, hide the others
		$('#d-tabs div.tab').hide();
		$(tab_id).show();
		// show selected tab, hide the others
		if ( tab_id == '#feed' ){
			$('.top-reg-btn a.reg-active').removeClass('reg-active');
			_scope.feed.tab_activate();	
		}
		else if ( tab_id == '#profile' ){
		}
	}
	
	//-- активировать вкладку в соответствиии с ?tab=foo
	(function(){
		var tabs = /\btab=(\w+)/.exec(location.search);
		if( tabs ){
			select_tab("#"+tabs[1]) 
		}
		else {
			select_tab($( '#ul-tab-headers a' ).first().attr('href'));
		}	
	})();
	
	// интеграция history.js	
	$("#ul-tab-headers > li > a, .stateful").bind('click', function(event){
		event.preventDefault();
		var hash 	= $(this).attr('href').split('#')[1];
		var title 	= "State " + hash;
		var url 	= "http://" + location.host + location.pathname + "?tab=" + hash;
		
		History.pushState({hash: hash}, title, url);
		
		return true;
	});
	
    History.Adapter.bind(window,'statechange',function(){
        /*
		if( _scope.{NAME}.window_is_active ){
			_scope.{NAME}.window_hide();
		}
		*/

        var state = History.getState();
		if ( !state.data.hash ){
			state.data.hash = 'profile';
		}
		select_tab("#" + state.data.hash);
    });	

});

