define(function(require,exports,module){
	require("../../common/js/rumchart/jquery.rumchart.js");
	require("../../common/js/apdexchart/jquery.apdexChart.1.0.js");
	require("../../common/js/chinamap/jquery.rumChinaMap.1.0.js");
	require("../../common/js/rumchartreport/jquery.rumChartReport.js");
	require("../../common/js/gridster/jquery.dragsort-0.5.2.js");
	require("../../common/js/util/customResolution.js");
	$("div:visible.chart").rumchart({"autoRefresh":true});
	return $;
});