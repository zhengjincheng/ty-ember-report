define(function (require, exports, modules) {
    require("./rumchart/jquery.rumchart.js");
    require("./apdexchart/jquery.apdexChart.1.0.js");
    require("./rumchartreport/jquery.rumChartReport.js");
    require("./rumtree/jquery.rumtree.1.0.js");
    require("./util/initToolTip.js");
    require("./jquery.rumPage.js");
    require("./qtip/jquery.qtip.js");

    $(window).resize(function () {
        $("div:visible.chart").trigger("change");
    });

    _initUi();
    _bindRemoveGreenDiv();


    function _bindRemoveGreenDiv() {
        $("div.close_green01").bind("click", function () {
            $(this).parent().hide();
        });
    }

    function _initUi($page) {
        if (!$page) {
            $page = document;
        }

        $("div:visible.chart", $page).rumchart();
        $("ul:visible.ztree", $page).rumTree();
        $(".chartDashborad", $page).rumChartReport();
        $(".rum_page_container", $page).rumPage({
            opened: function ($newPage) {
                _initUi($newPage);
                $newPage.find(".goback").on("click", function () {
                    $(".rum_page_container:last", $page).rumPage("goBack");
                });
            }
        });
        ty.initToolTip();
    }

    return $;
});