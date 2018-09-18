'use strict';

_mod.create('account_id', function(_this){ 
	
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
 	
});



