/*
selectflag 0代表3天之后不可选
           1代表7天之后不可选
           2代表1月之后不可选
           3代表3月之后不可选
*/
(function($){
    
    var _MID_ = 1;
	$.fn.choicetime = function(options){
		return this.each(function(){
            var $this = $(this);
            var opts = $.extend({},$.fn.choicetime.defaults,options);
            if(!$this.data("ChoiceTime")){               
                if(!opts.name){
                    opts.name = $this.attr("selectName");
                }

                if(!opts.onChange){
                    opts.onChange = $this.attr("onChange"); 
                }

                if(!opts.selectflag){
                    opts.selectflag = $this.attr("selectflag"); 
                }
                if (!opts.timeType) {
                    opts.timeType = $this.attr("timeType");
                }
                if (!opts.timePeriod) {
                    opts.timePeriod = $this.attr("timePeriod");
                }
                if (!opts.timeZone) {
                    opts.timeZone = $this.attr("timeZone");
                }
                if (!opts.endTime) {
                    opts.endTime = $this.attr("endTime");
                }
                if (!opts.contexttype) {
                    opts.contexttype = $this.attr("contexttype");
                }
                if (!opts.reportPeriod) {
                    opts.reportPeriod = $this.attr("reportPeriod");
                }
                if (!opts.tType) {
                    opts.tType = $this.attr("tType");
                }
                opts.url        = $this.attr("url");
                opts.forms      = $this.attr("forms");
                if(!opts.params){
                       var params       = $this.attr("params");
                       if(params){
                         try{
                            opts.params = eval("("+params+")");
                         }catch(e){

                         }
                       }
                }

                $this.data("ChoiceTime",new ChoiceTime($this,opts));
            
            }
            
        });
	}

    $.fn.choicetime.defaults = {
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
        height:220,
        selectn:0
    }
    
    var ChoiceTime = function($el,opts){
        this._$el           = $el;
        this._opts          = opts;
        this.setting    ={
            events  :{}
        };
        this._initTimeForm();
    };

    $.extend(ChoiceTime.prototype,{
        _gId:function(){
            return  "rumselect_"+(_MID_++);
        },

        _initHtml:function(){
            var html = '<div id="time_meun" class="top_date">\
                            <span>'+message_source_i18n.recently+'</span><span id="'+this._gId()+'_show_timePeriod" class="show_timePeriod"></span><span id="'+this._gId()+'_show_endTime" class="show_endTime"></span><span class="icon_down"></span>\
                        </div>\
                        <div id="time_panel" class="time_selection_w" style="margin:30px -400px;display: none;z-index:500;">\
                            <table>\
                                <tr>\
                                    <td>\
                                        <div class="time_font_w">\
                                            <div class="timefont">'+message_source_i18n.timeUpTo+'</div>\
                                            <div class="timenow">\
                                                <input type="radio" class="timeForm_timeType_rel"><span style="margin-top:0px;"> '+message_source_i18n.now+'</span>\
                                            </div>\
                                            <div class="timerel">\
                                                <input class="timeForm_timeType_abs" type="radio"><span style="margin-top:0px;"> '+message_source_i18n.specifiedTime+':</span>\
                                                <input type="text" class="datetimepicker_date" readonly="readonly"/>\
                                                <input type="text" class="datetimepicker_date2" style="width:100px;height:22px;display:none;"/>\
                                                <input type="text" class="datetimepicker_time">\
                                            </div>\
                                        </div>\
                                        <div id="time_close" class="time_selection_close" title="'+message_source_i18n.close+'"></div>\
                                    </td>\
                                </tr>\
                                <tr>\
                                    <td><div class="parting_line"></div></td>\
                                </tr>\
                                <tr>\
                                    <td style="height: 50px" align="center">\
                                        <div class="rumslider" style="width: 90%;float: none;position: relative;">\
                                            <select id="'+this._gId()+'_timeForm_timePeriod" class="timeForm_timePeriod" style="display: none;">\
                                                <option value="30">30'+message_source_i18n.choice_minute+'</option>\
                                                <option value="60">1'+message_source_i18n.choice_hour+'</option>\
                                                <option value="360">6'+message_source_i18n.choice_hour+'</option>\
                                                <option value="720">12'+message_source_i18n.choice_hour+'</option>\
                                                <option value="1440">&nbsp;&nbsp;1'+message_source_i18n.choice_day+'</option>\
                                                <option value="4320">3'+message_source_i18n.choice_day+'</option>\
                                                <option value="10080">7'+message_source_i18n.choice_day+'</option>\
                                                <option value="43200">1'+message_source_i18n.choice_month+'</option>\
                                                <option value="86400">2'+message_source_i18n.choice_month+'</option>\
                                                <option value="129600">3'+message_source_i18n.choice_month+'</option>\
                                            </select>\
                                        </div>\
                                    </td>\
                                </tr>\
                                <tr>\
                                    <td align="center">\
                                        <div id="time_ok" style="margin-top:20px;float: none" class="time_ok btn_demo2a m_top10" onmouseout="this.className='+"'time_ok btn_demo2a m_top10'"+'"\
                                        onmouseover="this.className='+"'time_ok btn_demo2b m_top10'"+'">'+message_source_i18n.settings+'\
                                        </div>\
                                    </td>\
                                </tr>\
                            </table>\
                        </div>';            
            this._$el.append(html);

            $(".timeForm_timePeriod",this._$el).selectToUISlider({
                labels: 10,
                tooltip: false,
                labelSrc: "text",
                style:"circle",
                sliderOptions: {
                    range: "min"
                }
            });

            var flag = parseInt(this._opts.selectflag);
            if(this._opts.contexttype=="app"||this._opts.contexttype=="server"/*||this._opts.contexttype=="sys"*/){
            	if (flag==0) {
                    this._opts.selectn=5;
                }else if (flag==1) {
                    this._opts.selectn=6;
                }else if (flag==2) {
                    this._opts.selectn=7;
                }else if (flag==3) {
                    this._opts.selectn=9;
                };
            }else{
            	this._opts.selectn=9;
            }
            
            for (var i = 0; i <= this._opts.selectn; i++) {
                $(".click_"+i,this.$_el).css({"border-color":"#3598db"});             
            };      
        },

        _initParams:function(){
            var self = this;
            this._opts.data=[];
            if(this._opts.params){
                this._opts.data = serializeArrayObject(this._opts.params);
            }
            if(this._opts.forms){
                var fs   =  this._opts.forms.split(/\s+/);
            	var $fs  =  $(fs.join());
            	if(fs.length>0){
                    this._opts.data  = $.merge(this._opts.data,$fs.serializeArray());
                }
            }
        },

        _initTimeForm:function() {
            var self = this;
            var _time;
            this._initHtml();
            var _time;
            this._initEvents();
            var nh = new Date().getHours(),
                ns = new Date().getMinutes(),
                nowtime = (nh<10? "0"+nh : nh)+":"+(ns<10 ? "0"+ns : ns);
            //input_timePeriod和input_timePeriod两个表单如果没有传值,则赋默认值
            var endTime=new Date();
                endTime= endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+
                (endTime.getDate()<10?"0"+endTime.getDate():endTime.getDate())+" "+
                (endTime.getHours()<10?"0"+endTime.getHours():endTime.getHours())+":"+
                (endTime.getMinutes()<10?"0"+endTime.getMinutes():endTime.getMinutes()); 
            if (this._opts.timePeriod) {
                $(".input_timePeriod",this._$el).val(this._opts.timePeriod);
            }else{
                $(".input_timePeriod",this._$el).val(30);
            };

            if (this._opts.timeType) {
                $(".input_timeType",this._$el).val(this._opts.timeType);
            }else{
                $(".input_timeType",this._$el).val("1");
            };
            
            if (this._opts.endTime && $(".input_timeType",this._$el).val() == "2") {
                $(".input_endTime",this._$el).val(this._opts.endTime);
                _time = this._opts.endTime;
            }else{
                $(".input_endTime",this._$el).val("");
            	_time = endTime;
            };

            var time = {
                timeType: $(".input_timeType",this._$el).val(),
                timePeriod: $(".input_timePeriod",this._$el).val(),
//                endTime: $(".input_endTime",this._$el).val()
                endTime:_time
            };

            $(".time_selection_w",this._$el).data("oldTime", time);
            //每点击一次cricle记录一次值
            $(".time_selection_w",this._$el).data("pre_click", time.timePeriod);
            
            $(".timeForm_timePeriod",this._$el).val(time.timePeriod);
            
            $('.datetimepicker_date2',self.$_el).datepicker({
                autoclose: true,
                'format': 'yyyy-mm-dd'
            });
            var et = time.endTime;
            if (et.indexOf(" ") != -1) {
            	if(et.split(" ")[1]){
                	nowtime = et.split(" ")[1];
                }
                et = et.split(" ")[0];
            };
            $('.datetimepicker_date',self.$_el).datetimeEntry({
                datetimeFormat: "Y-O-D",
                useMouseWheel: true,
                spinnerImage:false
            }).val(et).click(function(){
            	if(!$("[class='datepicker datepicker-dropdown dropdown-menu datepicker-orient-left datepicker-orient-top']",self.$_el).length){
            		$('.datetimepicker_date2',self.$_el).datepicker('show');
            	}
            });

            $('.datetimepicker_date2',self.$_el).datepicker('setDate',et);
            $('.datetimepicker_date2',self.$_el).datepair();

            // initialize input widgets first
            $('.datetimepicker_time',self.$_el).datetimeEntry({
                datetimeFormat: "H:M",
                useMouseWheel: true,
                spinnerImage:false
            }).val(nowtime);

            $(".timeForm_timeType_rel",self.$_el).click(function(){
                $('.datetimepicker_date2',self.$_el).datepicker('hide');
                if ($(".timeForm_timeType_abs",self._$el)[0].checked) {
                    $(".timeForm_timeType_abs",self._$el)[0].checked  = false;
                };
            });
            $(".timeForm_timeType_abs",self.$_el).click(function(){
                $('.datetimepicker_date2',self.$_el).datepicker('show');
                if ($(".timeForm_timeType_rel",self._$el)[0].checked) {
                    $(".timeForm_timeType_rel",self._$el)[0].checked  = false;
                };
            });

            $('.datetimepicker_date2',self.$_el).datepicker()
                .on("hide", function(e){
                    $('.datetimepicker_date',self.$_el).val($('.datetimepicker_date2',self.$_el).val());
                });

            if (time.timeType == "1") {
                $('.timeForm_timeType_rel',self.$_el).trigger('click');
            }else{
                $('.timeForm_timeType_abs',self.$_el).trigger('click');
            };

            //相对时间选中select时的处理
            $(".slider-widget-click",this.$_el).click(function(e){
                var flag = parseInt(self._opts.selectflag);
                var classname = $(e.currentTarget).attr("class");
                if(classname.indexOf("click_0") != -1 && $(".timeForm_timePeriod",self._$el).val()!="30"){
                	$(".timeForm_timePeriod",self._$el).val("30");
                }
                var n = 0;
                if (classname.indexOf("click_") != -1) {
                    n = parseInt(classname.split("click_")[1]);    
                };
                if (n>parseInt(self._opts.selectn)) {
                	$(".timeForm_timePeriod",self._$el).val($(".time_selection_w",self._$el).data("pre_click"));
                	alert(message_source_i18n.time_validate_1);
                    return;
                }else{
                	$(".time_selection_w",this._$el).data("pre_click", $(".timeForm_timePeriod",self._$el).val());
                };
                //先还原回初始化样式
                //全变灰色
                for (var i = 0; i <= 9; i++) {
                    $(".click_"+i,self.$_el).css({background:"#d9d9d9"});             
                };
                //可选的边框蓝
                for (var i = 0; i <= self._opts.selectn; i++) {
                    $(".click_"+i,self.$_el).css({"border-color":"#3598db"});             
                };
                //选中的实心蓝
                for (var i = 0; i <= n; i++) {
                    $(".click_"+i,self.$_el).css({background:"#3598db"});             
                };
                var html = '<div class="ui-slider split-line"></div>';
                $(".slider-split-line",self.$_el).append(html);
                var sliderwidth = $(".slider-split-line",self.$_el).width();
                var leftval = n/($(".slider-split-line",self.$_el).find("li").length-1);
                $(".split-line",self.$_el).css({width:sliderwidth*leftval+"px"});
            });

            $(".top_date",this._$el).click(function () {
                var offset = $(this).offset();
                var time = $(".time_selection_w",self._$el).data("oldTime");
                if (time.timeType == "1") {
                    $(".timeForm_timeType_rel",self._$el)[0].checked  = true;
                    //$('.datetimepicker_date2',self.$_el).datepicker('hide');
                    $(".timeForm_timeType_abs",self._$el)[0].checked  = false;
                } else if (time.timeType == "2") {
                    $(".timeForm_timeType_abs",self._$el)[0].checked  = true;
                    //$('.datetimepicker_date2',self.$_el).datepicker('true');
                    $(".timeForm_timeType_rel",self._$el)[0].checked  = false;
                }
                $(".timeForm_timePeriod",self._$el).val(time.timePeriod);
                //根据返回的时间段值选中相对时间
                switch (parseInt(time.timePeriod)){
                    case 30:
                        for (var i = 0; i <= 0; i++) {
                            $(".click_"+i,self.$_el).css({background:"#3598db"});             
                        };
                        break;
                    case 60:
                        for (var i = 0; i <= 1; i++) {
                            $(".click_"+i,self.$_el).css({background:"#3598db"});             
                        };
                        break;
                    case 360:
                        for (var i = 0; i <= 2; i++) {
                            $(".click_"+i,self.$_el).css({background:"#3598db"});             
                        };
                        break;
                    case 720:
                        for (var i = 0; i <= 3; i++) {
                            $(".click_"+i,self.$_el).css({background:"#3598db"});             
                        };
                        break;
                    case 1440:
                        for (var i = 0; i <= 4; i++) {
                            $(".click_"+i,self.$_el).css({background:"#3598db"});             
                        };
                        break;
                    case 4320:
                        for (var i = 0; i <= 5; i++) {
                            $(".click_"+i,self.$_el).css({background:"#3598db"});             
                        };
                        break;
                    case 10080:
                        for (var i = 0; i <= 6; i++) {
                            $(".click_"+i,self.$_el).css({background:"#3598db"});             
                        };
                        break;
                    case 43200:
                        for (var i = 0; i <= 7; i++) {
                            $(".click_"+i,self.$_el).css({background:"#3598db"});             
                        };
                        break;
                    case 86400:
                        for (var i = 0; i <= 8; i++) {
                            $(".click_"+i,self.$_el).css({background:"#3598db"});             
                        };
                        break;
                    case 129600:
                        for (var i = 0; i <= 9; i++) {
                            $(".click_"+i,self.$_el).css({background:"#3598db"});             
                        };
                        break;
                                                                
                }
                
                $(".time_selection_w table",self._$el).css("display", "block");
                $(".time_selection_w",self._$el).css({
                    "border": "#cccccc 1px solid"
                });
                $(".time_selection_w",self._$el).show().css({
                    "top": offset.top + 30,
                    "left": offset.left - ($(".time_selection_w",self._$el).width() - $(this).width() - 20)
                });

            });

            $(".time_selection_close",this._$el).click(function () {
            	var time = $(".time_selection_w",self._$el).data("oldTime");
            	if(time.timeType==1){
                	$(".timeForm_timeType_abs",self._$el)[0].checked  = false;
                	$(".timeForm_timeType_rel",self._$el)[0].checked  = true;
                	//关闭时间选择
                	$('.datetimepicker_date2',self.$_el).datepicker('hide');
                }else{
                	$(".timeForm_timeType_abs",self._$el)[0].checked  = true;
                	$(".timeForm_timeType_rel",self._$el)[0].checked  = false;
                	$('.datetimepicker_date2',self.$_el).datepicker('true');
                }
            	$(".time_selection_w",self._$el).css("display", "none");
                $(".time_selection_w",self._$el).css({
                    "border": "0",
                    "border-top": "#cccccc 1px solid"
                });
            });
            
            $(".time_ok",this._$el).click(
                function () {
                	var edate = $(".datetimepicker_date2",self._$el).val()+" "+$(".datetimepicker_time",self._$el).val();
                	if($(".timeForm_timeType_rel",self._$el)[0].checked){
                		var eTime=new Date();
                		eTime= eTime.getFullYear()+"-"+(eTime.getMonth()+1)+"-"+
                        (eTime.getDate()<10?"0"+eTime.getDate():eTime.getDate())+" "+
                        (eTime.getHours()<10?"0"+eTime.getHours():eTime.getHours())+":"+
                        (eTime.getMinutes()<10?"0"+eTime.getMinutes():eTime.getMinutes());
                		edate = eTime;
                	}
                	if((self._opts.tType==70 || self._opts.tType==71) && (self._opts.contexttype=="app"||self._opts.contexttype=="server"/*||self._opts.contexttype=="sys"*/)){
            			if($(".timeForm_timeType_abs",self._$el)[0].checked){
            				var tp = parseInt($(".timeForm_timePeriod",self._$el).val());
            				var today=new Date(); // 获取今天时间
            				today.setDate(today.getDate() -self._opts.reportPeriod); // 系统会自动转换
            				today.setHours(0);
            				today.setMinutes(0);
            				today.setSeconds(0);
            				today.setMilliseconds(0);
            				
            				var date_array=edate.split(" ");
            				var str_array1=date_array[0].split("-");
            				var str_array2=date_array[1].split(":");
            				var choosedate=new Date(parseInt(str_array1[0]),parseInt(str_array1[1])-1,parseInt(str_array1[2]),parseInt(str_array2[0]),parseInt(str_array2[1]),0);
            				choosedate.setTime(choosedate.getTime()-tp*60*1000);
            				if(choosedate.getTime()-today.getTime()<0){
            					alert(message_source_i18n.time_validate_2);
            					return;
            				}
            			}
            		}
                    var newTime = {
                        timeType: $(".timeForm_timeType_rel",self._$el)[0].checked ? "1" : "2",
                        timePeriod: $(".timeForm_timePeriod",self._$el).val(),
                        endTime: edate
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
                            //把choicetime插件中得表单绑定到关联得form表单中(input_timePeriod input_endTime)
                            if ($(".input_timeType",self._$el)) {
                                $(".input_timeType",self._$el).val(newTime.timeType);
                            };
                            if ($(".input_endTime",self._$el)) {
                                $(".input_endTime",self._$el).val(newTime.endTime)
                            };
                            if ($(".input_timePeriod",self._$el)) {
                            	$(".input_timePeriod",self._$el).val(newTime.timePeriod);
                                
                            };
                            self._initParams();
                            var url  = self._opts.url;
                            if(!url){
                                return null;
                            }
                            $.ajax({
                                url     :url,
                                data    :self._opts.data||{},
                                dataType:"text",
                                type:"post",
                                error   :function(XMLHttpRequest,textStatus,errorThrown) {

                                        },
                                success :function(data, textStatus, jqXHR){
                                    try{    
                                        $(".time_selection_w",self._$el).data("oldTime", newTime);
                                        $("#timePeriod").trigger("change");
                                        self._initShow(self._$el);
                                        if (window.timeFormChangeCallback
                                                && $
                                                        .isFunction(window.timeFormChangeCallback)) {
                                            window.timeFormChangeCallback.call(
                                                    window, newTime);
                                        }
                                        //下面也有一个相同的加载代码 与这段代码重复
                                        /*if ( typeof reLoadInstances === 'function') {//重新加载应用实例信息
    	                                    reLoadInstances();
    	                                }*/
                                    }catch(e){
                                        console.log(message_source_i18n.data_validate_message_1+e.message);
                                        return;
                                    }
                                }
                            });
                            
                        }
                        if(newTime.timeType==1){//为相对时间时，将endTime置为null
                       	 $(".input_endTime",self._$el).val('');
                       }
                        if(newTime.timeType==1){
                        	$(".timeForm_timeType_abs",self._$el)[0].checked  = false;
                        	$(".timeForm_timeType_rel",self._$el)[0].checked  = true;
                        	//关闭时间选择
                        	 $('.datetimepicker_date2',self.$_el).datepicker('hide');
                        }else{
                        	$(".timeForm_timeType_abs",self._$el)[0].checked  = true;
                        	$(".timeForm_timeType_rel",self._$el)[0].checked  = false;
                        	 $('.datetimepicker_date2',self.$_el).datepicker('true');
                        }
                        $(".time_selection_w",self._$el).css("display", "none");
                        $(".time_selection_w",self._$el).css({
                            "border": "0",
                            "border-top": "#cccccc 1px solid"
                        });
                        
                        //$(".time_selection_close",this._$el).trigger('click');
                        if ( typeof servers === 'function') {//调用应用概览页的servers(),刷新服务器列表
                            servers();
                       }
                       if ( typeof reLoadInstances === 'function') {//重新加载应用实例信息
                          reLoadInstances();
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
            if ($(".input_timeType",$el).val() == "2") {
                $(".show_endTime",$el).text(
                                "(" + $(".input_endTime",self._$el).val() + ")");
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

})(jQuery)