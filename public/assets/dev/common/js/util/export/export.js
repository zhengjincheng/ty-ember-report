/***************报表导出公用的JS*************/
define(function(require, exports,module){
	require("./css/export.css");
	require("./sortGrid.js");
	require("./getSortTag.js");
	require("./processNULL.js");
	require("./processTableWordWidth.js");
window.ExcelTableClass = ".excel",window.WattingBoxClass=".waittingBox";
window.ORDER_FIELD = ["durationAvg","durationMax","throughout","errorRate","apdex","actionId"];
window.timeDisplayTag = 31;//全部项
ty.clickSort=function(_this,feildName){
	var $th = $(_this);
	var $table = $th.closest(ExcelTableClass);
	var data = $table.data('data');
	$table.find('th[sortable] span').removeAttr('selected');
	$(_this).attr('selected','selected');
	$table.find('th[sortable] span').filter('[selected!=selected]').attr('isDesc',1).removeClass('bottomArrow').addClass('topArrow');
	
	if($(_this).attr('isDesc') == 0){
        
		$(_this).removeClass('bottomArrow').addClass('topArrow').attr('isDesc',1).attr('selected','selected');
	}else{
        
		$(_this).removeClass('topArrow').addClass('bottomArrow').attr('isDesc',0).attr('selected','selected');
	}
	
	var sortTag = ty.getSortTag($table);
	
	$table.find('.tr01').remove();
	ty.sortGrid(data,sortTag);
	appendGrid($table ,data);
}
	$(document.body).ready(function(){
		if(!$('#checkbox01').attr('checked')){
			window.timeDisplayTag = window.timeDisplayTag ^ (1<<0);
		}if(!$('#checkbox02').attr('checked')){
			window.timeDisplayTag = window.timeDisplayTag ^ (1<<1);
		}if(!$('#checkbox03').attr('checked')){
			window.timeDisplayTag = window.timeDisplayTag ^ (1<<2);
		}if(!$('#checkbox04').attr('checked')){
			window.timeDisplayTag = window.timeDisplayTag ^ (1<<3);
		}if(!$('#checkbox05').attr('checked')){
			window.timeDisplayTag = window.timeDisplayTag ^ (1<<4);
		}
	});
	
	ty.calculateTimeDisplayTag=function(position/** 位项*/){
			window.timeDisplayTag = window.timeDisplayTag^(1<<position);
			$(ExcelTableClass+' .tr01').remove();
			
			$(ExcelTableClass).each(function(){
				$table = $(this);
				var data = $table.data('data');
				appendGrid($table,data);
			});
			
	}
	$("#instanceSelect").ready(function(){
		$("#instanceSelect ul").hide();
		//$("#instanceSelect p").html($("#instanceName").val());
		var value_ = $("#instanceId").val();
		var selectLi_;
		
		$("#instanceSelect ul>li").each(function(){
			if(value_==$(this).attr('data')){
				$("#instanceSelect p").html($(this).html());
				$("#instanceSelect p").attr("title", $(this).html());
				selectLi_=this;
			}
		});
		
		$("#instanceSelect ul>li").click(function(){
			//alert("a");
			$("#instanceId").val($(this).attr('data'));
			$("#instanceSelect p").html($(this).html());
			$("#instanceSelect p").attr("title", $(this).html());
			$("#instanceSelect ul").hide();
			$("#instanceSelect").addClass("unselected");
			$("#instanceSelect").removeClass("selected");
			selectLi_=this;
			refreshAll();
		}).mouseover(function(){
			$(selectLi_).removeClass('selected');
		});
		
		$("#instanceSelect p").click(function(){
			$("#instanceSelect ul").show();
			$("#instanceSelect").addClass("selected").removeClass("unselected");
			$(selectLi_).addClass('selected');
		});
	});
	
	(function(){
		$(window).click(function(event){
			//console.log(event.target)
			if($("#instanceSelect").length<1){return;}
			if(!$("#instanceSelect")[0].contains(event.target)){
				$("#instanceSelect ul").hide();
				$("#instanceSelect").addClass("unselected");
				$("#instanceSelect").removeClass("selected");
			}
		});
	})();
	return $;
});	
	

	
	