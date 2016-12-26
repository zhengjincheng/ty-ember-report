define(function(require,exports,module){
(function ($) {
    $.widget("rum.rumPage", {
        options: {
            url: null,
            beforeOpen: null,
            opened: null,
            beforeBack: null,
            backed: null
        },
        opt: {
            historyPage: [],
            activePage: null,
            page_no: 1,
            overlay: null
        },
        _initOptions: function () {
            var $el = this.element;
            if (!this.options.url) {
                this.options.url = $el.attr("url")
            }
        },
        _create: function () {
            this._initOptions();
            this.element.addClass("rum-page-doc");
            if (this.options.url) {
                this.openPage(this.options.url);
            } else {
                var original = $('<div class="rum-page" page_no="" ></div>').append(this.element.children());
                this.element.append(original);
                if (this.element.attr("original-page-no")) {
                    original.attr("page_no", this.element.attr("original-page-no"));
                } else {
                    original.attr("page_no", this.opt.page_no++);
                }
                original.data("pageData", {page_no: original.attr("page_no")});
                this.opt.activePage = original;
            }

        },
        openPage: function (url, params, page_no) {
        	if(url.indexOf("?")>0){
        		url+="&c="+new Date().getTime();
        	}else{
        		url+="?c="+new Date().getTime();
        	}
            var self = this;
            var newPage = true;

            var $page;
            if (!page_no) {
                $page = $('<div class="rum-page" page_no="' + (this.opt.page_no++) + '" ></div>').hide();
            } else {
                $page = this.element.find('.rum-page[page_no=' + page_no + ']:first');
                if ($page.length == 0) {
                    $page = $('<div class="rum-page" page_no="' + page_no + '" ></div>').hide();
                } else {
                    //$page.find("script").remove();
                    newPage = false;
                    $page.empty();
                }
            }

            var pageData = {url: url, params: params, page_no: page_no};


            var $el = this.element;

            if (self.options.beforeOpen) {
                self.options.beforeOpen.call(null, $page, this);
            }
            $el.trigger("beforeOpen", pageData);

            if (!params) {
                params = {};
            }

            $.ajax({
                url: url,
                data: params,
                success: function (data) {
                    $page.html(data).appendTo(self.element);
                    if (newPage) {
                        if (self.opt.activePage) {

                            self._addHistory(self.opt.activePage);

                            self.opt.activePage.css({ position: "absolute"}).hide("slide", 500, function () {
                                $(this).css({ position: ""});
                            });
                        }
                        self.opt.activePage = $page;
                        $page.css({ position: "absolute"}).show("slide", {direction: "right"}, 500, function () {
                            $(this).css({ position: ""});
                            if (self.options.opened) {
                                self.options.opened.call(null, $page, this);
                            }
                            $el.trigger("opened", $page);
                            $(window).scrollTop(0);
                        });
                    } else {
                        self.opt.activePage = $page;
                        if (self.opt.overlay) {
                            self.opt.overlay.fadeOut(200);
                        }

                        if (self.options.opened) {
                            self.options.opened.call(null, $page, this);
                        }
                        $el.trigger("opened", $page);
                        $(window).scrollTop(0);
                    }
                    $(".transparent_mask").css({"display":"none"});
                },
                beforeSend: function () {
                    if (!newPage) {
                        if (!self.opt.overlay) {
                            self.opt.overlay = $("<div class='overlay'>").html('<div style="width: 50px;margin: 0 auto;"><span class="waitting_icon" style="margin-top:' + $(document).height() * 0.4 + 'px;margin-left: auto;"></span></div>');
                            $el.append(self.opt.overlay);
                        }
                        self.opt.overlay.css({height: $(document).height(), "width": $(document).width()}).fadeTo(200, 0.5);
                    }
                }
            });

            $page.data("pageData", pageData);
        },
        goBack: function () {
            var self = this;
            var $el = this.element;
            if (self.options.beforeBack) {
                self.options.beforeBack.call(null, this.opt.activePage, this);
            }
            $el.trigger("beforeBack");

            if (this.opt.activePage && this.opt.historyPage.length > 0) {
                this.opt.activePage.css({ position: "absolute"}).hide("slide", {direction: "right"}, 500, function () {
                    $(this).css({ position: ""});
                    $(this).remove();
                });
                this.opt.activePage = this.opt.historyPage.pop();
                this.opt.activePage.css({ position: "absolute"}).show("slide", 500, function () {
                    $(this).css({ position: ""});
                    if (self.options.backed) {
                        self.options.backed.call(null, $(this), this);
                    }
                    $el.trigger("backed", $(this).data("pageData"));

                });
            }
        },
        _addHistory: function ($page) {
            this.opt.historyPage.push($page);
        }
    });
})(jQuery);
//初始化，并绑定goback方法
$(".rum_page_container", document).rumPage({opened: function ($newPage) {
    //_initUi($newPage);
    $newPage.find(".goback").on("click", function () {
        $(".rum_page_container:last", document).rumPage("goBack");
    });
}});
return $;
});