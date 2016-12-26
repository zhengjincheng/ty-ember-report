/**
 * 提供公共功能的部分js
 */
define(function(require, exports,modules){
$(function(){
	/**
	 * 导航菜单处理
	 */
    var current = $("div.mainmenu2 #current").parent();
	$("div.mainmenu li div").not(current).hover(function() {
        if ($(this).parent().parent().is("[id=current]")) {
            return true;
        }
        var _class = $(this).attr("class");
        var prefix = _class.substring(0, _class.length - 1);
        $(this).attr("class", prefix + "3");
	}, function() {
        if ($(this).parent().parent().is("[id=current]")) {
            return true;
        }
        var _class = $(this).attr("class");
        var prefix = _class.substring(0, _class.length - 1);
        $(this).attr("class", prefix + "1");
	});

	/**
	 * prompt处理
	 */
	$("div[class^=close_]:last-of-type").on("click",function(){
		$(this).parent().fadeOut("slow",function(){
			$(this).remove();
		});
	});

	/* Id选择 Start */
	//改变状态颜色
	if($("#id-chosen").size() > 0){
		$("#id-chosen .chosen-container").css("background",$("#alarmStatus").val());
	}

	//提交页面
	$("#idChosen").change(function(){
		window.location.href = $(this).attr("url") + $(this).val() +  $(this).attr("uri");
	});
	/*Id选择 end*/

	/** 应用相关操作 start */
	$("div[id$=StatList]").on("mouseover","div[type=toOperator]",function(){
		$(this).next().show();
	});
	$("div[id$=StatList]").on("mouseout","div[type=toOperator]",function(){
		$(this).next().hide(10);
	});
	$("div[id$=StatList]").on("mouseover","div[type=operator]",function(){
		$(this).stop().show();
		$(this).prev().attr("class","edit02");
	});
	$("div[id$=StatList]").on("mouseout","div[type=operator]",function(){
		$(this).hide();
		$(this).prev().attr("class","edit01");
	});

	/** 应用相关操作 end */

	/**
	 * 显示隐藏的app
	 */
	$("div[id$=StatList]").on("click","#showHideApp",function(){
		var status = $(this).attr("status");
		if(status == 1 ){
			$("#mobileAppList tr:hidden").show();
			$("#keyUrlList tr:hidden").show();
			$("#keyActionList tr:hidden").show();
			$(this).text(message_source_i18n.hide);
			$(this).attr("status",0);
		} else if(status == 0){
			$("#mobileAppList tr:gt("+$(this).attr("start")+")").hide();
			$("#keyUrlList tr:gt("+$(this).attr("start")+")").hide();
			$("#keyActionList tr:gt("+$(this).attr("start")+")").hide();
			$(this).text(message_source_i18n.show+"  "+ $(this).attr("hideCount")+""+message_source_i18n.message_1);
			$(this).attr("status",1);
		}

        $("#mobileAppList").trigger("updateAll");
        $("#keyUrlList").trigger("updateAll");
        $("#keyActionList").trigger("updateAll");
	});

	$("table.forTip,div[id$=StatList]").on("mouseover","div[type=stat]",function(){
		$("#statTooltip #tooltipContent").text($(this).attr("status"));
		$("#statTooltip").css({left:$(this).offset().left + 8,top:$(this).offset().top - 24});
		$("#statTooltip").show();
	});
	$("table.forTip,div[id$=StatList]").on("mouseout","div[type=stat]",function(){
		$("#statTooltip").hide();
	});
	
	$("table.forTip,div[id$=StatList]").on("mouseover","div[type=appNameTooltip]",function(){
		$("#nameTooltip #nameTooltip_content").text($(this).attr("status"));
		
		$("#nameTooltip").css({left:$(this).offset().left+getStringWidth($(this).text()),top:$(this).offset().top - 18});
		$("#nameTooltip").show();
	});
	
	$("table.forTip,div[id$=StatList]").on("mouseout","div[type=appNameTooltip]",function(){
		$("#nameTooltip").hide();
	});
	
	$("table.forTip").on("mouseover","div[type=errorTooltip]",function(){
		$("#errorMessageTooltip #errorMessageTooltip_content").text($(this).text());
		$("#errorMessageTooltip").css({left:$(this).offset().left-500 ,top:$(this).offset().top - 50});
		$("#errorMessageTooltip").show();
	});
	
	$("table.forTip").on("mouseout","div[type=errorTooltip]",function(){
		$("#errorMessageTooltip").hide();
	});
	
	$("table.forTip").on("mouseover","div[type=errorNameTooltip]",function(){
		var spanText=$(this).find("span");
		var text1,text2;
		if(spanText.length=2){
			text1 = $(spanText[0]).text();
			text2 = $(spanText[1]).text();
		}
		$("#errorNameTooltip #errorNameTooltip_content1").text(text1);
		$("#errorNameTooltip #errorNameTooltip_content2").text(text2);
		$("#errorNameTooltip").css({left:$(this).offset().left-500 ,top:$(this).offset().top - 50});
		$("#errorNameTooltip").show();
	});
	
	$("table.forTip").on("mouseout","div[type=errorNameTooltip]",function(){
		$("#errorNameTooltip").hide();
	});
	
	//删除每个item的处理
	$("#alertContent").on("click","#tipsContent div[class^=choose]",function(){

		if($(this).attr("class") == "choose01" || $(this).attr("class") == "choose02"){
			$(this).attr("class","choose_on");
		}else{
			$(this).attr("class","choose01");
		}

		return false;
	});

	$("#alertContent").on("mouseover","div[class^=choose]",function(){
		if($(this).attr("class") == "choose_on"){
			return false;
		}
		$(this).attr("class","choose02");
	});

	$("#alertContent").on("mouseout","div[class^=choose]",function(){
		if($(this).attr("class") == "choose_on"){
			return false;
		}
		$(this).attr("class","choose01");
	});

	//选择所有事件信息
	$("#alertContent").on("click","#tipsChooseAll",function(){
		var isSelect = $(this).data("isSelect");
		if(isSelect == undefined || !isSelect){
			$(this).attr("class","choose_on");
			$("#tipsContent div[class^=choose]").attr("class","choose_on");
			$(this).data("isSelect",true);
		} else {
			$(this).attr("class","choose01");
			$("#tipsContent div[class^=choose]").attr("class","choose01");
			$(this).data("isSelect",false);
		}
		return false;
	});

	//删除全部
	$("#alertContent").on("click","#tipsDelete",function(){
		var chooseLength = $("#tipsContent .choose_on").length;
		if (chooseLength == 0){
			return;
		}

		var _events = {};
		_events.mobileApp = {};
		_events.mobileApp.eventIds = new Array();
		_events.keyUrl = {};
		_events.keyUrl.eventIds = new Array();
        _events.keyAction={};
        _events.keyAction.eventIds = new Array();
        _events.application = {};
        _events.application.eventIds = new Array();
        _events.server = {};
        _events.server.eventIds = new Array();
        _events.appBody = {};
        _events.appBody.eventIds = new Array();
        _events.appPage = {};
        _events.appPage.eventIds = new Array();
        _events.keyUrl = {};
        _events.keyUrl.eventIds = new Array();
		$.each($("#tipsContent .choose_on"),function(){
			$(this).parent().hide("slow").remove();
			var type = $(this).attr("type");
			_events[type].eventIds.push($(this).attr("id"));
		});

		updateEventStatus(_events);

		var itemsHeight = 0;
		$.each($("#alertContent .tooltip_content"),function(i,n){
			itemsHeight += $(n).outerHeight();
		});
		if(itemsHeight < 450){
			$("#alertContent #tipsContent").removeClass("tops_scroll");
		}
		var promptSize = $("#unreadEventsSize").val();
		$("#unreadEventsSize").val(promptSize - chooseLength);
		if(promptSize&&chooseLength&&(promptSize - chooseLength)==0){
			$("#topAlert .prompt").hide();
		}else{
			$("#topAlert .prompt").text(promptSize - chooseLength);
		}
		if(promptSize == 1){
			$("#topAlert .prompt").hide();
		}
		if($("#tipsItems").css("overflow-y") == "scroll" && $("#tipsItems").prop('scrollHeight') < 0){
			$("#tipsItems").css("overflow-y","hidden");
			$("#tipsItems div[class^=choose]").css("margin-right",28);
		}

		if(itemsHeight == 0 ){
			$("#alertContent").html("<div class=\"tooltip_w\"><div class=\"tooltip_content\" style=\"text-align: center;width: 100%;\">"+message_source_i18n.message_2+"</div></div>");
		}
		return false;
	});

	//head上的事件信息处理
	$("#topAlert").click(function(event){
		var isShow = $(this).data("isShow");
		if(isShow == undefined || !isShow){
			$("#alertContent").css({left:$(this).offset().left - 290,top :$(this).offset().top+10}).show();
			$(this).data("isShow",true);
			if($("#alertContent").height() > 450){
				$("#alertContent #tipsContent").addClass("tops_scroll");
			}
		} else {
			$("#alertContent").hide();
			$(this).data("isShow",false);
		}
		event.stopPropagation();
	});

	//加载事件
	loadAlertContent();
	//定期加载事件
	setInterval(refresh, 1000 * 60 * 5);

	loadAppStatList();

	loadKeyUrlStatList();

	resizewindow();

	//处理单击页面区域时隐藏用户事件
	$(document).bind("click",function(e){
		if ($(e.target).parents('#alertContent').size() != 0){
			return;
		}else if($("#alertContent").is(":visible")){
			$("#alertContent").hide();
			$("#topAlert").data("isShow",false);
		}
	});

	//事件信息折叠
	$("#appOverview,#keyUrlStatList,div.conright_min").on("click","#eventContent .tab_content_font1 span",function(){
		if($(this).attr("class") == "icon_plus"){
			$(this).parent().nextUntil("div.tab_content_font1").show();
			$(this).attr("class","icon_minus");
		} else if($(this).attr("class") == "icon_minus"){
			$(this).parent().nextUntil("div.tab_content_font1").hide();
			$(this).attr("class","icon_plus");
		}
		return false;
	});
	$(".chart").css({"margin-left":"0px"});//覆盖图标margin-left，保证表头和表体对齐

	$("#searchName").keyup(function(){
		loadAppStatList();
	});
});

function resizewindow(){
	$(window).resize(function() {
		if($(".chart").length>0){
			$(".chart").trigger("change");
		}
	});
}

function refresh(){
	loadAppStatList();

	loadKeyUrlStatList();

	loadAlertContent();
	if($("#activeDevice").length>0){
		$("#activeDevice").rumchart();
	}
}

function loadAlertContent(){
	if($("#alertContent").is(":visible")){
		return false;
	}
	$.ajax({
		type:"GET",
		cache: false,
		url:$("#alertContent").attr("url"),
		success:function(data){
			var _data = $(data);
			var promptSize = _data.find("#unreadEventsSize").val();
			if(promptSize && promptSize > 0 ){
				$("#topAlert .prompt").text(promptSize).show();
			}
			$("#alertContent").html(_data);
		}
	});
}

function loadAppStatList(){

	if($("#appStatList").size() > 0){
		$.ajax({
			type:"GET",
			cache: false,
			data:{"name":encodeURI(encodeURI($("#searchName").val()))},
			url:$("#appStatList").attr("url"),
			success:function(data){
				$("#appStatList").html(data);
			}
		});
	}
}

function loadKeyUrlStatList(){
	if($("#keyUrlStatList").size() > 0){
		$.ajax({
			type:"GET",
			cache: false,
			url:$("#keyUrlStatList").attr("url"),
			success:function(data){
				$("#keyUrlStatList").html(data);
				//handelEvents();
			}
		});
	}
}

function updateEventStatus(eventIds) {
	var url=$("#alertContent").attr("url");
	url=url.substr(0,url.lastIndexOf("?"));
	$.ajax({
		type : "POST",
		url : url + "/update",
		data : JSON.stringify(eventIds),
		datatype : "json",
		contentType : "application/json; charset=utf-8"
	});
}

function reminderInstallDiv() {
	var divHtml = new Array();
	divHtml.push('	<a href="'+_ctx_+'/config/mobileApp/install"><img src="'+_ctx_+'/assets/images/install_app_msg.png" /></a>');
	sAlertCustom(divHtml.join(""), 999, -70, 150);
}


//str html字符串   msgw数据(html)层宽度    msgh数据(html)层高度   zIndex 层的垂直等级
function sAlert(str,msgw,msgh,zIndex){
	   var iLeft = (window.screen.availWidth-10-msgw)/2;
	   var iTop = (window.screen.availHeight-msgh)/2;
	   var bordercolor="#336699";//提示窗口的边框颜色
	   var wh = $(window).height();
	   var dh = $(document).height();
	   var sHeight = dh<=wh?wh:dh;

	   var bgObj=document.createElement("div");
	   bgObj.setAttribute('id','bgDiv'+zIndex);
	   bgObj.style.position="absolute";
	   bgObj.style.top="0";
	   bgObj.style.background="#777";
	   bgObj.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75)";
	   bgObj.style.opacity="0.6";
	   bgObj.style.left="0";
	   bgObj.style.width="100%";
	   bgObj.style.height=sHeight + "px";
	   bgObj.style.zIndex = zIndex;
	   document.body.appendChild(bgObj);

	   var msgObj=document.createElement("div");
	   msgObj.setAttribute("id","msgDiv"+zIndex);
	   msgObj.style.background="white";
	   msgObj.style.border="1px solid " + bordercolor;
	   msgObj.style.position = "absolute";
	   msgObj.style.left = iLeft+ "px";
	   msgObj.style.top = getScrollTop() + iTop+"px";
	   msgObj.style.font="12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
	   msgObj.style.width = msgw + "px";
       msgObj.style.overflow ="hidden";
	   msgObj.style.lineHeight ="25px";
	   msgObj.style.zIndex = zIndex + 1;
	   msgObj.innerHTML=str;

	   document.body.appendChild(msgObj);
}

//str html字符串   msgw数据(html)层宽度    msgh数据(html)层高度   zIndex 层的垂直等级
function sAlertCustom(str,zIndex,mLeft,mTop){
	   var iLeft = mLeft;
	   var iTop = mTop;
	   // var bordercolor="#336699";//提示窗口的边框颜色
	   var wh = $(window).height();
	   var dh = $(document).height();
	   var sHeight = dh<=wh?wh:dh;

	   var bgObj=document.createElement("div");
	   bgObj.setAttribute('id','bgDiv'+zIndex);
	   bgObj.style.position="absolute";
	   bgObj.style.top="0";
	   bgObj.style.background="#777";
	   bgObj.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75)";
	   bgObj.style.opacity="0.6";
	   bgObj.style.left="0";
	   bgObj.style.width="100%";
	   bgObj.style.height=sHeight + "px";
	   bgObj.style.zIndex = zIndex;
	   document.body.appendChild(bgObj);

	   var msgObj=document.createElement("div");
	   msgObj.setAttribute("id","msgDiv"+zIndex);
	  // msgObj.style.background="white";
	  // msgObj.style.border="1px solid " + bordercolor;
	   msgObj.style.position = "absolute";
	   if(iLeft>0){
		   msgObj.style.left = iLeft+ "px";
	   }else{
		   msgObj.style.right = -iLeft+ "px";
	   }
	   msgObj.style.top = getScrollTop() + iTop+"px";
	  // msgObj.style.font="12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
	  // msgObj.style.width = msgw + "px";
       msgObj.style.overflow ="hidden";
	   msgObj.style.lineHeight ="25px";
	   msgObj.style.zIndex = zIndex + 1;
	   msgObj.innerHTML=str;

	   document.body.appendChild(msgObj);
}

