define(function(require, exports,modules){
	require("../../js/datetimeentry/jquery.datetimeentry.js");
	require("../../../base/jqueryui/jquery.selectToUISlider.js");
(function($){
    var _MID_ = 1;
	$.fn.selecttime = function(options){
		return this.each(function(){
            var $this = $(this);
            var opts = $.extend({},$.fn.selecttime.defaults,options);
            if(!$this.data("SelectTime")){               
                if(!opts.name){
                    opts.name = $this.attr("selectName");
                }

                if(!opts.onChange){
                    opts.onChange = $this.attr("onChange"); 
                }

                opts.onlyTimePeriod = ("true"==$this.attr("onlyTimePeriod"));

                $this.data("SelectTime",new SelectTime($this,opts));
            
            }
            
        });
	}

    $.fn.selecttime.defaults = {
        name  :null,
        classz:null,
        params:null,
        formId:null,
        setting : {
            data    :[]
        },    
        width :  460,
        leftWidth:200,
        rightWidth:200,
        height:220
    }
    
    var SelectTime = function($el,opts){
        this._$el           = $el;
        this._opts          = opts;
        this.setting    ={
            events  :{}
        };
        this._initTimeForm();
    };

    $.extend(SelectTime.prototype,{
        _gId:function(){
            return  "rumselect_"+(_MID_++);
        },

        _initHtml:function(){
            var html = '<div id="time_meun" class="top_date">\
                            <span>最近</span><span id="'+this._gId()+'_show_timePeriod" class="show_timePeriod"></span><span id="'+this._gId()+'_show_endTime" class="show_endTime"></span><span class="icon_down"></span>\
                        </div>\
                        <div id="time_panel" class="time_selection_w" style="margin:30px -400px; display: none;">\
                            <table>\
                                <tr>\
                                    <td>\
                                        <div class="time_font_w">\
                                            <input id="timeForm_timeType" class="timeForm_timeType" name="timeType" type="hidden">\
                                            <span class="time_font01">截止到现在</span>\
                                            <div id="time_type" class="time_type time_button01"></div>\
                                            <span class="time_font02">自定义时间</span>\
                                        </div>\
                                        <div id="time_close" class="time_selection_close" title="关闭"></div>\
                                    </td>\
                                </tr>\
                                <tr>\
                                    <td style="height: 50px" align="center">\
                                        <div class="rumslider" style="width: 90%;float: none;position: relative;">\
                                            <select id="'+this._gId()+'_timeForm_timePeriod" class="timeForm_timePeriod" style="display: none;">\
                                                <option value="30">30分</option>\
                                                <option value="60">1小时</option>\
                                                <option value="360">6小时</option>\
                                                <option value="720">12小时</option>\
                                                <option value="1440">&nbsp;&nbsp;1天</option>\
                                                <option value="4320">3天</option>\
                                                <option value="10080">7天</option>\
                                                <option value="43200">1月</option>\
                                                <option value="86400">2月</option>\
                                                <option value="129600">3月</option>\
                                            </select>\
                                        </div>\
                                    </td>\
                                </tr>\
                                <tr>\
                                    <td>\
                                        <div id="time_pick_panel" class="end_time" style="display: none">\
                                            <div class="end_time_font1">截止时间</div>\
                                            <div class="end_time_n">\
                                                <input id="timeForm_endTime" type="text" readonly="readonly" class="end_time_input m_top10">\
                                                <div id="'+this._gId()+'_datapicker" class="end_time_calendar rumdatepicker"></div>\
                                            </div>\
                                        </div>\
                                    </td>\
                                </tr>\
                                <tr>\
                                    <td align="center">\
                                        <div id="time_ok" style="float: none" class="time_ok btn_demo2a m_top10" onmouseout="this.className='+"'time_ok btn_demo2a m_top10'"+'"\
                                        onmouseover="this.className='+"'time_ok btn_demo2b m_top10'"+'">设置\
                                        </div>\
                                    </td>\
                                </tr>\
                                <tr>\
                                    <td>\
                                        <div class="time_zone">\
                                            <div class="time_zone_font1">\
                                                &nbsp\
                                            </div>\
                                            <div class="time_zone_font2">\
                                            </div>\
                                            <div class="time_zone_font3">\
                                                &nbsp\
                                            </div>\
                                        </div>\
                                    </td>\
                                </tr>\
                            </table>\
                        </div>';
            if (this._opts.onlyTimePeriod) {
                html = '<div class="rumslider" style="width: 270px;position: relative;margin-left:10px;">\
                            <select id="'+this._gId()+'_timeForm_timePeriod" class="timeForm_timePeriod" style="display: none;">\
                                <option value="2">2</option>\
                                <option value="3">3</option>\
                                <option value="4">4</option>\
                                <option value="5">5</option>\
                                <option value="6">6</option>\
                                <option value="7">7</option>\
                                <option value="8">8</option>\
                                <option value="9">9</option>\
                                <option value="10">10</option>\
                            </select>\
                        </div>';
            };                
            this._$el.append(html);
        },

        _initTimeForm:function() {
            this._initHtml();
            this._initEvents();
            var self = this;
            //input_timePeriod和input_timePeriod两个表单如果没有传值,则赋默认值
            var endTime=new Date();
                endTime.setMonth(endTime.getMonth()+1);
                endTime= endTime.getFullYear()+"-"+endTime.getMonth()+"-"+endTime.getDate()+" "+endTime.getHours()+":"+endTime.getMinutes(); 
            if (this._opts.timePeriod) {
                $(".input_timePeriod",this._$el).val(this._opts.timePeriod);
            }else{
                $(".input_timePeriod",this._$el).val(30);
            };
            if (this._opts.endTime) {
                $(".input_endTime",this._$el).val(this._opts.endTime);
            }else{
                $(".input_endTime",this._$el).val(endTime);
            };
            //开始时间
            var edate = new Date(($(".input_endTime",this._$el).val()).replace(/-/g, "/")).getTime();
            var dvalue = parseInt($(".input_timePeriod",this._$el).val())*60*1000;
            var startTime = new Date(edate-dvalue);
                startTime.setMonth(startTime.getMonth()+1);
                startTime= startTime.getFullYear()+"-"+startTime.getMonth()+"-"+startTime.getDate()+" "+startTime.getHours()+":"+startTime.getMinutes();
            $(".input_startTime",this._$el).val(startTime);

            var time = {
                timeType: this._opts.timeType,
                timePeriod: $(".input_timePeriod",this._$el).val(),
                endTime: $(".input_endTime",this._$el).val()
            };

            $(".time_selection_w",this._$el).data("oldTime", time);

            $(".timeForm_timeType",this._$el).val(time.timeType);
            $(".timeForm_timePeriod",this._$el).val(time.timePeriod);
            $(".end_time_input",this._$el).val(time.endTime);

            $(".timeForm_timePeriod",this._$el).selectToUISlider({
                labels: 10,
                tooltip: false,
                labelSrc: "text",
                sliderOptions: {
                    range: "min"
                }
            });
            $(".end_time_input",this._$el).datetimeEntry({
                datetimeFormat: "Y-O-D H:M",
                useMouseWheel: true,
                maxDatetime: new Date()
            }).change(
                    function () {
                        var date = new Date(Date.parse($(this).val().replace(/-/g, "/")));
                        if (date && !isNaN(date)) {
                            $(".end_time_calendar",self._$el).datepicker("setDate", date);
                        }
                    });
            $(".end_time_calendar",this._$el).datepicker(
                    { 
                        maxDate: new Date(),  
                        dateFormat: "yy-mm-dd",
                        onSelect: function (dateText) {
                            var e = $(".end_time_input",self._$el).val();
                            if (e.length > 0) {
                                var i = e.indexOf(" ");
                                $(".end_time_input",self._$el).val(dateText + e.substring(i, e.length));
                            } else {
                                $(".end_time_input",self._$el).val(dateText);
                            }
                        }
                    });
            //$(".time_selection_w",this._$el).appendTo("body");
            $(".top_date",this._$el).click(
                    function () {
                        var offset = $(this).offset();
                        var time = $(".time_selection_w",self._$el).data("oldTime");
                        if (time.timeType == "1") {
                            $(".timeForm_timeType",self._$el).val(2);
                            $(".time_type",self._$el).trigger("click");
                        } else if (time.timeType == "2") {
                            $(".timeForm_timeType",self._$el).val(1);
                            $(".time_type",self._$el).trigger("click");
                            if (time.endTime && time.endTime.length > 0) {
                                $(".end_time_input",self._$el).val(time.endTime);
                                var date = new Date(time.endTime.replace(/-/g, "/"));
                                if (date && !isNaN(date)) {
                                    $(".end_time_calendar",self._$el).datepicker("setDate", date);
                                }
                            }

                        }
                        $(".timeForm_timePeriod",self._$el).val(time.timePeriod);
                        
                        $(".time_selection_w table",self._$el).css("display", "block");
                        //$(".time_selection_w").attr("class","time_selection_w");
                        $(".time_selection_w",self._$el).css({
                            "border": "#cccccc 1px solid"
                        });
                        $(".time_selection_w",self._$el).show().css(
                                {
                                    "top": offset.top + 30,
                                    "left": offset.left - ($(".time_selection_w",self._$el).width() - $(this).width() - 20)
                                });

                    });
            $(".time_selection_close",this._$el).click(function () {
                $(".time_selection_w",self._$el).css("display", "none");
                $(".time_selection_w",self._$el).css({
                    "border": "0",
                    "border-top": "#cccccc 1px solid"
                });
            });
            $(".time_ok",this._$el)
                    .click(
                    function () {
                        var edate = new Date(($(".end_time_input",self._$el).val()).replace(/-/g, "/")).getTime();
                        var dvalue = parseInt($(".timeForm_timePeriod",self._$el).val())*60*1000;
                        var startTime = new Date(edate-dvalue);
                            startTime.setMonth(startTime.getMonth()+1);
                            startTime= startTime.getFullYear()+"-"+startTime.getMonth()+"-"+startTime.getDate()+" "+startTime.getHours()+":"+startTime.getMinutes();
                        var newTime = {
                            timeType: $(".timeForm_timeType",self._$el).val(),
                            timePeriod: $(".timeForm_timePeriod",self._$el)
                                    .val(),
                            endTime: $(".end_time_input",self._$el).val(),
                            startTime:startTime
                        };

                        


                        var oldTime = $(".time_selection_w",self._$el).data("oldTime");
                        var change = false;
                        if (oldTime.timeType != newTime.timeType
                                || oldTime.timePeriod != newTime.timePeriod
                                || oldTime.endTime != newTime.endTime) {
                            change = true;
                        }
                        //不做action请求 预留change事件
                        if (change) {
                            //把selecttime插件中得表单绑定到关联得form表单中(input_timePeriod input_endTime) 

                            if ($(".input_timePeriod",self._$el)) {
                                $(".input_timePeriod",self._$el).val(newTime.timePeriod);
                            };
                            if ($(".input_endTime",self._$el)) {
                                $(".input_endTime",self._$el).val(newTime.endTime)
                            };
                            if ($(".input_startTime",self._$el)) {
                                $(".input_startTime",self._$el).val(newTime.startTime)
                            };


                            $(".time_selection_w",self._$el).data("oldTime", newTime);
                            /*$.post(self._opts.url,
                                    newTime);*/
                            self._initShow(self._$el);
                            if (window.timeFormChangeCallback
                                    && $
                                            .isFunction(window.timeFormChangeCallback)) {
                                window.timeFormChangeCallback.call(
                                        window, newTime);
                            }
                        }

                        $(".time_selection_w table",self._$el).css("display", "none");
                        $(".time_selection_w",self._$el).css({
                            "border": "0",
                            "border-top": "#cccccc 1px solid"
                        });
                    });

            $(".time_type",this._$el).click(
                    function () {
                        if ($(".timeForm_timeType",self._$el).val() == "1") {
                            $(this).removeClass("time_button01");
                            $(this).addClass("time_button02");
                            $(".end_time",self._$el).slideDown();
                            $(".timeForm_timeType",self._$el).val(2);
                            $(".end_time_input",self._$el).datetimeEntry("setDatetime",
                                    time.endTime);
                            var date = new Date(time.endTime.replace(/-/g, "/"));
                                if (date && !isNaN(date)) {
                                    $(".end_time_calendar",self._$el).datepicker("setDate", date);
                                }
                        } else if ($(".timeForm_timeType",self._$el).val() == "2") {
                            $(this).removeClass("time_button02");
                            $(this).addClass("time_button01");
                            $(".end_time",self._$el).slideUp();
                            $(".timeForm_timeType",self._$el).val(1);
                            $(".end_time_input",self._$el).val("");
                        }
                    });
            this._initShow(this._$el);
        },

        //初始化事件
        _initEvents:function(){
            var self = this;
        
            if(this._opts.onChange){
                if($.isFunction(this._opts.onChange)){
                    this.setting.events.onChange = this.opts.onChange;
                }else if(typeof this._opts.onChange == "string"){
                    var f;
                    try{
                        f = eval(this._opts.onChange);
                    }catch(e){
                        
                    }
                    if($.isFunction(f)){
                        this.setting.events.onChange = f;
                    }
                }
            }
        },

        _initShow:function($el) {
            var self = this;
            $(".show_timePeriod",$el).text(
                    $(".timeForm_timePeriod",$el).find("option:selected").text());
            if ($(".timeForm_timeType",$el).val() == "2") {
                $(".show_endTime",$el).text(
                                "(" + $(".end_time_input",$el).val() + ")");
            } else {
                $(".show_endTime",$el).text("");
            }

            this._$el.data("chart",this);
            if(this.setting.events.onChange){
                setTimeout(function(){
                    try{
                        self.setting.events.onChange.call(self);
                    }catch(e){
                    
                    }
                    
                },1000);
            }

        }

    });

    function clientTimeZone() {
        var munites = new Date().getTimezoneOffset();
        var hour = parseInt(munites / 60);
        var munite = munites % 60;
        var prefix = "-";
        if (hour < 0 || munite < 0) {
            prefix = "+";
            hour = -hour;
            if (munite < 0) {
                munite = -munite;
            }
        }

        hour = hour + "";
        munite = munite + "";
        if (hour.length == 1) {
            hour = "0" + hour;
        }
        if (munite.length == 1) {
            munite = "0" + munite;

        }
        return prefix + hour + munite;
    }

    function serializeArrayObject(obj){
        var data =[];
        $.each(obj,function(i,v){
                if($.isArray(v)){
                    $.each(v,function(ii,vv){
                            data.push({name:i,value:vv});
                    });
                }else{
                    data.push({name:i,value:v});
                }
        });
        return data;
    }

})(jQuery);
return $;
});