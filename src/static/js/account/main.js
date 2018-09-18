// JavaScript Document

jQuery(function($){

	$('input[placeholder], textarea[placeholder]').placeholder();

	//$("SELECT").selectBox();

	$(".scrollbar").scroller({
		customClass: "advanced",
		handleSize: 58
	});

	$('.jcarousel-skin-tango').show();
	$('.prof-rating-btn').click(function(){
 		if($(this).is('.open-active')){
			$(this).removeClass('open-active');
  			$('.prod-rating').find('.jcarousel-skin-tango').slideUp(200);
 		}else{
			$(this).addClass('open-active');
  			$('.prod-rating').find('.jcarousel-skin-tango').slideDown(200);
 		}
 	});


	/* PIE */
	if (window.PIE) {
		$('.btn, .aside-top-profile img, .profile-img img, .soc-bl li img, .feed-menu ul, .feed-menu li a, .feed-rating-points, .pagination li a, .feed-prize a, .price-bonus').each(function() {
		PIE.attach(this);
		});
	}
	
});//end ready




