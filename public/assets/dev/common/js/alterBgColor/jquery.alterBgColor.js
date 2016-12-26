define(function(require, exports,modules){
(function ($) {
    $.fn.extend({
        "alterBgColor": function (options) {
            return this.each(function () {
                options = $.extend({
                    odd: "trlink_f3",
                    even: "trlink_f",
                    mouseover: "trhover2",
                    selected: ""
                }, options);
                $("tbody>tr:odd", this).removeClass(options.even).addClass(options.odd)
                    .mouseout(function () {
                        $(this).removeClass(options.mouseover);
                    })
                    .mouseover(function () {
                        $(this).addClass(options.mouseover);
                    });
                $("tbody>tr:even", this).removeClass(options.odd).addClass(options.even)
                    .mouseout(function () {
                       $(this).removeClass(options.mouseover);
                    })
                    .mouseover(function () {
                        $(this).addClass(options.mouseover);
                    });
                return this;
            });
        }
    });
})(jQuery);
return $;
});