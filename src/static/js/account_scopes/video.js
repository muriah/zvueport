//-- видео
// require video.js
_scope.add('video', function (){
	var window_video = $("#modal-display-video");
	var myPlayer = videojs('example_video_1');
	var current_is_youtube;

	function window_wideo_show(video){
		
		if ( video.is_youtube && video.ytid != 0 ){
			current_is_youtube = true;
			window_video.find('div[name=html5]').css('display', 'none');
			$("<iframe/>", {
				name: 'a',
				src:   "//www.youtube.com/embed/"+video.ytid+"?autoplay=1&amp;autohide=1&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1", 
				style: "width: 800px; height: 400px; border: 0;"
			}).appendTo(window_video);
		}
		else {
			current_is_youtube = false;
			window_video.find('div[name=html5]').css('display', 'block');
			myPlayer.src(video.file);
		}
		
		document.getElementById('saving-shade').style.display = 'block';
		window_video.css('display', 'block');
	}
	
	function window_video_hide(){
		if ( current_is_youtube ){
			window_video.find('iframe[name=a]').remove();
		}
		else {
			myPlayer.pause();
		}
		document.getElementById('saving-shade').style.display = 'none';
		window_video.css('display', 'none');
	}
	
	$("div[name=videos] div[name=video]").bind('click', function(){
		var video = JSON.parse($(this).attr('data-video'));
		video.is_youtube = typeof video.is_youtube !== 'undefined' ? true : false;
		video.ytid       = typeof video.ytid !== 'undefined' ? video.ytid : 0;
		window_wideo_show(video);
	});
	
	window_video.find('>div[name=close]:first').bind('click', function(){
		window_video_hide();
	});
});
