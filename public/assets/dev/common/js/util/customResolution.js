define(function(require, exports,module){
	ty.customResolution=function(array){
		//目前最高适配到1920的分辨率
		var width=document.body.clientWidth;
		if(width>=1920){
			$(array[0].id).css("width",array[0].width+"px");
		}else if(width>=1600){
			$(array[1].id).css("width",array[1].width+"px");
		}else if(width>=1440){//1440分辨率 才用最大宽度
			$(array[2].id).css("width",array[2].width+"px");
		}else if(width>=1360){//1360分辨率 才用最较大宽度
			$(array[3].id).css("width",array[3].width+"px");
		}else if(width>=1280){//1280分辨率 才用普通宽度
			$(array[4].id).css("width",array[4].width+"px");
		}else{//1280以下分辨率 如1024 用最小宽度
			$(array[5].id).css("width",array[5].width+"px");
		}
	};
	return $;
});
