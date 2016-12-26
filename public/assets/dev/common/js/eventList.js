define(function(require, exports,modules){
(function ($) {

    var defaults = {
        url: null,
        chartId: null,
        params: null,
        eventType: ["all", "warning", "alarm", "critical", "config"],
        contentClass:"tab_content_w"

    };

    $.fn.eventList = function (options,callback) {
        var opts = $.extend({}, defaults, options);
        var $this = $(this);

        init($this, opts,callback);
    }

    function init($this, opts,callback) {
        $this.find("li").click(function (e) {
            var dataRemote = $(this).attr("data_remote");
            var eventType = $(this).attr("type");
            $(".event_container div[type]").hide();
            if (!dataRemote || "true" == dataRemote) {
                var dataURL = $(this).attr("url");
                $.ajax({
                    type: "GET",
                    url: dataURL,
                    success: function (data) {
                    	 $(".event_container div[type]").hide();
                        $("div[type='" + eventType + "']").html(data).show();
                        if ("all" == eventType) {
                            var $data = $(data);
                            $.each(opts.eventType, function (i, obj) {
                                var countNum = $data.find("#" + obj + "Counter").val();
                                if (countNum) {
                                    $("#" + obj + "Counter").text("(" + $data.find("#" + obj + "Counter").val() + ")");
                                }

                            });
                        }
                        $(this).attr("data_remote", false);
                        //回调函数
                        if(callback){
                        	callback();
                        }
                    },
                    beforeSend: function () {
                        var eventContainer = $(".event_container div[type=" + eventType + "]");
                        if (eventContainer.size() == 0) {
                            $(".event_container").append($("<div />", {"class": opts.contentClass, "type": eventType}).html($("div.waitting div.waitting_box").clone().show()));

                        } else {
                            eventContainer.show();
                        }
                    }
                });
            } else {
                $(".event_container div[type=" + eventType + "]").show();
            }

            $this.find("li").removeAttr("id");
            $(this).attr("id", "current");
        });

        $this.find("li:first").trigger("click");


    }
})(jQuery);

function fold(index){

    var $span = $("."+index+"_span"),$ul = $("."+index+"_ul");

    if($span.hasClass("icon_minus")){
        $span.removeClass("icon_minus").addClass("icon_plus");
        $ul.hide();
    }else if($span.hasClass("icon_plus")){
        $span.removeClass("icon_plus").addClass("icon_minus");

        $ul.show();
    }
}

function loadEvent(url,scope,type,time,page){
	$(".li_"+time+"_"+type).remove();
	 $.get(url,{'page':page,'scope':scope,'type':type,'time':time},function(result){
		 $("."+time+"_"+type).append(result);
	 });
}
return $;
});