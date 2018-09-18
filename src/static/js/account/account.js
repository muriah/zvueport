
var _scope = (function(){

	var scope = function(){
		this.add = function(name, func){
			this[name] = new func();
		}
	};
	return new scope();
})();

