'use strict';

_mod.account.tabs.create('zenomania', function (_this){
	
	var ITEMS;
	var window_address;		

	_this.frame = null;
		
	_this.first_init = function(){
		$(function(){
			if( !window_address ) init_window_address();
			_this.frame = _mod.account.frame.find(".game:first");
			_this.frame.find('a.aixconfirm').on('click', aixconfirm_click);

			if ($('#dialog-purchase-ok').length) {
				$('#dialog-purchase-ok').on('click', function(event) {
					var optionChecked = $(event.target).parents('#dialog-purchase').find('input[type="radio"]:checked');
					if (optionChecked) { 
						confirm_address(optionChecked.val());
					}
				});
			}
			
			if ($('#dialog-purchase-cancel').length) {
				$('#dialog-purchase-cancel').on('click', function() {
					var dialogDiv = $('#dialog-purchase-cancel').parents('#dialog-purchase');
					dialogDiv.find('#dialog-purchase-text').empty();
					window_address_hide();
				});
			}
			
			if ($('.d-modal .dialog-close').length) {
				$('.d-modal .dialog-close').on('click', function() {
					_mod.account.hideModal();
				});
			}
		});
	}
	
	function aixconfirm_click(event){
		
		if( !ITEMS ){
			ITEMS = _mod.account.ITEMS;
		}
		
		event.preventDefault();
		var taugd = $(event.target);
		var parentaugd = taugd.parents('div.games');
		if (!parentaugd.hasClass('disabled')) {
			var item_id    = parentaugd.attr('data-itemid');
			if (item_id) {
				var item_price = ITEMS[item_id].price;				
				if( _mod.account.ITEMS[item_id] && _mod.account.ITEMS[item_id].ship_to_status ) {
					window_address.node_ship_to.css('display', 'block');
				}
				else {
					window_address.node_ship_to.css('display', 'none');
				}

				if (ITEMS[item_id]) {
					if (ITEMS[item_id].children) {
						var dialogDiv    = $('#dialog-purchase');
						var containerDiv = dialogDiv.find('.dialog-purchase-text');
						containerDiv.empty();
						for(var i=0; i < ITEMS[item_id].children.length; i++) {
							var itemDOMId = 'item_'+ITEMS[item_id].children[i].id;
							var cb_label = $($.parseHTML("<p><input type='radio' /><label></label></p>"));
							cb_label.find('label').attr({"for":itemDOMId});
							cb_label.find('input[type="radio"]').attr({
								"id": itemDOMId,
								"value": ITEMS[item_id].children[i].id,
								"name": item_id,
							});
							
							cb_label.find('label').attr({"for":itemDOMId});
							cb_label.find('label').html(
								ITEMS[item_id].children[i].price + '&nbsp;ZEN&nbsp;' + 
								ITEMS[item_id].children[i].name
							);
							containerDiv.append(cb_label);
						}
						if (ITEMS[item_id].display_text) {
							containerDiv.append($.parseHTML("<p>"+ITEMS[item_id].display_text+"</p>"));
						}
						containerDiv.find('input[type="radio"]').first().prop("checked", true);
						_mod.account.showModal(null, 'dialog-purchase');
	
					}
					else {
						if (0 < item_price) {
							var item_name  = ITEMS[item_id].name;
							var confirm_text = MESSAGES.CONFIRM_DIALOG[item_id] ? MESSAGES.CONFIRM_DIALOG[item_id](item_price, item_name) :
								MESSAGES.CONFIRM_DIALOG.default(item_price, item_name);
		
							var dialogDiv    = $('#dialog-purchase');
							var containerDiv = dialogDiv.find('.dialog-purchase-text');
							containerDiv.empty();
							
							var itemDOMId = 'item_'+item_id;
							var cb_label = $($.parseHTML("<p><input type='radio' /><label></label></p>"));
							cb_label.find('label').attr({"for":itemDOMId});
							cb_label.find('input[type="radio"]').attr({
								"id": itemDOMId,
								"value": item_id,
								"name": item_id,
							}).css({'display':'none'});
							
							cb_label.find('label').attr({"for":itemDOMId});
							cb_label.find('label').html(confirm_text);
							containerDiv.append(cb_label);
							if (ITEMS[item_id].display_text) {
								if ('' === ITEMS[item_id].ship_to_status) {
									containerDiv.append($.parseHTML("<p>"+ITEMS[item_id].display_text+"</p>"));
								} else {
									dialogDiv.find('#p-no-delivery').html($.parseHTML(ITEMS[item_id].display_text));
								}
							}
							if (ITEMS[item_id].delivery_text) {
								dialogDiv.find('#p-delivery').html($.parseHTML(ITEMS[item_id].delivery_text));
							}
							containerDiv.find('input[type="radio"]').first().prop("checked", true);
							dialogDiv.find('input[name="get_type"]').first().prop("checked", true);
		
							_mod.account.showModal(null, 'dialog-purchase');
						} else {
							var dialogDiv    = $('#dialog-prize-nozen');
							var containerDiv = dialogDiv.find('.dialog-purchase-text');
							containerDiv.empty();
							if (ITEMS[item_id].display_text) {
								containerDiv.append($.parseHTML("<p>"+ITEMS[item_id].display_text+"</p>"));
							}
							_mod.account.showModal(null, 'dialog-prize-nozen');
						}
					}
				}
			}
		}
	}

	function doPurchase(item_id, get_type, address) {
		if (item_id) {
			_mod.account.showModal(null, 'dialog-inprogress');
			$.ajax({
				type: "POST", 
				url: "/account/item_buy/"+item_id,
				data: {
					get_type: get_type,
					address: address
				},
				error: function(){ doPurchase_response({ status: 'error' }) },
				success: doPurchase_response
			});
		} else {
			console.log('!no item is selected');
		}
	}
	
	function doPurchase_response(res){
		
		if ('error' == res.status){
			alert(MESSAGES.ERROR[res.errcode] || MESSAGES.ERROR.unknown);
		} else {
			// goto feed.prizes
			window.location.replace('/account/?tab=prizes');
			// TODO: make it a state, answer should return new prize list item,
			// insert this item and show Prizes tab
			//History.pushState({hash: 'prizes'}, 'Мои призы', '/account/?tab=prizes');
		}
		
		window_address_hide();
	}
	
	function init_window_address(){
		var node = $("#dialog-purchase");
		var node_get_type = node.find('input[name=get_type]');
		var node_address = node.find('div[name=address]:first');
		var node_address_text = node_address.find('textarea[name=address]:first');
		var node_ship_to = node.find('div[name=ship_to]:first');

		window_address = {
			node: node,
			node_address: node_address,
			node_get_type: node_get_type,
			node_address_text: node_address_text,
			node_ship_to: node_ship_to,
			item_id: null
		};
		
		node_get_type.bind('change', function() {
			var val = $(this).val();
			
			if( val == 'delivery' ) {
				node_address_text.val(_mod.account.ext_data.address);
				node_address.show();
			}
			else {
				node_address.hide();
			}
		});
	}
	
	function window_address_hide(){
		_mod.account.hideModal();
	}
	
	function do_address_type(){
		var item_id = window_address.item_id;

		if( _mod.account.ITEMS[item_id] && _mod.account.ITEMS[item_id].ship_to_status ){
			var get_type = window_address.node_get_type.filter(':checked').val();
			if( get_type ){
				if( get_type == 'delivery' ){
					var address = window_address.node_address_text.val(); 

					if( !address ){
						alert("Не указан адрес доставки");
					}
					else {
						_mod.account.ext_data.address = address;
						doPurchase(item_id, get_type, address);
					}
				} else if (get_type == 'self') {
					doPurchase(item_id, get_type, '');
				}
			}
			else {
				alert("Не выбран способ доставки");
			}
		}
		else {
			doPurchase(item_id, get_type, '');
		}
	}
	
	function confirm_address(item_id){
		window_address.item_id = item_id;
		do_address_type();
	}
});

