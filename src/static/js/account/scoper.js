var _scope;
(function(){
	
	_scope = new scope_generator;
	
	function scope_generator(){

		var scopes_funcs = {};
		var is_loaded_funcs = {};
		var _this = this;
		var childs_all = {};

		this._childs = {};
		this.add = function(name, func){
			scopes_funcs[name] = func;
			_this.restore(name);
		}
		
		this.page_load_first = function(scope_name){

			return (function(scope_name){
				return function() {
					var packages = scope_name.split('.');
					_scope.page_load(scope_name);
					var scope_this = _get_scope(packages);
					scope_this.init_section_wrapper();
				};
			})(scope_name);
		}
		
		this.del = function(name){
			var packages = name.split('.');
			var name_short = packages.pop();
			var scope_parent = _get_scope(packages);
			
			if( typeof scope_parent[name_short].__destroy != 'undefined' ){
				scope_parent[name_short].__destroy();
			}
			delete scope_parent[name_short];
			
			var parent_childs_filtered = [];

			delete scope_parent._childs[name_short]
		}
		
		this.page_load = function(name){
			if( ! _scope[name] ){
				_this.restore(name);
				_this.restore_childs(name);
			}
		}

		this.restore = function(name){
			var func = scopes_funcs[name];
			var packages = name.split('.');

			var child_name = packages.pop();
			var scope_parent = packages.length ? _get_scope(packages) : _scope;
			
			var scope_child;

			if( scope_parent ){
				if( !scope_parent[child_name] ){
					scope_child = _init_child(child_name, name, func);
				}
				else {
					console.log("error: scope '"+name+"' already exists");
				}
			}
			else {
				console.log("error: not created parents");
			}
			
			if( scope_child ){
				scope_parent[child_name] = scope_child; 
				scope_parent._childs[child_name] = scope_child;
				if( scope_parent.shortname ){
					if( !childs_all[scope_parent.shortname] ){
						childs_all[scope_parent.shortname] = {};
					}
					
					childs_all[scope_parent.shortname][scope_child.shortname] = true;
				}
			}
		}

		this.restore_childs = function(name){
			for( child_name in childs_all[name] ){
				_this.restore(name+'.'+child_name);
			}
		}

		function _init_child(name, name_full, func){
			var scope_child = new func();
			scope_child.shortname = name;
			scope_child.fullname  = name_full;
			scope_child.page_load_first = _this.page_load_first(name_full);
			scope_child._childs = {};

			if( ! is_loaded_funcs[name_full] && typeof scope_child.init_first != 'undefined' ){
				scope_child.init_first();
				is_loaded_funcs[name] = true;
			}

			if( scope_child.init_section ){
				scope_child.init_section_wrapper = function(){
					this.init_section();
					this.init_childs();
				}
			}
			
			scope_child.init_childs = function(){

				for( var i in this._childs ){
					var child = this._childs[i];
					child.init_section_wrapper();
				}
			}

			return scope_child;
		}
	}
	
	function _get_scope(scope_names){
		var _scope_x = _scope;
		
		for( var i = 0; i < scope_names.length; i++ ){
			var name = scope_names[i];
			if( !_scope_x[name] ){
				_scope_x = null;
				break;
			}
			
			_scope_x = _scope_x[name];
		}
		
		return _scope_x;
	}
	
})();
