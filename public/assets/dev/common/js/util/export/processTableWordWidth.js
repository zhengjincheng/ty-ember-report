define(function(require, exports,module){
	ty.processTableWordWidth=function($table){
		var data = $table.data('data');
		var $tdDivLast = $table.find('.td01:last');
		var div_width = $tdDivLast.width();
		$table.find('.td01').each(function(index){
			var _this =this;
			if(index==0){
				//处理title
			}else{
				if(data.ready){
					processWordWidth(index-1,_this,div_width);//index-1为数据的下标
				}else{
					(function(){
						var f;
						f = setInterval(function(){
							processWordWidth(index-1,_this,div_width);
							clearInterval(f);
						},200);
					})();
				}
			}
		});
		
		
		
		
		data.ready = true;
		
		function processWordWidth(index,div,div_width){
			
			
			var $div = $(div);
			var $dom = data[index].$dom;
			if($dom){
				$div.html($dom.clone());
				//$div.find('span:last-child').scrollLeft(1000);
			}else{
				var $span = $(div).find('span:last');
				var	span_width = $span.width();
				var textSpan_width = (div_width/2-8);
				
				if(div_width>span_width){
					$div.html("<span>"+$span.html()+"</span>");
				}else{
					var innerHtml = '<span class="text" style="overflow: hidden; white-space: nowrap; width: '+textSpan_width+'px; float: left;"><span style="float: left;">'+$span.html()+'</span></span>'+
					'<span style="display:block;float:left">...</span>'+
					'<span class="text" style="overflow: hidden; white-space: nowrap; width: '+textSpan_width+'px; float: left; margin-left: 0px;"><span style="float: right;">'+$span.html()+'</span></span>';
					$div.html(innerHtml);
				}
				data[index].$dom = $div.children().clone();
			}
			
			
			
		}
	}
	return $;
});
