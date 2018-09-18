'use strict';

var _mod;
(function(){
	
	_mod = new mod('main');
	_mod.Version = '0.1'; 
	
	var modes = {};
	
	function mod(name){
		this._childs = {};
		this._name = name;

		this.create = function(name, content_func){

			var  mod_child  = 
				this[name]  = 
				this._childs[name] = new mod(this, content_func);
			
			content_func(mod_child);
			
			if( typeof mod_child.first_init !== 'undefined' ){
				mod_child.first_init();
			}
		}
	}
})();

