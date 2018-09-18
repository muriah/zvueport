'use strict';

_mod.create('account', function(_this){
	var SN = {};

	_this.ITEMS = {};
	_this.frame = null;
	_this.youtube_zenit_linked = null;
	_this.events_info = null;
	_this.progress_balls = null;
	_this.person_id = null;
	_this.rc = null;
	_this.ext_data = null;

	_this.first_init = function(){

		window.HACKZ = {
			'REDRAWVK': _this.redrawVK,
			'REDRAWFB': _this.redrawFB,
			'REDRAWTW': _this.redrawTW,
			'REDRAWIG': _this.redrawIG
		};


		$(function(){
			if (_scope.events) {
				_scope.events.set_url_user_events("/account/person_events/"+ _this.person_id +"/");
			}

			_this.frame = $("body");

			readycheck();

			$('#change-password form').on('submit', _mod.account.changePwd);

			$('#saving-shade').on('click', function() {
				if ($('#change-password').is(':visible')) {
				} else {
					_mod.account.hideModal();
					// FIXME: state for modal dialogs and History back on close
					if (History.getState().data.hash == 'profile-edit') {
						History.pushState({hash: 'profile'}, "State profile", '/account/?tab=profile');
					}
				}
			});

			if (_this.tabs) {
				_this.tabs.profile.init_form();
				_this.tabs.select_tab();
			}

			// интеграция history.js
			$(".ul-tab-headers > li > a, .stateful").bind('click', function(event) {
				if ($(this).hasClass('a-forward')) {
					return true;
				} else {
					event.preventDefault();

					var hash 	= $(this).attr('href').split('#')[1];
					var title 	= "State " + hash;
					var url 	= "/account/?tab=" + hash;

					History.pushState({hash: hash}, title, url);

					return true;
				}
			});

			if (History.Adapter) {
				History.Adapter.bind(window,'statechange',function(){

					if( _scope.ticket.window_is_active ){
						_scope.ticket.window_hide();
					}

					if( _scope.subscription.window_is_active ){
						_scope.subscription.window_hide();
					}

					if( _scope.fancard.window_is_active ){
						_scope.fancard.window_hide();
					}

					if( _scope.avatar.window_is_active ){
						_scope.avatar.window_hide();
					}

					var state = History.getState();
					if ( !state.data.hash ){
						state.data.hash = 'zenomania';
					}

					_this.tabs.select_tab("#" + state.data.hash);

				});
			}


			_init_enter_handler($("#ffan"));

			if (_scope.menu_lights) {
				_scope.menu_lights.scope_init(_this.events_info);
			}
			if (_scope.awards) {
				_scope.awards.scope_init(_this.progress_balls);
			}

			if( _this.youtube_zenit_linked ){
				$("#d-link-GO").addClass('soc-active');
			}
		});
	}

 	_this.showModal = function(msg, el_id) {
 		if (el_id) {
 			$('.d-modal').hide();
 			$('#'+el_id).show();
 			$('#saving-shade').show();
 		} else {
 			$('#saving-modal').text(msg);
 			$('#saving-modal').show();
 			$('#saving-shade').show();
 		}
 	}

 	_this.hideModal = function(errcode){
 		if (errcode) {
 			$('#saving-modal')
 				.removeClass('noerr_info').addClass('err500_info')
 				.text('Ошибка сервера. Пожалуйста, попробуйте позже.');
 		}
 		$('#saving-modal').fadeOut(2500,function() {
 			$('#saving-modal').removeClass('err500_info').addClass('noerr_info');
 		});
 		$('#saving-shade').hide();
 		$('.d-modal').hide();
 	}

	_this.invalid = function(inputData){
		$('input[type=text]').removeClass('missing invalid busy');
		if (inputData['_ERROR']) {
			if (inputData['_MISSING']) {
				for(var i=0;i<inputData['_MISSING'].length;i++) {
					var iname = inputData['_MISSING'][i];
					$('input[name="'+iname+'"]').addClass('missing');
				}
			}
			if (inputData['_INVALID']) {
				for(var i=0;i<inputData['_INVALID'].length;i++) {
					var iname = inputData['_INVALID'][i];
					$('input[name="'+iname+'"]').addClass('invalid');
				}
			}
			if (inputData['_BUSY']) {
				for(var i=0;i<inputData['_BUSY'].length;i++) {
					var iname = inputData['_BUSY'][i];
					$('input[name="'+iname+'"]').addClass('busy');
				}

			}
		}
	}

	_this.isValid = function(ftype, fvalue) {
		var rexs = {
			email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/,
			fname: /^[A-ZА-Я0-9._%+-]{2,100}$/,
			lname: /^[A-ZА-Я0-9._%+-]{2,100}$/,
			mobile: /^7[0-9]{10}$/,
			password: /^[0-9a-z~`!@#$%^&*()_+=-\\\/|{}\[\],.:;"']{5,20}$/
		};

		var re = rexs[ftype];
		if (re) {
			return re.test(fvalue);
		} else {
			return false;
		}
	}

	_this.changePwd = function() {
		var ERROR = {
			"ok": "Пароль успешно изменён.",
			"no_fill": "Пароль не указан.",
			"password_invalid": "Пароль должен содержать латинские буквы и цифры.",
			"password_small": "Пароль должен содержать не менее 5ти символов.",
			"password_big": "Пароль должен содержать не более 20ти символов.",
			"error": "Ошибка запроса к серверу."
		}
		if ($('#i-new-password1').length && $('#i-new-password1').val()) {
			var newPwd = $('#i-new-password1').val();
			_send_new_password(newPwd, {
				ok: function(res){
					$('#d-modal-info p[name='+ res.status +']').show();
					$('#d-modal-info').show();
					$('#saving-shade').fadeOut(1000);
					$('#change-password').fadeOut(1000);

					$('#d-modal-info').fadeOut(1000, function(){
						$('#d-modal-info p[name='+ res.status +']').hide(1);
					});
					if ($.arcticmodal) { $.arcticmodal('close') };
					return false;
				},
				error: function(res) {
					alert(ERROR[res.status]);
					$('#d-modal-info p[name='+ res.status +']').show();
					$('#d-modal-info').show();
					$('#d-modal-info').fadeOut(2000, function(){
						$('#d-modal-info p[name='+ res.status +']').hide(1);
					});
					return false;
				}
			});
		} else {
			$('#d-modal-info p[name=no_fill]').show();
			$('#d-modal-info').show();
			$('#d-modal-info').fadeOut(1000, function(){
				$('#d-modal-info p[name=no_fill]').hide(1);
			});
		}
		return false;
	}

	_this.showWarning = function(id) {
		$( '#'+id ).fadeIn( 400, function() {
			$( '#'+id ).delay(1000).fadeOut( 400 );
		});
	}

	_this.unlinkSNetwork = function(ul_href, ul_data, ul_divID) {
		$.ajax({
			url: ul_href,
			data: ul_data,
		}).done(function() {
			$('#' + ul_divID).removeClass('linked');
		}).error(function(answer) {
			console.log(answer);
		});
	}

	_this.redrawVK = function(vk_user) {
		_redraw(vk_user, 'd-link-VK', 'a-unlink-VK');
	}

	_this.redrawFB = function(fb_user) {
		_redraw(fb_user, 'd-link-FB', 'a-unlink-FB');
	}

	_this.redrawTW = function(tw_user) {
		_redraw(tw_user, 'd-link-TW', 'a-unlink-TW');
	}

	_this.redrawIG = function(ig_user) {
		_redraw(ig_user, 'd-link-IG', 'a-unlink-IG');
	}

	function _redraw (sn_user, divID, unlinkID) {
		if (sn_user.outer_id) {
			var cdiv = $('#'+divID);
			cdiv.addClass('linked');
		} else {
			if (sn_user.error) {
				if ('taken' == sn_user.error) {
					alert("Этот аккаунт уже занят. Если он занят не вами, пожалуйста, свяжитесь с техподдержкой.");
				}
			}
		}
	}

	function _init_enter_handler(form){

		var form_inputs = form.find(':input');

		var i = 0;
		form_inputs.each(function(){
			i++;
			var input_type = $(this).attr('type');
			if ( !input_type ){ input_type = 'text' }

			if( input_type == 'radio' ){ }
			else if( input_type == 'checkbox' ){ }

			$(this).attr('data-index', i);
		});

		form.on('keydown', 'input', function (event){
			if( event.which == 13 ){
				event.preventDefault();
				var $this = $(event.target);
				var index = parseFloat($this.attr('data-index'));
				$('[data-index="' + (index + 1).toString() + '"]').focus();
			}
		});
	}

	function readycheck(){
		var rc = _this.rc;
		if (rc) {
			if (rc.person) {
				if (1 == rc.person['should_change_pwd']) {
					_mod.account.showModal(null, 'change-password');
				} else {
					_mod.account.hideModal();
				}
			}

			if (rc.sn) {
				SN = rc.sn;
				SN.functions = {
					linkSNetwork: function(network) {
						// [% nets = ['vkontakte','twitter','facebook','instagram'] %]
						if ('vkontakte' == network) {
	var vk_auth_url = 'https://oauth.vk.com/authorize?client_id='+SN.VK_APP_ID+'&scope=wall&redirect_uri='+SN.VK_CALLBACK+'&response_type=code&v=5.8';
	var params = "width=700,height=350,left=300,top=100,menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes";
	var newWin = window.open(vk_auth_url, "VK_auth", params);
	newWin.focus();
						}
						if ('facebook' == network) {
						FB.login(function(answer) {
							//"{"authResponse":{"accessToken":"","userID":"134606516906380","expiresIn":6097,"signedRequest":""},"status":"connected"}"
							if ("connected" === answer.status) {
								$.ajax({
									type: 'POST',
									url: '/account/fb',
									data: {'p':JSON.stringify(answer)}
								})
								.done( function(r) {
									_redraw(r, 'd-link-FB', 'a-unlink-FB');
								})
								.fail( function(r) {
									console.log(r);
								});
							} else {
								console.log(answer);
							}
						}, { scope: 'public_profile,user_posts' });
	//var vk_auth_url = 'https://www.facebook.com/dialog/oauth?client_id='+SN.FB_APP_ID+'&redirect_uri='+SN.FB_CALLBACK+'&scope=user_posts';
	//var params = "width=1000,height=700,left=300,top=100,menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes";
	//var newWin = window.open(vk_auth_url, "Authenticate with Facebook", params);
	//newWin.focus();
						}
						if ('twitter' == network) {
	var params = "width=700,height=350,left=300,top=100,menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes";
	var newWin = window.open(SN.TW_CALLBACK, "Authenticate with Twitter", params);
	newWin.focus();
						}
						if ('instagram' == network) {
	var params = "width=700,height=350,left=300,top=100,menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes";
	var newWin = window.open(SN.IG_CALLBACK, "Authenticate with Instagram", params);
	newWin.focus();
						}
						if ('google' == network) {
	var go_auth_url = 'https://accounts.google.com/o/oauth2/auth?client_id='+SN.GO_CLIENT_ID+'&redirect_uri='+SN.GO_CALLBACK
		+'&scope=https://www.googleapis.com/auth/youtube'
		+'&response_type=code'
		+'&access_type=online';
	var params = "width=1000,height=700,left=300,top=100,menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes";
	var newWin = window.open(go_auth_url, "Authenticate with Youtube", params);
	newWin.focus();
						}
						return false;
					}
				};

				var urlUnlink = "/account/unlink";
				var urlLink   = "/account/link";
				var SNNames_RU = {
					'vk': 'ВКонтакте',
					'vkontakte': 'ВКонтакте',
					'facebook': 'Facebook',
					'twitter': 'Twitter',
					'instagram': 'Instagram',
				};
				$('.D-SN-link').on('click', 'a', function(e) {
					e.preventDefault();
					var link = $(this);
					var parentDiv = link.parent('.D-SN-link');
					if (link.data('action')) {
						if ('unlink' == link.data('action')) {
							if (confirm('Отключить аккаунт ' + SNNames_RU[parentDiv.data('network')] + '?')) {
								_this.unlinkSNetwork(urlUnlink, {n: parentDiv.data('network')}, parentDiv.attr('id'));
							}
						}
						if ('link' == link.data('action')) {
							SN.functions.linkSNetwork(parentDiv.data('network'));
						}
					}
				});

				if ($('#a-update-fb-token').length) {
					$('#a-update-fb-token').on('click', function() {
						var auth_url = 'https://www.facebook.com/dialog/oauth?client_id='+SN.FB_APP_ID+'&redirect_uri='+SN.FB_CALLBACK_G+'&scope=read_stream';
						var params = "width=700,height=350,left=300,top=100,menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes";
						var newWin = window.open(auth_url, "Авторизация в Facebook", params);
						newWin.focus();
					});
				}

				if ($('#a-update-tw-token').length) {
					$('#a-update-tw-token').on('click', function() {
						var params = "width=700,height=350,left=300,top=100,menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes";
						var newWin = window.open(SN.TW_CALLBACK_G, "Authenticate with Twitter", params);
						newWin.focus();
					});
				}

				if ($('#a-update-vk-token').length) {
					$('#a-update-vk-token').on('click', function() {
						var vk_auth_url = 'https://oauth.vk.com/authorize?client_id='+SN.VK_APP_ID+'&scope=wall&redirect_uri='+SN.VK_CALLBACK_G+'&response_type=code';
						var params = "width=700,height=350,left=300,top=100,menubar=no,location=yes,resizable=yes,scrollbars=no,status=yes";
						var newWin = window.open(vk_auth_url, "VK_auth", params);
						newWin.focus();
					});
				}
			}

			if (rc.items) {
				_this.ITEMS = rc.items;
			}
		}
	}

	function _send_new_password(newPwd, callback){

		$.ajax({
			type: "POST",
			url: "/account/changePassword",
			async: false,
			dataType: 'json',
			data: { "newpassword": newPwd },
			error: function(){ _result({ status: 'error' }) },
			success: _result
		});

		function _result(res){

			if( res.status == 'ok' ){
				callback.ok(res);
			}
			else {
				if( typeof callback[res.status] == 'undefined' ){
					if( typeof callback.error == 'undefined' ){
						console.log('change password error: ' + res.status);
					}
					else {
						callback.error(res);
					}
				}
				else {
					callback[res.status](res);
				}
			}
		}
	}
});
