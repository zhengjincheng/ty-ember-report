/**
 * 表格隔行换色
 */
define(function(require, exports,modules){
require("./rumchart/jquery.rumchart.js");
require("./apdexchart/jquery.apdexChart.1.0.js");
require("./rumchartreport/jquery.rumChartReport.js");
//require("./jquery.rumPage.js");
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
    $("div:visible.chart", $page).rumchart();
    $(".chartDashborad", $page).rumChartReport();
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
 
return $;
});