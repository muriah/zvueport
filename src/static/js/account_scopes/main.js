_scope.add('main', function (){
	
	var elements_data_points;
	var _this = this;
	
	this.update_points = function(points){
		if( !elements_data_points ) elements_data_points = $("*[data-name=person_points]");
		elements_data_points.text(points);
		_scope.events.show_user_events();	// TODO: вызывать только когда вкладка ленты открыта
		//_this.menu_lights(['feed', 'f_events']);
	}
});
