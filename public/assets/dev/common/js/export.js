/***************报表导出公用的JS*************/

var ExcelTableClass = ".excel",WattingBoxClass=".waittingBox";
window.ORDER_FIELD = ["durationAvg","durationMax","throughout","errorRate","apdex","actionId"];

function processNULL(num,unit){
	if((num == undefined ) || (num == -1)){
		return '-';
	}
	if(unit == '%'){
		return (num*100+0.0000000001).toFixed(2)+unit;		
	}else if(unit=='ms'){
		return (num/1000.0+0.0000000001).toFixed(3)+'s'; 
	}else if(unit=='times'){
		return num;
	}else if((typeof num)=='number'){
		num=num+0.0000000001;
		return num.toFixed(2) + unit;
	}else{
		return num + unit;
	}
	
}	

function getSortTag($table){
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
	
	function sortGrid(data,sortInt){
		var sortFieldList = [];
		$.extend(true,sortFieldList,ORDER_FIELD);
		var desc = ((sortInt & 32)>0)?1:-1;
		var fieldIndex = (sortInt % 32)-1;
		var field = sortFieldList.splice(fieldIndex,1);
		sortFieldList.unshift(field);
		
		data.sort(function(a,b){
			var o1 = a.bean;
			var o2 = b.bean;
			
			for(var i=0;i<sortFieldList.length;i++){
				var field = sortFieldList[i];
				var n1 = 0,n2 =0;
				n1 = o1[field];
				n2 = o2[field];
				
				if(i==0){
					if(n1>n2){
						return -desc;
					}else if(n1<n2){
						return desc;
					}
				}else{
					if(n1>n2){
						return -1;
					}else if(n1<n2){
						return 1;
					}
				}
				
			}
			return 0;
		});
		
	}
	
	function clickSort(_this,feildName){
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
		
		var sortTag = getSortTag($table);
		
		$table.find('.tr01').remove();
		sortGrid(data,sortTag);
		appendGrid($table ,data);
	}
	
	window.timeDisplayTag = 31;//全部项
	
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
	
	function calculateTimeDisplayTag (position/** 位项*/){
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
				selectLi_=this;
			}
		});
		
		$("#instanceSelect ul>li").click(function(){
			//alert("a");
			$("#instanceId").val($(this).attr('data'));
			$("#instanceSelect p").html($(this).html());
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
	
	
function processTableWordWidth($table){
		
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
	
	