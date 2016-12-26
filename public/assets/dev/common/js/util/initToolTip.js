define(function(require, exports,module){
	ty.initToolTip=function(array){
		$(".basedonTip").qtip({
		    position: {
		        my: 'top left',
		        at: 'bottom left'
		    }
		});
	};
	return $;
});