//获取 滚动条据顶部的距离
function getScrollTop() {
   var scrollPos = 0;
   if (window.pageYOffset) {
       scrollPos = window.pageYOffset;
   } else if (document.compatMode && document.compatMode != 'BackCompat') {
	   scrollPos = document.documentElement.scrollTop;
   } else if (document.body) {
	   scrollPos = document.body.scrollTop;
   } return scrollPos;
}

function div_close(zIndex){
	document.body.removeChild(document.getElementById("msgDiv"+zIndex));
	document.body.removeChild(document.getElementById("bgDiv"+zIndex));
	if(timer){
		window.clearInterval(timer);
	}
}

function secondToDate(second) {
	if (second == 0) {
		return 0;
	}
	var time = '';
	if((second <60) && (second >0)){
		time = message_source_i18n.message_3;
	}
	if (second >= 24 * 3600) {
		time += parseInt(second / (24 * 3600)) + message_source_i18n.day;
		second %= 24 * 3600;
	}
	if (second >= 3600) {
		time += parseInt(second / 3600) + message_source_i18n.hours;
		second %= 3600;
	}
	if (second >= 60) {
		time += parseInt(second / 60) + message_source_i18n.minutes;
		second %= 60;
	}
	return time;
}

function rumTableSorter(targetTable) {

    targetTable.find("tbody.tablesorter-no-sort").empty().append(targetTable.find("tbody td.nosort").parent());
    try{
        targetTable.tablesorter({
            // debug:true,
            theme: 'metro-deep',
            widthFixed: true,
            // widgets: ['zebra', 'columns', 'filter'],
            widgets: ['zebra', 'columns'],
            emptyTo: 'bottom',
            cssInfoBlock: "tablesorter-no-sort",
            initialized: function (table) {
                handlerNoSortStyle(table);
            },
            textExtraction: {
                '.alarmStatus' : function(node, table, cellIndex){
                    return $(node).attr("alarmStatus");
                }
            }
        }).on("updateComplete", function (event, table) {
            handlerNoSortStyle(table);
        });
    }catch(e){
    }
}

