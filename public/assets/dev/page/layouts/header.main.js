define(function (require, exports, module) {
    require("../../common/js/iDialog/jquery.iDialog.js");
    $(function () {

        function toggleNavArrow(){
            if($("#tyc-pro-cur-arrow").hasClass("tyc-pro-arrow")){
                $("#tyc-pro-cur-arrow").addClass("tyc-pro-arrow-active");
                $("#tyc-pro-cur-arrow").removeClass("tyc-pro-arrow");
            }else{
                $("#tyc-pro-cur-arrow").addClass("tyc-pro-arrow");
                $("#tyc-pro-cur-arrow").removeClass("tyc-pro-arrow-active");
            }

        }
        //产品二级导航
        $("#tyc-pro-cur").on("click", function () {
            $(".tyc-nav-pro").slideToggle();
            toggleNavArrow();
        });
        $("#tyc-nav-pro").on("mouseout",function(e){
            var etop = $("#tyc-nav-pro").offset().top;
            var eheight = $("#tyc-nav-pro").height();
            if(e.clientY<etop || e.clientY >etop+eheight){
                $(".tyc-nav-pro").slideUp();
                $("#tyc-pro-cur-arrow").addClass("tyc-pro-arrow");
                $("#tyc-pro-cur-arrow").removeClass("tyc-pro-arrow-active");
            }
        });
        $(".tyc-container").on("click", function () {
            if ($(".tyc-nav-pro").css("display") == 'block') {
                $(".tyc-nav-pro").slideUp();
            }
        });
        //左侧sidebar
        $(".tyc-sidebar-cicon").click(function () {
            $(".tyc-sidebar").toggleClass("tyc-sidebar-min");
            $(".tyc-main").toggleClass("tyc-main-min");
            var mini = $(this).attr("mini");
            //当前状态为停靠(折叠)
            if (mini && mini == "true") {
                //同步session中sidebarMini的状态
                $.get(window._ctx_ + "/common/sidebar/0");

                $(this).attr("mini", false);
            } else {//当前状态为展开
                //同步session中sidebarMini的状态
                $.get(window._ctx_ + "/common/sidebar/1");
                $(this).attr("mini", true);
            }

            $("#timePeriod").trigger("change");
        });

        if ($(".tyc-sidebar").height() < $(".tyc-main").height()) {
            $(".tyc-sidebar").css("height", $(".tyc-main").height());
        }
        if ($(".tyc-sidebar-min").height() < $(".tyc-main-min").height()) {
            $(".tyc-sidebar-min").css("height", $(".tyc-main-min").height());
        }
        loadAlertContent();

    });

    //加载警报
    function loadAlertContent() {
        if ($("#alertContent").is(":visible")) {
            return false;
        }
        $.ajax({
            type: "GET",
            cache: false,
            url: $("#alertContent").attr("url"),
            success: function (data) {
                var _data = $(data);
                var promptSize = _data.find("#unreadEventsSize").val();
                if (promptSize && promptSize > 0) {
                    $("#topAlert").text(promptSize).show();
                }
            }
        });
    }

    return $;
});