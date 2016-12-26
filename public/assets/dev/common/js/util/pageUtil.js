define(function(require, exports,module){
	var initHeight = 0;
	var maxHeight = 0;
	var initContentHeight=0;
	ty.setPageHeight = function(id){
		var height = $("#sidebar").height();
		var contentHeight=$(".tyc-main-content ").height();
		var divHeight=$("#"+id).height()+85;
		if(initHeight==0){
			initHeight=height;	
			initContentHeight=contentHeight;
		}
		maxHeight=maxHeight<divHeight?divHeight:maxHeight;
		if(maxHeight<initHeight){
			maxHeight=initHeight;
		}
		$("#sidebar").height(maxHeight+45+50+40);
		$(".tyc-main-content ").height(maxHeight+45);
	}
	
	ty.setInitHeight = function(initHeight){
		$("#sidebar").height(initHeight);
		$(".tyc-main-content ").height(initContentHeight);
	}
	
	ty.existTableResize=function(tableId,divClass,backid,initHeight){
		if(tableId){
			var count=0;
			var divs=$("div."+divClass);
			for(var i=0;i<divs.length;i++){
				if(!$(divs[i]).is(":visible")){
					count++;
				}
			}
			
			if(divs.length==count){
				$("#calcTableDiv").css({ "marginTop":10});
			}else{
				var tabHeight=0;
				if(initHeight){
					tabHeight=initHeight+$("#"+tableId).height();
				}else{
					tabHeight=$("#"+backid).height()+50; 
				} 
				$("#calcTableDiv").css({ "marginTop":tabHeight});
			}
		}
	}
	
	
});