function handlerNoSortStyle(table) {
    var lastClassIsOdd = $(table).find("tbody:first tr:visible").size() % 2 == 1 ? true : false;

    $(table).find("tbody.tablesorter-no-sort tr:visible:odd").removeClass(lastClassIsOdd ? "even" : "odd").addClass(lastClassIsOdd ? "odd" : "even");

    $(table).find("tbody.tablesorter-no-sort tr:visible:even").removeClass(lastClassIsOdd ? "odd" : "even").addClass(lastClassIsOdd ? "even" : "odd");

}
function customResolution(array){
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
}
function isExitsFunction(funcName) {
    try {
        if (typeof(eval(funcName)) == "function") {
            return true;
        }
    } catch(e) {}
    return false;
}

function calcLength(s) {
    if(!arguments.length||!s) return 0;
    if(""==s) return 0;
    var l=0;
    for(var i=0;i<s.length;i++)
    {
         if(s.charCodeAt(i)>255) l+=2;
         else l++;
    }
    return l*6;
}

function getStringWidth(word){
	 if(word){
		 word = word.replace(/</g,"&lt;");
	 }
	 var currentObj = $('<span>').hide().appendTo(document.body);
	 $(currentObj).html(word);
     var width = currentObj.width();
     currentObj.remove();
     return width;
}
var initHeight=0;
var maxHeight=0;
//id:divId,pa:查询树对象的参数 json格式,divClass:图表div的共用class 如http_panel,tableId:对于有表格的页面 需要做特殊处理,没有表格的就传null,inputArr和jsonArr 只有左侧树形菜单是多级的情况下才需要传递
function slideLeft(id,pa,divClass,tableId,inputArr,jsonArr,callBackFunc){
	var top=calcTop();;
	$("div."+divClass).hide();
	$("#"+id).css({ "z-index": "200","position":"absolute","width":"100%","background":"#fff","top":top,"left":"0"});
	$("#"+id).show("slide",{direction:'right'},300,function(){
		setPageHeight(id);
		if(tableId){
			existTableResize(tableId,divClass,id);
		}
	});
	//绑定返回事件
	$("#"+id+"_back").unbind("click");
	$("#"+id+"_back").bind("click",function(){
		slideRight(id,pa,divClass,tableId,inputArr,jsonArr,callBackFunc);
	});
	
}

