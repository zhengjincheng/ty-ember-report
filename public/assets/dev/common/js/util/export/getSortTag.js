define(function(require, exports,module){
	ty.getSortTag=function($table){
		var sortTag = 0;
		var desc;
		$table.find('th[sortable] span').each(function(i){
			var $span =$(this);
			if($span.attr('selected')){
				desc = $span.attr('isDesc');	
				sortTag = i+1;
			}
		});
		sortTag = sortTag + (desc==1?(1):(0))*(1<<5);
		return sortTag;
	}
	return $;
});
