_scope.add('menu_lights', function (){
	
	var _this = this;
	var menu_names = [
		'regticket', 'regsub', 'reg_pcoupon', 'feed.events', 'feed.prizes', 'feed.videos' 
	];
	
	var menu = {};
	var item_previous;
	var item_current;
	var events_info_actived = {
		balls_change: false,
		video_open: false
	};

	this.scope_inited = null; 	

	this.scope_init = function(_events_info_actived){

		var menu_events_info = {
			'feed.events': ['balls_change'],
			'feed.videos': ['video_open']
		};
		
		for( var i = 0; i < _events_info_actived.length; i++ ){
			var name = _events_info_actived[i];
			events_info_actived[name] = true;
		}

		// инициализация menu_names, menu 
		var root_menu = root_menu_nodes();	

		for( var i = 0; i < root_menu.length; i++ ){
			var item = root_menu[i];
			var name = $(item).find('a:first').attr('href').split('#')[1];
			menu_names.push(name);
		}
		
		for( var i = 0; i < menu_names.length; i++ ){
			var name = menu_names[i];
			var parent_item;
			if( /\./.test(name) ){
				var parts = name.split('.');
				parts.pop();
				parent_item = parts.join('.');
			}
			else {
				parent_item = null;
			}
			
			var tab_name = /^feed\./.test(name) ? name.split('.')[1] : name;

			menu[name] = {
				name: name,
				actived: null,
				parent: parent_item,
				light: null,
				lighted: null,
				events_info: null,
				tab_name: tab_name
			}

			if( typeof(menu_events_info[name]) !== 'undefined' ){
				menu[name].events_info = menu_events_info[name];
			}
		}
		
		// инициализация actived_menu, item_current 
		var actived_menu;
		for( var i = 0; i < root_menu.length; i++ ){
			var item_x = root_menu[i];

			if( $(item_x).hasClass('menu-current') ){
				actived_menu = $(item_x).find('a:first').attr('href').split('#')[1];
				break;
			}
		}

		if( !actived_menu ) actived_menu = get_item_by_tab(get_tab_name());
		
		var _item_current = menu[actived_menu];
		if (_item_current) {
			_item_current.actived = true;
			set_item_current(_item_current);
		}
		
		// init 'feed' menu 
		var feed_menu = feed_menu_nodes();	
		var feed_actived_menu = {};

		for( var i = 0; i < feed_menu.length; i++ ){
			var item_x = feed_menu[i];

			if( $(item_x).hasClass('current') ){
				feed_actived_menu = 'feed.' + $(item_x).attr('href').split('#')[1];
				feed_actived_menu = menu[feed_actived_menu];
				break;
			}
		}
		
		feed_actived_menu.actived = true;
		
		if ( menu[feed_actived_menu.parent] ? menu[feed_actived_menu.parent].actived : false ) {
			item_current = feed_actived_menu;
		}

		light_by_events_info();
		
		if (item_current) {
			_this.activate(item_current.name);
		}
		_this.scope_inited = true;
	}

	this.activate = function(tab_name){
		var item = get_item_by_tab(tab_name); 
		if( !_this.scope_inited ) return;
		var d_item = menu[item];

		if (d_item) {		
		d_item.actived = true;
		item_previous = item_current;
		
		//-- deactivate previous
		if( d_item.parent && item_previous ){
			if( item_previous.parent ){
				if( d_item.parent == item_previous.parent ){
					deactivate(item_previous.name);	
				}
				else {
					console.log('draft');
				}
			}
			else {
				console.log('draft');
			}
		}
		// choosed root menu item
		else {
			if (!item_previous) { return };
			if( item_previous.parent ){
				var root_item = get_root_item(item_previous);
				deactivate(root_item.name);	
			}
			// previous choosed root menu item
			else {
				deactivate(item_previous.name);	
			}
		}
		
		// --
		set_item_current(d_item);
		menu_light_off(d_item.name);
		events_info_del(item_current);
		}
	}

	this.set_events_info = function(events_info){

		for ( var i in events_info ){
			var ev = events_info[i];

			if( events_info_actived[ev] ) continue;
			events_info_actived[ev] = true;

			for( var name in menu ){
				var d_item = menu[name];

				if( !d_item.events_info ) continue;

				for( var i = 0; i < d_item.events_info.length; i++ ){
					if( ev == d_item.events_info[i] ){
						status_light_set(d_item.name);
					}
				}
			}
		}
		
		light_all();
	}
	
	this.get_current_item = function(){
		return item_current.name;
	}

	function light_by_events_info(){
		
		for ( var ev in events_info_actived ){

			if( !events_info_actived[ev] ) continue;
			
			for( var name in menu ){
				var d_item = menu[name];

				if( !d_item.events_info ) continue;

				for( var i = 0; i < d_item.events_info.length; i++ ){
					if( ev == d_item.events_info[i] ){
						status_light_set(d_item.name);
					}
				}
			}
		}

		light_all();
	}
	
	function get_item_by_tab(tab_name){
		if( /^(events|prizes|videos)$/.test(tab_name) ){
			return 'feed.' + tab_name;
		}
		else {
			return tab_name;
		}
	}

	function childs_is_light(d_item){
		var childs = get_childs(d_item);
		for ( var i = 0; i < childs.length; i++ ){
			var child = childs[i];
			if( child.light ){
				return true;
			}
		}

		return false;
	}

	function light_off(d_item){
		if ( !childs_is_light(d_item) ){
			d_item.light = false;
			if( d_item.parent ) light_off(menu[d_item.parent]);
		}
	}

	function events_info_del(d_item){
		
		var items_info = [];
		
		if( !d_item.events_info ) return;
		
		for( var i = 0; i < d_item.events_info.length; i++ ){
			var ev_name = d_item.events_info[i];
			if( events_info_actived[ev_name] ){
				items_info.push(ev_name);
			}
		}
		
		if( !items_info.length ) return;
		
		(function(d_item, items_info){
			function result(res){ 
				if( res.status == 'ok' ){
					light_off(d_item);
				}
				else {
					console.log('error ajax');
				}
			}

			$.ajax({
				url: "/account/events_info_del",
				dataType: 'json',
				async: true,
				data: { 
					items: items_info.join(',')
				},
				error: function(){
					result({ status: 'error' });
				},
				success: result, 
			});
		})(d_item, items_info);
	}

	function get_root_item(d_item){
		if( d_item.parent ){
			var d_parent = menu[d_item.parent];
			return get_root_item(menu[d_item.parent]);
		}
		else {
			return d_item;
		}
	}

	function get_childs(d_item){
		var childs = [];
		for( var name in menu ){
			var d_item_x = menu[name];
			if ( d_item_x.parent == d_item.name ){
				childs.push(d_item_x);
			}
		}
		
		return childs;
	}

	function set_item_current(d_item){
		
		var childs = get_childs(d_item);

		if( childs.length ){
			for( var i = 0; i < childs.length; i++){
				var d_child = childs[i];
				if ( d_child.actived ){
					set_item_current(d_child);
					break;
				}
			}
		}
		else {
			item_current = d_item;
		}
	}
	
	function deactivate(item){
		var d_item = menu[item];
		d_item.actived = false;
		menu_light(d_item.name);
	}

	// подразумевается, что еще нет подсвеченных элементов
	function light_all(){
		for( var item in menu ){
			var d_item = menu[item];
			if( d_item.light && !d_item.actived ){
				menu_light(d_item.name);
			}
		}
	}
	
	function menu_light(item){

		var d_item = menu[item];
		if (d_item) {
		// подсветка главного меню	
		if( !d_item.parent ){
			light_root_menu(item);
		}
		// подсветка подменю Ленты 
		else if( d_item.parent == 'feed' ){
			light_feed_menu(item);
		}
		else { 
			console.log("error: not implement action for menu:" + d_item.parent );
		}
	}
	}

	function menu_light_off(item){

		var d_item = menu[item];

		// подсветка главного меню	
		if( !d_item.parent ){
			light_root_menu_off(item);
		}
		// подсветка подменю Ленты 
		else if( d_item.parent == 'feed' ){
			light_feed_menu_off(item);
		}
		else { 
			console.log("error: not implement action for menu:" + d_item.parent );
		}
	}

	function light_root_menu(item){
		var d_item = menu[item];
		
		if( !d_item.light || d_item.lighted || d_item.actived ) return; 

		var node = $(".menu a[href=#"+item+"]").parents('li:first');
		    node.addClass('menu-lights');

		d_item.lighted = true;
	}

	function light_root_menu_off(item){
		var d_item = menu[item];
		
		if( !d_item.lighted || !d_item.light ) return; 

		var node = $(".menu a[href=#"+item+"]").parents('li:first');
		    node.removeClass('menu-lights');

		d_item.lighted = false;
	}

	function light_feed_menu(item){
		var d_item = menu[item];

		if( !d_item.light || d_item.lighted || d_item.actived ) return; 

		var name = item.split('.').pop();
		var node = $("#feed ul.tabs li[name='"+name+"']");
		node.addClass('feed-lights');
		d_item.lighted = true;
		menu_light(d_item.parent);
	}

	function light_feed_menu_off(item){
		var d_item = menu[item];

		if( !d_item.lighted ) return; 

		var name = item.split('.').pop();
		var node = $("#feed ul.tabs li[name='"+name+"']");
		node.removeClass('feed-lights');
		d_item.lighted = false;
		//menu_light_off(d_item.parent);
	}
	
	function status_light_set(name){
		var d_item = menu[name];
		if (d_item) {
			if ( d_item.light ) return;
			d_item.light = true;
			if( d_item.parent ){
				status_light_set(d_item.parent);
			}
		}
	}

	function root_menu_nodes(){
		var items = $(".menu > ul > li > a[href^=#]");
		for( var i = 0; i < items.length; i++ ){
			items[i] = $(items[i]).parents('li:first');
		}
		return items;
	}

	function feed_menu_nodes(){
		return $("#feed ul.tabs > li > a");
	}

	function get_tab_name(){
		return location.search.replace(/.+tab=(\w+).*/, "$1");
	}
});
