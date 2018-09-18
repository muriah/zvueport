'use strict';

_mod.account.tabs.create('profile', function (_this){
	
	_this.init_form = function(){
		
		if ($("#bsubmit").length == 1) {

			$("#ffan").on("submit", function() {
				_mod.account.invalid({});
				var required = ['email', 'fname', 'lname', 'mobile'];
				var form = $('#ffan');
				var inputs = form.find("input[type='text']");
				var validated = {'_ERROR':1,'_BUSY':[],'_MISSING':[],'_INVALID':[]};
				var ok = true;
				
				for (var i=0; i<required.length;i++) {
					var inp = form.find("input[name='"+required[i]+"']");
					if (inp.length) {
						var val = inp.val().trim();
						if (val == '') {
							validated._MISSING.push(required[i]);
							ok = false;
						} else if (!_mod.account.isValid(inp.attr('name'), val.toUpperCase())) {
							validated._INVALID.push(required[i]);
							ok = false;
						}
					}
				}
				if (!ok) {
					_mod.account.invalid(validated);
					return false;
				} else {
					
					_mod.account.showModal('Сохраняется...');
				
					var activity_checked = new Array();
					form.find("input[name='activity']:checked").each(function(i,v) {
						activity_checked.push(v.value);
					});
					var clubs_checked = new Array();
					form.find("input[name='favclub']:checked").each(function(i,v) {
						clubs_checked.push(v.value);
					});
					var sports_checked = new Array();
					form.find("input[name='favsport']:checked").each(function(i,v) {
						sports_checked.push(v.value);
					});
					var players_checked = new Array();
					form.find("select[name='favplayer'] option:selected").each(function(i,v) {
						players_checked.push(v.value);
					});
					
					var bdday   = form.find('input[name="bday-day"]').val();
					var bdmonth = form.find('select[name="bday-month"] option:selected').val();
					var bdyear  = form.find('input[name="bday-year"]').val();
					var bddate  = null;
					if (bdday > -1 && bdmonth > -1 && bdyear > -1) {
						bdday = bdday.length == 1 ? '0'+bdday : bdday;
						bdmonth = bdmonth.length == 1 ? '0'+bdmonth : bdmonth;
						bddate = bdyear + '-' + bdmonth + '-' + bdday;
					}
					
					$.ajax({
						type: "POST",
						url: "/account/save",
						data: { 
							'email':     form.find('input[name="email"]').val(),
							'mobile':    form.find('input[name="mobile"]').val(),
							'lname':     form.find('input[name="lname"]').val(),
							'fname':     form.find('input[name="fname"]').val(),
							'mname':     form.find('input[name="mname"]').val(),
							'sex':       form.find('input[name="sex"]:checked').val(),
							'bdate':     bddate,
							'address':   form.find('input[name="address"]').val(),
							'favclub':   clubs_checked,
							'favsport':  sports_checked,
							'favplayer': players_checked,
							'activity':  activity_checked,
							'filled':    1,
						}
					})
					.done(function( res ) {
						if (typeof res.data !== 'undefined' && typeof res.data.msg !== 'undefined' && typeof res.data.msg._ERROR !== 'undefined') {
							console.log(res.data);
							_mod.account.invalid(res.data.msg);
						} else {
							_mod.account.hideModal();
							if( res.data.points ){
								_scope.main.update_points(res.data.points);
							}
							_scope.menu_lights.set_events_info(res.data.events_info);
							History.pushState({hash: 'profile'}, "State profile", '/account/?tab=profile');
						}
					})
					.error(function( res ) {
						_mod.account.hideModal(500);
						if( typeof res.data !== 'undefined' && typeof res.data.msg !== 'undefined' ){
							_mod.account.invalid(res.data.msg);
						}
						History.pushState({hash: 'profile'}, "State profile", '/account/?tab=profile');
					});
					return false;				
					
				}
			});
		}
	};
});
