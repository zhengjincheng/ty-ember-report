/**
 * 表格隔行换色
 */
define(function(require, exports,modules){
require("./rumchart/jquery.rumchart.js");
require("./apdexchart/jquery.apdexChart.1.0.js");
require("./rumchartreport/jquery.rumChartReport.js");
require("./overview/progressBar.js");
require("./rumlefright/jquery.rumselect.js");
require("./rumtree/jquery.rumtree.1.0.js");
require("./chosen/chosen.jquery.js");
require("./check/js/jg-icheck.js");
require("./jquery.rumPage.js");
require("./qtip/jquery.qtip.js");
$(function () {
    $(window).resize(function(){
        $("div:visible.chart").trigger("change");
    });
    _initUi();
    _bindRemoveGreenDiv();
});

function _bindRemoveGreenDiv() {
    $("div.close_green01").bind("click", function () {
        $(this).parent().hide();
    });
}

function _initUi($page) {
    if(!$page){
        $page = document;
    }
    $(".left-right", $page).rumselect({height: 193});
    $("div:visible.chart", $page).rumchart();
    $("ul:visible.ztree", $page).rumTree();
    $("select.rumchosen", $page).chosen();
    $("select.rumchosen-disable-search", $page).chosen({
        disable_search:true
    });
    $(".chartDashborad", $page).rumChartReport();
    $(":checkbox.icheck", $page).jgIcheck();
    $(".rum_page_container", $page).rumPage({opened: function ($newPage) {
        _initUi($newPage);
        $newPage.find(".goback").on("click", function () {
            $(".rum_page_container:last", $page).rumPage("goBack");
        });
    }});
    _initToolTip();
}

function _initToolTip(){
	$(".basedonTip").qtip({
	    position: {
	        my: 'top left',
	        at: 'bottom left'
	    }
	});
}

function bindbaseonChange(divId, messagess, chartId, tooltipDivId) {
    var div = $("#" + divId);
    var baseon = div.find("[name='baseonId']");
    baseon.bind("change", function () {
        var id = this.value;
        var toolTipDiv = div;

        if (typeof tooltipDivId != "undefined") {
            toolTipDiv = $("#" + tooltipDivId);
        }
        $.each(messagess.listArr, function (j, item) {
            if (id == item.id) {
                if (typeof chartId != "undefined") {
                    $("#" + chartId).attr("toolTipMsg", item.fmt);
                }
                toolTipDiv.find(".basedonTip").attr("title", item.message);
                _initToolTip();
            }
        });
    });
    baseon.change();
}


function ToolTipMsgList() {
    this.listArr = new Array();
    this.clean = function () {
        this.listArr = new Array();
    };

    this.addItem = function (id, message, fmt) {
        var toolTipMsg = new ToolTipMsg(id, message, fmt);
        this.listArr[this.listArr.length] = toolTipMsg;
        return this;
    };
}

function ToolTipMsg(id, message, fmt) {
    this.id = id;
    this.message = message;
    this.fmt = fmt;
}

function timeCost(cost){

	  var date3=cost;
	  var months=Math.floor(date3/(24*3600*1000*30));
	  var days=Math.floor(date3/(24*3600*1000));
	  var leave1=date3%(24*3600*1000);    //���������ʣ��ĺ�����
	  var hours=Math.floor(leave1/(3600*1000));
	  var leave2=leave1%(3600*1000);        //����Сʱ���ʣ��ĺ�����
	  var minutes=Math.floor(leave2/(60*1000));
	  var str = '';
	  if(months > 0){
		  str += months + message_source_i18n.month;
	  }
	  if(days > 0){
		  str += days + message_source_i18n.day;
	  }
	  if(hours > 0){
		  str += hours + message_source_i18n.hours;
	  }
	  if(minutes > 0){
		  str += minutes + message_source_i18n.minutes;
	  }

	  return  str;
}
return $;
});