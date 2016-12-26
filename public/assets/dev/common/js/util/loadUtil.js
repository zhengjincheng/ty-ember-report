define(function function_name(require,exports,module) {
	require("../../css/loading.css");
    var loadDiv = "<div id='_load_div_index' class='loading_model'><div id='loading'></div>";
    var loadDivId = "_load_div_index";
    ty.loadShow = function(){
        var _body = $(document.body);
        _body.append(loadDiv);
    }
    ty.loadHide = function(){
        $("#_load_div_index").remove();
    }
});