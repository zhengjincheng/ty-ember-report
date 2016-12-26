define(function(require, exports,modules){
require("./css/rumChartReport.css");
require("../jquery.json.js");
(function($) {

 var defaults = {
		 			url	   :null,
		 			chartId:null,
		 			params :null
 				 };
  var $panel = null;
  var $model = null;
  $.fn.rumChartReport = function(options) {
	  return  this.each(function(){
		  var opts = $.extend({}, defaults, options);
		  	 var $this = $(this); 
		  	 if(!opts.chartId){
		  		  opts.chartId = $this.attr("chartId");
		  	  }	
		  	
		  	 if(!opts.params){
				   var params		= $this.attr("params");
				   if(params){
					 try{
						opts.params = eval("("+params+")");
					 }catch(e){
						//alert("params参数格式有误！");
					 }
				   }	
			 }
		  	 $this.unbind("click");
		  	 $this.on("click",function(){
		  		 	showPanel($this,opts);
		  	 });
	  });
 };
 $.fn.rumChartReport.defaults = defaults;
 
 function groupList($panel){
	 var url=window._ctx_+"/dashBoard/group/list";
	
	 $.post(url,null,function(data){
		 if(data.status==1){
			 var _html=[];
			 for(var i=0;i<data.data.length;i++){
				 var item=data.data[i];
				 _html.push('<option value="'+item.id+'">'+item.name+'</option>')
			 }
			 $panel.find("#groupSelect").append(_html.join("").toString());
		 }
	 })
 }
 
 function bindEvents($panel){
	 $panel.find("#newadd").click(function(){
		 $("#selectGroup").hide();
		 $("#addGroup").show();
	 });
	 $panel.find("#cancelGroupBtn").click(function(){
		 $("#selectGroup").show();
		 $("#addGroup").hide();
	 });
	 $panel.find("#saveGroupBtn").click(function(){
		var name= $panel.find("#groupName").val();
		if(name==""){
			alert(message_source_i18n.dashboardGroupNameNutNull);return;
		}
		var params={};
		params["name"]=name;
		var url=window._ctx_+"/dashBoard/group/save";
		$.post(url,params,function(data){
			if(data.status==1){
				//加入到options
				$panel.find("#groupSelect").append('<option value="'+data.data.id+'">'+data.data.name+'</option>'); 
				$panel.find("#groupSelect").find('option[value="'+data.data.id+'"]').attr("selected",true);
				 $("#selectGroup").show();
				 $("#addGroup").hide();
			}else{
				alert(data.message);
			}
		});
	 });
	 
 }
 
 
 function  showPanel($this,opts){
	 if(!$panel){
		 initPanel($this,opts);
	 }
	 if(!$model){
		 $model= $('<div class="rumChartReport_model" ></div>');
		 $model.appendTo("body");
	 }
	 var 	scrollHeight = $(document).scrollTop();
	 var	windowHeight = $(window).height();
	 var	windowWidth  = $(window).width();
	 var	popupHeight  = $panel.height();
	 var	popupWeight  = $panel.width();
	 var	posiTop  = ( windowHeight - popupHeight)/2 + scrollHeight;
	 var	posiLeft = ( windowWidth - popupWeight)/2;
	 var    title	 = $.trim($this.parent().prev(".grayfont2:first,.grayfont:first").find("span:last").text());
	 if(dashboardName){
		 $panel.find(".rumChartReport_input").val(dashboardName+"-"+title);
	 }else{
		 $panel.find(".rumChartReport_input").val(message_source_i18n.input_name);
	 }
	 $panel.css({"left": posiLeft + "px","top":posiTop + "px","display":"block"});
 }
 
 function hidePanel(){
	 $panel.find(".rumChartReport_input").val("");
	 $panel.remove();
	 $panel=null;
	 $model.remove();
	 $model=null;
 }
 function initPanel($this,opts){
	 $panel = $(html);
	 groupList($panel);
	 bindEvents($panel);
	 $panel.appendTo("body");
	 $panel.draggable({ handle: ".rumChartReport_title" });
	 $panel.find("#close,#cancel").on("click",function(){
		 hidePanel();
	 });
	 $panel.find("#save").on("click",function(){
		 	var chartId = opts.chartId;
		 	if(!chartId){
		 		hidePanel();
		 		return;
		 	}
		 	var chartContainer = $("#"+chartId);		 	
		 	if(!chartContainer){
		 		 hidePanel();
		 		 return;
		 	}

		 	var chart	= chartContainer.data("chart");
		 	if(!chart){
		 		hidePanel();
		 		return;
		 	}
		 	var data	= [];
		 	if(opts.params){
		 		$.merge(data,serializeArrayObject(opts.params));
		 	}
		 	var $inputs = $panel.find(".rumChartReport_input");
		 	$inputs.each(function(){
		 		data.push({"name":$(this).attr("name"),"value":$(this).val()});
		 	});
		 	var groupId=$panel.find("#groupSelect").val();
		 	if(groupId==0){
		 		alert(message_source_i18n.dashboardGroupIdNotNull);
		 		return;
		 	}
		 	data.push({"name":"params",		"value":chart.getDataString()});
		 	data.push({"name":"url",   		"value":chart.getUrl()});
		 	data.push({"name":"groupId",   		"value":groupId});
		 	data.push({"name":"chartType",  "value":chart.getChartType()});
		 	data.push({"name":"toolTipMsg", "value":$("#"+chartId).attr("toolTipMsg")});
		 	/*var appRegExp = new RegExp("applications|server|key-action|keyAction|apdex");*/
		 	var serverRegExp=new RegExp("accounts\/applications|accounts\/keyAction|apdex");
		 	var sysRegExp = new RegExp("accounts\/server");
		 	var boardType = 1;//默认app
		 	if(serverRegExp.test(chart.getUrl())){
		 		boardType = 0;//server
		 	}else if(sysRegExp.test(chart.getUrl())){
		 		boardType = 2;//sys
		 	}else{
		 		boardType = 1;
		 	}
		 	data.push({"name":"boardType","value":boardType});
		 	if(chart.getExtattr){
		 		data.push({"name":"extattr", "value":chart.getExtattr()});
		 	}

		    hidePanel();
		 	$.post(opts.url,data,function(response){
		 		if(response==1){
		 			alert(message_source_i18n.successadd);
		 		}else if(response==-1){
		 			alert(message_source_i18n.failadd);
		 		}
		 	});
		 	
	 });
 }
 
 function serializeArrayObject(obj){
		var data =[];
		$.each(obj,function(i,v){
			 	if($.isArray(v)){
					$.each(v,function(ii,vv){
							data.push({name:i,value:vv});
					});
				}else{
					data.push({name:i,value:v});
				}
		});
		return data;
	}
 var html = '<div class="rumChartReport">\
		<div class="rumChartReport_title"><span class="float_left">'+message_source_i18n.add_dashboard+'</span><span id="close" class="time_selection_close"></span></div>\
		<div class="rumChartReport_content" id="selectGroup"><span class="rumChartReport_font">'+message_source_i18n.icon_group+'</span><select class="groupSelect" id="groupSelect"><option value="0">'+message_source_i18n.dashboardGroupIdSelectNotNull+'</option></select><input id="newadd" class="rumChartReport_btn_blue_min" type="button" value="'+message_source_i18n.icon_group_add+'" /></div>\
		<div class="rumChartReport_content" id="addGroup" style="display:none;"><span class="rumChartReport_font">'+message_source_i18n.dashboardGroupTitleName+'</span><input class="groupInput" id="groupName" type="text" /><input id="cancelGroupBtn" class="rumChartReport_btn_gray_min" type="button" value="'+message_source_i18n.cancel+'" /><input id="saveGroupBtn" class="rumChartReport_btn_blue_min" type="button" value="'+message_source_i18n.dashboardGroupBtnSure+'" /></div>\
		<div class="rumChartReport_content"><span class="rumChartReport_font">'+message_source_i18n.icon_name+'</span><input class="rumChartReport_input" name="name" type="text" /></div>\
		<div class="rumChartReport_btn_w">\
			<span  id="cancel" class="rumChartReport_btn_gray_min" >'+message_source_i18n.cancel+'</span>\
			<input id="save" class="rumChartReport_btn_blue_min" type="button" value="'+message_source_i18n.add+'" >\
		</div>\
	 </div>';
})(jQuery);
$.fn.rumChartReport.defaults.url = _ctx_+"/dashBoard/save";
return $;
});