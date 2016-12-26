define(function(require, exports,module){
	$=require("../tablesorter/jquery.tablesorter.widgets.js");
	function handlerNoSortStyle(table) {
	    var lastClassIsOdd = $(table).find("tbody:first tr:visible").size() % 2 == 1 ? true : false;
	    $(table).find("tbody.tablesorter-no-sort tr:visible:odd").removeClass(lastClassIsOdd ? "even" : "odd").addClass(lastClassIsOdd ? "odd" : "even");
	    $(table).find("tbody.tablesorter-no-sort tr:visible:even").removeClass(lastClassIsOdd ? "odd" : "even").addClass(lastClassIsOdd ? "even" : "odd");
	}
	ty.rumTableSorter=function(targetTable,themeName) {
		if(typeof(themeName)=="undefined"){
			themeName="metro-deep";
			targetTable.addClass("table_keyaction");
		}
	    targetTable.find("tbody.tablesorter-no-sort").empty().append(targetTable.find("tbody td.nosort").parent());
	    try{
	        targetTable.tablesorter({
	            // debug:true,
	            theme: themeName,
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
	return $;
});