function slideRight(id,pa,divClass,tableId,inputArr,jsonArr,callBackFunc){
	var top=calcTop();;
	var backid=$("#"+id+"_back").attr("backPage");
	$("#"+backid).css({ "z-index": "200","position":"absolute","width":"100%","background":"#fff","top":top,"left":"0"});
	
	$("#"+backid+"_back").unbind("click");
	$("#"+backid+"_back").bind("click",function(){
		var treeNode=$("#tree").data("tree").findNodeByPa(pa);
		var pa1={};
		if(treeNode){
			var parentNode=treeNode.getParentNode();
			if(parentNode){
				for(var key in pa){
					pa1[key]=parentNode[key];
				}
			}
		}
		slideRight(backid,pa1,divClass,tableId,callBackFunc);
	});
	var treeNode=$("#tree").data("tree").findNodeByPa(pa);
	if(treeNode){
		var parentNode=treeNode.getParentNode();
		if(parentNode){
			var $p = $("#" + backid);
			if(inputArr){
				for(var i=0;i<inputArr.length;i++){
					$p.find("input[name='"+inputArr[i]+"']").val(parentNode[jsonArr[i]]);
				}
			}
			$p.show();
			if (!$p.find(".chart:first").data("chart")) {
				$p.find(".chart").rumchart();
			} else {
				$p.find(".chart").each(function() {
					var chart = $(this).data("chart");
					if (chart) {
						chart.reDraw();
					}
				});
			}
		}
	}
	
	$("#"+backid).show();
	$("#"+id).hide("slide",{direction:'right'},400);
	if($("#tree").data("tree").selectByObject(pa)){
		$("#tree").data("tree").closeNode(pa,function(){
			setInitHeight(initHeight);
		});
	}
	
	existTableResize(tableId,divClass,backid);
	
	if(callBackFunc){
		callBackFunc();
	}
}
function setInitHeight(){
	$("#sidebar").height(initHeight);
}
function setPageHeight(id){
	var height = $("#sidebar").height();
	var divHeight=$("#"+id).height()+85;
	if(initHeight==0){
		initHeight=height;	
	}
	maxHeight=maxHeight<divHeight?divHeight:maxHeight;
	if(maxHeight<initHeight){
		maxHeight=initHeight;
	}
	$("#sidebar").height(maxHeight+45);
}
function calcTop(){
	if($("div.analysis_lay1").length>0){
		return 149;
	}else{
		return 85;
	}
}
function existTableResize(tableId,divClass,backid,initHeight){
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

/***
 * 阻止事件冒泡
 * @param event对象
 */
function stopPropagation(e) {
    if (e.stopPropagation) 
        e.stopPropagation();
    else 
        e.cancelBubble = true;
}
return $;
});