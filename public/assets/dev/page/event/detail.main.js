define(function(require, exports, module) {
	require("../../common/js/rumchart/jquery.rumchart.js");
	require("../../common/js/apdexchart/jquery.apdexChart.1.0.js");
	require("../../common/js/rumchartreport/jquery.rumChartReport.js");
	require("../../common/js/qtip/jquery.qtip.js");
	require("../../common/js/util/rumTableSorter.js");
	require("../../common/js/jquery.rumPage.js");
	require("../../common/js/alterBgColor/jquery.alterBgColor.js");
	ty.resizeName = function() {
		var id = "#alarmBody .alarm_name_ellipsis .stop_prop";
		var tbody_id = "#alarmBody";
		var name_id = "#alarmBody div.alarm_name_ellipsis";
		ty.setTableWidth(id, tbody_id, name_id);

		var his_id = "#historyBody .alarm_name_ellipsis .history_a";
		var his_tbody_id = "#historyBody";
		var his_name_id = "#historyBody div.alarm_name_ellipsis";
		ty.setTableWidth(his_id, his_tbody_id, his_name_id);
	};
	ty.setTableWidth = function(id, tbody_id, name_id) {
		for (var i = 0; i < $(tbody_id + " td").length; i++) {
			var divWidth = $(tbody_id).find("div.alarm_calc_div")[0].clientWidth;// 计算DIV宽度（等于td宽度）
			var totalWidth = ty.calcLength($($(tbody_id + " td")[i]).find(
					"div.alarm_calc_div").text());// 计算文字总长度
			var name = $(id).html();
			var nameWidth = ty.calcLength(name);// 计算名字长度

			if (totalWidth >= divWidth) {// 长度超出限制
				var textWidth = totalWidth - nameWidth;// 计算总长度-名字长度
				if (textWidth >= divWidth) {
					$($(tbody_id + " td")[i]).find("div.alarm_name_ellipsis")
							.width(50);
				} else {
					var calcWidth = divWidth - textWidth;// 计算div的宽度-名字之外的字符宽度
															// 结果为设置的名字宽度
					if (calcWidth < 10) {
						$($(tbody_id + " td")[i]).find(
								"div.alarm_name_ellipsis").width(20);
					} else {
						$($(tbody_id + " td")[i]).find(
								"div.alarm_name_ellipsis").width(calcWidth);
					}
				}
			}
		}
	};
	ty.calcLength = function(s) {
		if (!arguments.length || !s)
			return null;
		if ("" == s)
			return 0;
		var l = 0;
		for (var i = 0; i < s.length; i++) {
			if (s.charCodeAt(i) > 255)
				l += 2;
			else
				l++;
		}
		return l * 6;
	};
	return $;
});