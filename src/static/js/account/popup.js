export function onPopupClick (e) {
	e.preventDefault();
	$('.join-popup').hide();
	var popupId = $(e.target).data('for');
	$('.join-popup[data-id="'+popupId+'"]').css({"z-index":"999"});
	$('.join-popup[data-id="'+popupId+'"]').fadeIn(300);
};

export function onExitClick (e) {
	e.preventDefault();
	$('.join-popup').css({"z-index":"0"});
	$('.join-popup').fadeOut(1000);
};
