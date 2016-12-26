define(function(require, exports,module){
	require("../../common/js/rumlefright/jquery.rumselect.js");
	require("../../common/js/chosen/chosen.jquery.js");
	require("../../common/css/list-chosen.css");
	function _initUi($page) {
	    if(!$page){
	        $page = document;
	    }
	    $("select.rumchosen", $page).chosen();
	    $("select.rumchosen-disable-search", $page).chosen({
	        disable_search:true
	    });
	}
	//改变状态颜色
	if($("#id-chosen").size() > 0){
		$("#id-chosen .chosen-container").css("background",$("#alarmStatus").val());
	}
    _initUi();
	return $;
});