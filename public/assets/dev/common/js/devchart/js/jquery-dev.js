/**{
		版本 1.2
		duration:		19.2, 毫秒
		action			"",
		appVersion		"",
		os				"",
		phone			"",
		city			"",
		isp				"",
		speed			"",
		time			"",

		memory:			{data:[{time:1200,value:20.0}],avg:100,unit:"MB"},
		cpu:   			{data:[{time:1200,value:20.0}],avg:100,unit:"%"},
		network:   		{data:[{startTime:1200,endTime:1300,url:"",duration:{value:10,unit:""},bytes:{up:20,down:30,unit:""},result:"200"}],unit:"calls"},
		Main thread:	{
							id,
							data:[
								{id,pid,startTime:1200,endTime:1300,value:"",data:[{startTime:1200,endTime:1300,value:""},{startTime:1200,endTime:1300,value:""}] }
							]
							,unit:""
						}
		threads			[
						 	{	id,
								name,
								data:[
									{id,pid,startTime:1200,endTime:1300,value:"",data:[{startTime:1200,endTime:1300,value:""},{startTime:1200,endTime:1300,value:""}] }
								],
								pId,
								unit:""
							}
						]
   }
 */
define(function(require, exports,modules){
require("../css/jquery.dev.css");
(function ($) {

    var defaults ={
        chartWidth : null,
        chartHeight: null,
        url		     : null,
        chartType  : null
    };

    var methods = {
        init : function (options) {
            return  this.each(function(){
                var $this = $(this);
                var opts  = $.extend(true,{}, defaults, options);
                opts.chartWidth = $this.attr("chartWidth");
                opts.chartHeight= $this.attr("chartHeight");
                opts.url	 	= $this.attr("url");
                opts.forms	 	= $this.attr("forms");
                if(!opts.chartType){
                    opts.chartType = $this.attr("chartType");
                }
                if(!opts.params){
                    var params		= $this.attr("params");
                    if(params){
                        try{
                            //opts.params = $.paresJSON(params);
                            opts.params = eval("("+params+")");
                        }catch(e){

                        }
                    }
                }

                opts.autoRefresh= $this.attr("autoRefresh")=="true";
                opts.logoUrl	= $this.attr("logoUrl");
                var onClick		= $this.attr("onClick");
                if(onClick){
                    if($.isFunction(onClick)){
                        opts.onClick = onclick;
                    }else{
                        try{
                            onClick = eval(onClick);
                        }catch(e){

                        }
                        if($.isFunction(onClick)){
                            opts.onClick = onClick;
                        }
                    }
                }

                var onClickMain		= $this.attr("onClickMain");
                if(onClickMain){
                    if($.isFunction(onClickMain)){
                        opts.onClickMain = onClickMain;
                    }else{
                        try{
                            onClickMain = eval(onClickMain);
                        }catch(e){

                        }
                        if($.isFunction(onClickMain)){
                            opts.onClickMain = onClickMain;
                        }
                    }
                }
                var onClickSon		= $this.attr("onClickSon");
                if(onClickSon){
                    if($.isFunction(onClickSon)){
                        opts.onClickSon = onClickSon;
                    }else{
                        try{
                            onClickSon = eval(onClickSon);
                        }catch(e){

                        }
                        if($.isFunction(onClickSon)){
                            opts.onClickSon = onClickSon;
                        }
                    }
                }

                var onComplete		= $this.attr("onComplete");
                if(onComplete){
                    if($.isFunction(onComplete)){
                        opts.onComplete = onComplete;
                    }else{
                        try{
                            onComplete = eval(onComplete);
                        }catch(e){

                        }
                        if($.isFunction(onComplete)){
                            opts.onComplete = onComplete;
                        }
                    }
                }

                var	chart = $this.data("chart");
                if(chart&&chart instanceof DevChart){
                    chart.reDraw();
                }else{
                    chart = new DevChart($this,opts);
                    $this.data("chart",chart);
                    chart.draw();
                }

            });
        }
    };
    $.fn.rumDevChart = function () {
        var method ;
        var opts;
        if(arguments.length==0){
            method = "init";
            opts   = {};
        }else if( arguments.length==1&&typeof arguments[0] == "object"){
            method = "init";
            opts   = {};
        }else if(arguments.length==2&&typeof arguments[0] == "string" && typeof arguments[1] == "object"){
            method = arguments[0];
            opts   = arguments[1];
        }

        if (methods[method]) {
            return methods[method].call(this,opts);
        }else {
            $.error('Method ' + method + ' does not exist on jQuery.rpcchart');
        }
    };




    function DevChart(el,opts){
        this._opts 				= opts;
        this._el   				= el;
        this._headerHeight		= 80;
        this._headerBodyMargin	= 40;

        this._footerHeight		= 10 + 20;
        this._titleWidth		= 150;
        this._toolTip			= new EevChartToolTip(this);
        this._data				= null;

    }
    DevChart.prototype._initEl =function(){
        if(this._el){
            if(typeof this._el =="string"  ){
                this._$el  = $("#"+this._el);
                this._elId = this._el;
            }else if(this._el instanceof jQuery){
                this._$el = this._el;
            }else if(typeof this._el =="object"){
                this._$el = $(this._el);
            }
            if(!this._$el.attr("id")){
                var id = "rumDevChartId" + (new Date()).valueOf();
                this._$el.attr("id",id);
            }
            this._elId = this._$el.attr("id");
            this._$el.css({"padding":0});
        }
    }

    DevChart.prototype._initParams=function(r){
        var self = this;
        if(r||!this._opts.data){
            this._opts.data=[];
        }
        if(this._opts.params){
            this._opts.data = serializeArrayObject(this._opts.params);
        }
        if(this._opts.forms){
            var fs 	 =  this._opts.forms.split(/\s+/);
            var $fs	 =	$(fs.join());
            if(fs.length>0){
                this._opts.data  = $.merge(this._opts.data,$fs.serializeArray());
                if(this._opts.autoRefresh&&!r){
                    $fs.change(function(e){
                        self.reDraw();
                    });
                }
            }
        }
    }


    //计算宽度高度
    DevChart.prototype._caculateWidth=function(r){
        if(r){
            this._$el.empty();
        }
        var w = 0;
        if(this._opts.chartWidth){
            if(this._opts.chartWidth.indexOf("%")>0){
                w = this._$el.innerWidth() * ( parseFloat(this._opts.chartWidth.substring(0,this._opts.chartWidth.indexOf("%"))) / 100.0) ;
            }else{
                w = this._opts.chartWidth;
            }
        }else{
            w	= this._$el.innerWidth();
        }
        this._opts.width  =  w;
    }
    //计算高度
    DevChart.prototype._caculateHeight=function(r){
        if(r){
            this._$el.empty();
        }
        var h=0;
        if(this._opts.chartHeight){
            if(this._opts.chartHeight.indexOf("%")>0){
                h = this._$el.innerHeight() * ( parseFloat(this._opts.chartHeight.substring(0,this._opts.chartHeight.indexOf("%"))) / 100.0) ;
            }else{
                h = this._opts.chartHeight;
            }
        }else{
            h	= this._$el.innerHeight();
        }
        if(isNaN(h)){
            h=200;
        }
        if(h==0){
            h = 500;
        }
        this._opts.height =	 Math.max(h ,this._getInnerHeight()+this._headerHeight+this._footerHeight+this._headerBodyMargin)
    }

    DevChart.prototype._initPaper = function(){
        this._$elc = $("<div></div>");
        this._$elc.css({"text-align":"left","padding":0,"width":this._opts.width,"margin":"0px auto"});
        this._$el.append(this._$elc);
        this._paper  = Raphael(this._$elc[0],this._opts.width ,this._opts.height);
        this._paper.renderfix();
    }

    DevChart.prototype._createMouseLine = function(){

    }

    DevChart.prototype._getData = function(r){
        var self = this;
        if(!this._opts.url){
            return;
        }
        $.ajax({
            url:this._opts.url,
            type:"post",
            dataType:"text",
            data	:this._opts.data||[],
            error:function(){
                //alert(2);
            },
            success:function(data){
                var o = null;
                try{
                    o = eval("("+data+")");
                }catch(e){
                    try{
                        o = eval(data);
                    }catch(ee){

                    }
                }
                if(o){
                    self._data = o;
                    self._renderAfterGetData(r,o);
                }

            }
        });
    }

    //生成对象获取实际高度
    DevChart.prototype._useData = function(data){
        data.memory.duration = data.duration;
        data.cpu.duration = data.duration;
        this._memory		= new DevLine(data.memory,this._opts.width,message_source_i18n.memory);
        this._cpu		= new DevLine(data.cpu,	  this._opts.width,"CPU");
        this._network	= new DevMuBar(data.network,this._opts.width,message_source_i18n.network);

        //this._mainThread	= new DevBar(data.mainThread,this._opts.width,"主线程",this._opts.onClickMain);

        this._threads	= [];
        for(var i=0;i<data.threads.length;i++){
            this._threads.push(new DevBar(data.threads[i],this._opts.width,data.threads[i].name,this._opts.onClickSon,this._$el,this));
        }
    }
    //获取对象的高度
    DevChart.prototype._getInnerHeight = function(){
        var height = 0;
        if(this._memory){
            height += this._memory.getHeight();
        }
        if(this._cpu){
            height += this._cpu.getHeight();
        }
        if(this._network){
            height += this._network.getHeight();
        }
        /**
         if(this._mainThread){
			height += this._mainThread.getHeight();
		}
         */
        if(this._threads.length>0){
            height += this._threads[0].getHeight()*this._threads.length;
        }
        return  height;
    }


    DevChart.prototype._render =function(r){
        this._initEl();
        this._initParams(r);
        this._getData(r);
        this._caculateWidth();

    }
    DevChart.prototype._renderAfterGetData = function(r,data){
        var self = this;
        this._useData(data);
        this._caculateHeight(r);
        this._createRuler(data);
        this._initPaper(r);
        this._createBackGround();
        this._createTickets(data);
        this._createCursor();
        this._initBackGroundMouseOver();

        this._renderHeader(r,data);
        this._renderChart(r,data);

        if(this._opts.onComplete){
            setTimeout(function(){
                try{
                    self._opts.onComplete.call(self,self);
                }catch(e){

                }
            },1000)
        }


    }

    DevChart.prototype._renderHeader = function(r,data){
        if(this._headSet){
            this._headSet.remove();
        }
        this._headSet = this._paper.set();

        var action	  = this._paper.text(10,10,data.action);
        action.attr({"stroke":"#4d4d4d","font-size":22,"text-anchor":"start"})

        var duration  	   = this._paper.text(5,40,data.duration/1000+"s");
        duration.attr({"stroke":"#4d4d4d","font-size":18,"text-anchor":"start"});
        var durationTitle  = this._paper.text(5,60,message_source_i18n.interaction_time);
        durationTitle.attr({"stroke":"#999999","font-size":12,"text-anchor":"start"});

        var w	= 5 + Math.max(duration.getBBox().width,durationTitle.getBBox().width)+20;
        var appVersion	= 	this._paper.text(w,40,data.appVersion);
        appVersion.attr({"stroke":"#4d4d4d","font-size":18,"text-anchor":"start"});
        var appVersionTitle	= this._paper.text(w,60,message_source_i18n.app_version);
        appVersionTitle.attr({"stroke":"#999999","font-size":12,"text-anchor":"start"});


        w += Math.max(appVersion.getBBox().width,appVersionTitle.getBBox().width)+30;
        var osVersion	= 	this._paper.text(w,40,data.osVersion);
        osVersion.attr({"stroke":"#4d4d4d","font-size":18,"text-anchor":"start"});
        var osVersionTitle	= this._paper.text(w,60,message_source_i18n.sys_version);
        osVersionTitle.attr({"stroke":"#999999","font-size":12,"text-anchor":"start"});


        w += Math.max(osVersion.getBBox().width,osVersionTitle.getBBox().width)+30;
        var agentVersion	= 	this._paper.text(w,40,data.agentVersion);
        agentVersion.attr({"stroke":"#4d4d4d","font-size":18,"text-anchor":"start"});
        var agentVersionTitle	= this._paper.text(w,60,message_source_i18n.sdk_version);
        agentVersionTitle.attr({"stroke":"#999999","font-size":12,"text-anchor":"start"});


        w += Math.max(agentVersion.getBBox().width,agentVersionTitle.getBBox().width)+30;
        var phone	= 	this._paper.text(w,40,data.phone);
        phone.attr({"stroke":"#4d4d4d","font-size":18,"text-anchor":"start"});
        var phoneTitle	= this._paper.text(w,60,message_source_i18n.model_version);
        phoneTitle.attr({"stroke":"#999999","font-size":12,"text-anchor":"start"});


        w += Math.max(phone.getBBox().width,phoneTitle.getBBox().width)+30;
        var city	= 	this._paper.text(w,40,data.city);
        city.attr({"stroke":"#4d4d4d","font-size":18,"text-anchor":"start"});
        var cityTitle	= this._paper.text(w,60,message_source_i18n.regional);
        cityTitle.attr({"stroke":"#999999","font-size":12,"text-anchor":"start"});


        w += Math.max(city.getBBox().width,cityTitle.getBBox().width)+30;
        var isp	= 	this._paper.text(w,40,data.isp);
        isp.attr({"stroke":"#4d4d4d","font-size":18,"text-anchor":"start"});
        var ispTitle	= this._paper.text(w,60,message_source_i18n.operators);
        ispTitle.attr({"stroke":"#999999","font-size":12,"text-anchor":"start"});

        w += Math.max(isp.getBBox().width,ispTitle.getBBox().width)+30;
        var speed	= 	this._paper.text(w,40,data.speed);
        speed.attr({"stroke":"#4d4d4d","font-size":18,"text-anchor":"start"});
        var speedTitle	= this._paper.text(w,60,message_source_i18n.access_style);
        speedTitle.attr({"stroke":"#999999","font-size":12,"text-anchor":"start"});

        w += Math.max(speed.getBBox().width,speedTitle.getBBox().width)+30;
        var time	= 	this._paper.text(w,40,data.time);
        time.attr({"stroke":"#4d4d4d","font-size":18,"text-anchor":"start"});
        var timeTitle	= this._paper.text(w,60,message_source_i18n.time);
        timeTitle.attr({"stroke":"#999999","font-size":12,"text-anchor":"start"});

    }

    DevChart.prototype._renderChart = function(){
        var h = this._headerHeight + this._headerBodyMargin;
        this._memory.render(this._paper,this._ruler);
        this._memory.transform("..t0,"+h);
        h += this._memory.getHeight();
        this._cpu.render(this._paper,this._ruler);
        this._cpu.transform("..t0,"+h);
        h += this._cpu.getHeight();
        this._network.render(this._paper,this._ruler);
        this._network.transform("..t0,"+h);
        h += this._network.getHeight();
        /**
         this._mainThread.render(this._paper,this._ruler);
         this._mainThread.transform("..t0,"+h);
         h += this._mainThread.getHeight();
         */
        for(var i=0;i<this._threads.length;i++){
            this._threads[i].render(this._paper,this._ruler);
            this._threads[i].transform("..t0,"+h);
            h += this._threads[i].getHeight();
        }
    }

    DevChart.prototype._createBackGround = function(){
        //this._backGround = this._paper.rect(0, 0, this._opts.width, this._opts.height);
        //this._backGround.attr({"fill":"rgba(153,238,255,0.5)"});
    }

    DevChart.prototype._createTickets = function(data){
        var s = 0;
        for(i=0;i<=50;i++){
            if(i%10==0){
                continue;
            }
            var v 		= s+data.duration/50*i;
            var x 		= this._ruler.getP(v);
            var top		= this._headerHeight+this._headerBodyMargin ;
            var bottom	= this._opts.height -this._footerHeight		;
            var mline	= this._paper.path("M"+x+","+top+"L"+x+","+bottom);
            mline.attr({"stroke-width":"1","stroke-dasharray":"--","opacity":0.1});
            mline.translate(0.5, 0.5);
        }
        s = 0;
        var jx =  Math.ceil(data.duration/10);
        for(var i=0;i<=10;i++){
            var v = s+jx*i;
            var x 		= this._ruler.getP(v);
            var top		= this._headerHeight+this._headerBodyMargin -10;
            var bottom	= this._opts.height -this._footerHeight	+10;
            var gline	= this._paper.path("M"+x+","+top+"L"+x+","+bottom);
            gline.attr({"stroke-width":1,"opacity":0.2});
            gline.translate(0.5, 0.5);

            if(i<10){
                var text =  this._paper.text(x,bottom+10,v);
                var text =  this._paper.text(x,top-10,v);
            }


        }
    }

    DevChart.prototype._createCursor = function(){
        this._cursorSet = this._paper.set();
        var top			= this._headerHeight+this._headerBodyMargin;
        var bottom		= this._opts.height - this._footerHeight   ;
        var  cursorLine = this._paper.path("M"+(0)+", "+(top)+"L"+(0)+", "+(bottom));
        var tap			= "M"+(0)+", "+top+"L"+(0-5)+", "+(top-5)+"L"+(0+5)+" ,"+(top-5) +"L"+(0)+" ,"+top +" Z" ;
        var ta			= this._paper.path( tap);
        var bap			= "M"+(0)+", "+bottom+"L"+(0-5)+", "+(bottom+5)+"L"+(0+5)+" ,"+(bottom+5) +"L"+(0)+" ,"+bottom +" Z" ;
        var ba			= this._paper.path( bap);



        this._cursorSet.push(cursorLine,ta,ba)
        this._cursorSet.attr({"stroke-width":0,"fill":"#e73f97"});
        cursorLine.attr({"stroke-width":1,"stroke":"#e73f97"})
        cursorLine.translate(0.5,0.5);
    }
    DevChart.prototype._initBackGroundMouseOver = function(){
        /**
         var self = this;
         var backGround = this._paper.rect(this._titleWidth, this._headerHeight+this._headerBodyMargin, this._opts.width - this._titleWidth,this._getInnerHeight());
         backGround.attr({fill:"#FFFFFF",opacity:0});
         $(backGround.node).attr("id","n11")
         $("#n11").on("mouseenter",function(){
				self._cursorSet.show();
			}).on("mouseleave",function(){
				self._cursorSet.hide();
			}).on("mousemove",function(e){
				self._cursorSet.transform("T"+(e.pageX-self._opts.width-6)+",0");
			});

         */


        var self 	= this;
        var offset	= $(this._$elc).offset();
        var width	= $(this._$elc).width();
        $(this._paper.canvas).on("mousemove",function(e){

            var x	= e.pageX - offset.left;
            var y	= e.pageY - offset.top;

            if(x > self._titleWidth && (y>self._headerHeight+self._headerBodyMargin)){
                self._cursorSet.show();
                //self._cursorSet.transform("T"+(e.pageX-self._opts.width-6)+",0");
                //console.log(x);
                self._cursorSet.transform("t"+(x)+",0");
                self._toolTip.changeData(self._getTooltipData(x));

                var w = self._toolTip.width();
                var toX = e.pageX +20,
                    toY = e.pageY +20;
                if(x+w>width){
                    toX = e.pageX - w -40 ;
                }


                self._toolTip.move(toX,toY);
                self._toolTip.show();

                self._cpu.showPoint(x);
                self._memory.showPoint(x);
            }else{
                //console.log("超出范围关闭");
               self._cursorSet.hide();
                self._toolTip.hide();
                self._cpu.hidePoint();
                self._memory.hidePoint();
            }

        }).on("mouseover",function(){

        }).on("mouseleave",function(){
            self._toolTip.hide();
            self._cursorSet.hide();
            self._cpu.hidePoint();
            self._memory.hidePoint();
        });


    }
    DevChart.prototype._mousemoveEventForCursor = function(){

    }

    DevChart.prototype._getTooltipData = function(x){
        var data = {};
        //data.duration 	= this._data.duration;
        data.time 		= this._ruler.getV(x);
        data.memory	= this._memory.getData(x);
        data.cpu	  	= this._cpu.getData(x);
        data.network  	= this._network.getData(x);
        /**
         data.mainThread	= this._mainThread.getData();
         */
        for(var i=0; i<this._threads.length;i++){
            data.thread   = this._threads[i].getData();
            if(data.thread!=null){
                break;
            }
        }
        return data;
    }

    DevChart.prototype._createRuler = function(data){
        this._ruler = new Ruler(this._titleWidth,this._opts.width-this._titleWidth,data.duration,0,10);
    }


    DevChart.prototype.draw=function(){
        this._render(false);
    }

    DevChart.prototype.reDraw=function(){
        this._render(true);
    }

    DevChart.prototype.getData=function(){
        return this._data;
    }

////////////////////////////////////////////////////




    function DevLine(data,width,title){
        this._data 	   	  = data;
        this._height   	  = 100;
        this._width		  = width;
        this._titleWidth  = 150;

        this._pointSet	  = null;
        this._lineSet  	  = null;
        this._borderSet	  = null;
        this._headSet	  = null;
        this._title		  = title;

        this._type		  = "rectangle"
        this._activePoint = -1;
        this._fix(this._data);
    }
    //
    DevLine.prototype._fix =function(data){
        //  data.data.unshift({time:0,value:0});
        //  data.data.push({time:data.duration,value:data.data[data.data.length-1].value});
    }

    DevLine.prototype.render=function(paper,rulerX){
        if(this._pointSet){
            this._pointSet.remove();
        }
        if(this._lineSet){
            this._lineSet.remove();
        }
        this._pointSet = paper.set();
        this._lineSet  = paper.set();

        this._renderLine(paper,rulerX);
        this._renderBorder(paper);
        this._renderHead(paper);
    }

    DevLine.prototype._renderLine=function(paper,rulerX){
        var rulerY  = new  Ruler(0,this._height,this._getMaxData()*1.2);
        var points	= [];
        if(this._data&&this._data.data.length>0){
            for(var i=0;i<this._data.data.length;i++){
                points.push({x:rulerX.getP(this._data.data[i].time) ,y:this._height - rulerY.getP(this._data.data[i].value),value:this._data.data[i].value});
            }
        }
        this._points = points;

        var pathS = "";
        if(this._type=="line"){
            for(var i=0;i<points.length;i++){
                var T = "M";
                if(i>0){
                    T = "L";
                }
                pathS += T+points[i].x+","+points[i].y;
            }
        }else{
            for(var i=0;i<points.length;i++){
                if(i==0){
                    pathS += "M"+points[i].x+","+points[i].y;
                }else{
                    pathS += "L"+points[i].x+","+points[i-1].y;
                    pathS += "L"+points[i].x+","+points[i].y;
                }

            }
        }




        this._lineSet.push(paper.path(pathS));
        this._lineSet.attr({"stroke":"#7cb5ec","stroke-width":3});

        this._pointPics = [];
        for(var i=0;i<points.length;i++){
            var outer = paper.circle(points[i].x,points[i].y,8);
            outer.attr({"stroke":"#7cb5ec","stroke-width":0,fill:"#7cb5ec","opacity":0.5});
            outer.hide();
            var inner = paper.circle(points[i].x,points[i].y,4);
            inner.attr({"stroke":"#7cb5ec","stroke-width":0,fill:"#7cb5ec"});
            inner.hide();
            this._pointSet.push(inner,outer);
            this._pointPics.push({inner:inner,outer:outer});
        }

        this._pointSet.mouseover(function(){
            //console.log("进入点")
        });

    }

    DevLine.prototype._renderHead=function(paper){
        if(this._headSet){
            this._headSet.remove();
        }
        this._headSet = paper.set();
        var title = paper.text(10,16,this._title);
        title.attr({"text-anchor":"start","font-family":"宋体 Arial","font-size":18,stroke:"#4d4d4d"});
        var avgText = message_source_i18n.avg+"："+this._data.avg.toFixed(2)+this._data.unit;
        if(this._data.avgRate){
            avgText+="/"+this._data.avgRate.toFixed(2)+"%";
        }
        var avg = paper.text(6,this._height-10,avgText);
        avg.attr({"text-anchor":"start","font-family":"宋体 Arial","font-size":12,stroke:"#999999"});

        this._headSet.push(title,avg);

    }
    DevLine.prototype._renderBorder=function(paper){
        if(this._borderSet){
            this._borderSet.remove();
        }
        this._boderSet		= paper.set();
        var topBorder 	 	= paper.path("M0,0L"+this._width+",0");
        var bottomBorder 	= paper.path("M0,"+this._height+"L"+this._width+","+this._height);
        var titleBorder		= paper.path("M"+this._titleWidth+","+0+"L"+this._titleWidth+","+this._height);

        this._boderSet.push(topBorder,bottomBorder,titleBorder);
        this._boderSet.attr({"stroke-width":1,"fill-opacity":0});
        this._boderSet.translate(0.5, 0.5);
    }

    DevLine.prototype.getHeight=function(){
        return  this._height;
    }

    DevLine.prototype._getMaxData=function(){
        var data = 0;
        if(this._data&&this._data.data.length>0){
            for(var i=0;i<this._data.data.length;i++){
                if(this._data.data[i].value>data){
                    data = this._data.data[i].value;
                }
            }
        }
        return data;
    }
    DevLine.prototype.transform =function(m){
        this._pointSet.transform(m);
        this._lineSet.transform(m);
        this._boderSet.transform(m);
        this._headSet.transform(m);
    }
    //获取离X最近的最小值
    DevLine.prototype.getData = function(x){
        var xj 		= 0;
        var point	= null;
        for(var i=0;i<this._points.length;i++){
            var nxj = x - this._points[i].x ;
            //console.log("x:"+x +"p:"+this._points[i].x );
            if(nxj>0&&(xj==0||(nxj<xj))){
                xj=nxj;
                point = this._points[i];
            }
        }
        if(point){
            return point.value;
        }else{
            return 0;
        }
    }
    DevLine.prototype.showPoint = function(x){
        var xj 		= 0;
        var index	= 0;
        for(var i=0;i<this._points.length;i++){
            var nxj = x - this._points[i].x ;
            if(nxj>0&&(xj==0||(nxj<xj))){
                xj=nxj;
                index =i;
            }
        }
        if(this._activePoint==index){
            return;
        }
        if(this._activePoint>=0){
            this._pointPics[this._activePoint].inner.hide();
            this._pointPics[this._activePoint].outer.hide();
        }
        this._pointPics[index].inner.show();
        this._pointPics[index].outer.show();
        this._activePoint=index;

    }
    DevLine.prototype.hidePoint = function(){
        if(this._activePoint>=0){
            this._pointPics[this._activePoint].inner.hide();
            this._pointPics[this._activePoint].outer.hide();
        }
        this._activePoint =-1;
    }

    /////////////////////////////////////////
    function DevBar(data,width,title,onClick,$el,devChart){
        this._data 		= data;
        this._bars 		= [];
        this._height	= 50;
        this._titleWidth=150;
        this._width		= width;
        this._useData();
        this._barSet    = null;
        this._barWidth	= this._height - 4;
        this._title		= title;
        this._headSet	= null;
        this._onClick	= onClick;
        this._$el		= $el;
        this._devChart	= devChart;
    }

    DevBar.prototype.render=function(paper,ruler){
        var self =this;
        if(this._barSet!=null){
            this._barSet.remove();
        }
        this._barSet = paper.set();
        for(var i =0; i<this._bars.length;i++){
            var s = ruler.getP(this._bars[i].startTime);
            var e = ruler.getP(this._bars[i].endTime);
            if(e-s<1){
                e = s+1;
            }
            
            var text = self._data.data[i].methodName || "";
            //console.log(text);
            var methodNameText = "";
            var fontSize = 12;
            var textLength = text.length;
            var barLength = (e-s);
            if( textLength * fontSize < barLength ){
            	methodNameText = text;
            }else{
            	var fontCount = (Math.floor(barLength / fontSize))-3;
            	methodNameText = text.substring(0, fontCount);
            	//console.log(methodNameText);
            	if(methodNameText != ""){
            		methodNameText += "...";
            	}
            }
            var te = paper.text(s,this._height/4,methodNameText).attr({"font-size": fontSize+"px","text-anchor":"start"});
            
            var b = paper.path("M"+s+"," + (this._height/2) +"L"+e+"," + (this._height/2 )) ;
            b.attr({"stroke-width":this._barWidth,"stroke":"#536879","opacity":0.6});
            b.data("hoverIndex",i);
            
            (function(index){
            	b.touchend(function(event){
					if(self._onClick){
						self._onClick.call(self,self._data.data[index]);
					}
					self._showMethodToolTip(self._data.data[index],event,self._barSet[index]);
				});
                b.click(function(event){
                    if(self._onClick){
                        self._onClick.call(self,self._data.data[index]);
                    }
                	self._showMethodToolTip(self._data.data[index],event,self._barSet[index*2+1]);
                });
            })(i);

            this._barSet.push(te);
            this._barSet.push(b);
            this._bars[i]._path = b;
        }
        this._barSet.mouseover(function(){
            self._hoverIndex = this.data("hoverIndex");
            this.attr("opacity",0.8);
            var  bar = self._bars[this.data("hoverIndex")];
            if(bar.data.threadPid>0){
                self.hoverParent(bar.data.threadPid,bar.data.methodPid,true);
            }
        });
        this._barSet.mouseout(function(){
            self._hoverIndex = -1;
            this.attr("opacity",0.6);
            var  bar = self._bars[this.data("hoverIndex")];
            if(bar.data.threadPid>0){
                self.hoverParent(bar.data.threadPid,bar.data.methodPid,false);
            }
        });

        this._renderBorder(paper);
        this._renderHead(paper);
    }

    DevBar.prototype.hoverParent=function(threadId,methodId,hover){
        for(var i=0;i<this._devChart._threads.length;i++){
            if(this._devChart._threads[i]._data.id==threadId){
                this._devChart._threads[i].hoverHead(hover);
                this._devChart._threads[i].hoverMethod(methodId,hover);
            }
            break;
        }
    }

    DevBar.prototype.hoverHead=function(hover){
        if(hover){
            this._headBackground.show();
        }else{
            this._headBackground.hide();
        }
    }

    DevBar.prototype.hoverMethod=function(methodId,hover){
        for(var i=0;i<this._bars.length;i++){
            if(this._bars[i].data.methodId = methodId ){
                if(hover){
                    this._bars[i]._path.data("ostroke",this._bars[i]._path.attr("stroke"));
                    this._bars[i]._path.attr("stroke","#e64d3d");
                }else{
                    this._bars[i]._path.attr("stroke",this._bars[i]._path.data("ostroke"));
                }
            }
            break;
        }
    }

    DevBar.prototype._renderHead=function(paper){
        if(this._headSet){
            this._headSet.remove();
        }
        this._headSet = paper.set();

        var headerBackground = paper.rect(0,0,this._titleWidth,this._height);
        headerBackground.attr({fill:"#987653"});
        this._headSet.push(headerBackground);
        headerBackground.hide();
        this._headBackground = headerBackground;

        var title = paper.text(10,18,"");
        title.attr({"text-anchor":"start","font-family":"宋体 Arial","font-size":18,stroke:"#4d4d4d"});
        Until.warpText(title,this._title,this._titleWidth-40);
        this._headSet.push(title);
        var title_name = this._title;
        var self = this;
        this._headSet.mouseover(function(event){
        	if(!self._$titleToolTip){
                var html = '<div id="devchart_title_tooltip"  class="devchart-title-tooltip" >'+title_name+'</div>';
                self._$titleToolTip = $(html).appendTo("body");
        	}
        	self._$titleToolTip.css({left:event.pageX+5,top:event.pageY+18}).show();
        });
        this._headSet.mouseout(function(){
        	self._$titleToolTip.hide();
        });
    }

    DevBar.prototype._useData=function(paper){
        for(var i=0;i<this._data.data.length;i++){
            var bar = {startTime:this._data.data[i].startTime,endTime:this._data.data[i].endTime,level:0,data:this._data.data[i]};
            this._bars.push(bar);
        }
    }

    DevBar.prototype.transform=function(s){
        this._barSet.transform(s);
        this._boderSet.transform(s);
        this._headSet.transform(s);
    }

    DevBar.prototype.getHeight=function(){
        return  this._height;
    }
    DevBar.prototype.getData=function(){
        if(this._hoverIndex>-1){
            return {name:this._data.name, data:this._bars[this._hoverIndex].data};
        }
        return null;

    }
    DevBar.prototype._renderBorder=function(paper){
        if(this._borderSet){
            this._borderSet.remove();
        }
        this._boderSet		= paper.set();
        var topBorder 	 	= paper.path("M0,0L"+this._width+",0");
        var bottomBorder 	= paper.path("M0,"+this._height+"L"+this._width+","+this._height);
        var titleBorder		= paper.path("M"+this._titleWidth+","+0+"L"+this._titleWidth+","+this._height);

        this._boderSet.push(topBorder,bottomBorder,titleBorder);
        this._boderSet.attr({"stroke-width":1});
        this._boderSet.translate(0.5, 0.5);
    };
    DevBar.prototype._getDataHtml =function(data,level,pdata){
        var self = this;
        var trs = "";
        if(typeof level =="undefined"){
            level = 0;
        }else{
            level++;
        }
        if(!pdata){
            pdata = data;
            trs += this._createTr(data,pdata);
        }

        if(data.data&&data.data.length>0){
            $.each(data.data,function(k,d){
                trs += self._createTr(d,pdata,level);
                if(d.data&& d.data.length>0){
                    trs+= self._getDataHtml(d,level,pdata);
                }
            });
        }
        return trs;
    };
    DevBar.prototype._createTr =function(d,pdata,level){
        var tr = "";
        var length = ( (d.endTime-d.startTime)/(pdata.endTime-pdata.startTime )*100 ).toFixed(2);
        if(isNaN(length)){
            length =0;
        }else if(length<1){
            length = 1;
        }
        var marginLeft  = ( (d.startTime-pdata.startTime)/(pdata.endTime-pdata.startTime ) *100).toFixed(2);
        var methodName = d.url? d.url: d.methodName;
        if(isNaN(marginLeft)){
            marginLeft =0;
        }
        tr += 		'<tr>';
        tr +=			'<td class="method-name">';
        tr +=			'	<span class="level'+level+'" style="margin-left:'+(10+level*10)+'px;font-size:'+(12-level)+'px" >'+methodName+'</span>';
        tr +=			'</td>';
        tr +=			'<td class="offset" >'+(d.startTime)+'ms</td>';
        tr +=			'<td class="bargraph with_delimiter">';
        tr +=				'<div class="bar-wrapper"><div class="css-bar-chart '+(d.url?'network-bar':'')+'"><div style="width: '+length+'%; margin-left: '+marginLeft+'%">&nbsp;</div><span>'+length+'%</span></div></div>'
        tr +=				'<span class="duration_ms">('+(d.endTime-d.startTime)+' ms)</span>';
        tr +=			'</td>';
        tr +=		'</tr>';
        return tr;
    };
    DevBar.prototype._showMethodToolTip =function(data,event,path){
        if(this._$el._oldPath == path){
            return;
        }
        var self  =this;
        path.data("ostroke",path.attr("stroke"));
        if(!this._$elc){
            this._$elc = this._$el.find(">div");
        }
        path.attr("stroke","#90e699");
        if(this._$el._oldPath){
            this._$el._oldPath.attr("stroke",this._$el._oldPath.data("ostroke"));
        }
        this._$el._oldPath = path;

        if(!this._$el._$methodToolTip){
            var html = '<div id="devchart_method_tooltip"  class="devchart-method-tooltip" style="width: 1374.890625px;">\
								<!-- <div class="arrow" style="left: 712.2415771484375px;"></div> -->\
								<div class="tooltip-header">\
									<div class="duration">\
										<div id="duration" class="duration-value" ></div>\
										<div class="duration-title">'+message_source_i18n.process_time+'</div>\
										<a class="close-button" href="javascript:void(0)" title="'+message_source_i18n.close+'"></a>\
									</div>\
									<div>\
										<span id="tooltip-title" class="tooltip-title" ></span>\
									</div>\
								</div>\
								<table class="method-table" id="method_table">\
									<thead>\
										<tr>\
											<th class="label">'+message_source_i18n.method_name+'</th>\
											<th width="100">'+message_source_i18n.begin_time+'</th>\
											<th width="250">'+message_source_i18n.process_time+'</th>\
										</tr>\
									</thead>\
									<tbody>\
									</tbody>\
								</table>\
							</div>';
            this._$el._$methodToolTip = $(html).appendTo("body");
            this._$el._$methodToolTip.width(this._width).find("#duration");
            this._$el._$methodToolTip.find(".close-button").on("click touchend",function(){
                self._$el._$methodToolTip.hide();
                self._$el._show=false;
                if(self._$el._oldPath){
                    self._$el._oldPath.attr("stroke",self._$el._oldPath.data("ostroke"));
                    self._$el._oldPath =null;
                }

            });

        }

        if(!data._methodTooltipHtml){
            if(data){
                data._methodTooltipHtml = this._getDataHtml(data);
            }else{
                data._methodTooltipHtml="";
            }
        }
        this._$el._$methodToolTip.find("#tooltip-title").text(data.methodName);
        this._$el._$methodToolTip.find("#duration").text(data.duration);
        this._$el._$methodToolTip.find("#method_table tbody").empty().append(data._methodTooltipHtml);
        this._$el._$methodToolTip.css({left:this._$elc.offset().left,top:event.pageY}).show();
        this._$el._show = true;

    };


/////////////////////////////////////////////////////////////////////

    function DevMuBar(data,width,title){
        this._data 		= data;
        this._bars 	 	= [];
        this._height	= 100;
        this._width		= width;
        this._barSet	= null;
        this._titleWidth=150;
        this._barWidth	= 10;
        this._headSet	= null;
        this._title		= title;
        this._hoverIndex=-1;
        this._useData();

    }

    DevMuBar.prototype._useData=function(paper){
        for(var i=0;i<this._data.data.length;i++){
            var bar = {startTime:this._data.data[i].startTime,endTime:this._data.data[i].endTime,level:0,data:this._data.data[i]};
            for(var j=0;j<this._bars.length;j++){
                if(Until.overlap(this._data.data[i].startTime,this._data.data[i].endTime,this._bars[j].startTime,this._bars[j].endTime)){
                    if(bar.level<=this._bars[j].level){
                        bar.level = this._bars[j].level+1;
                    }

                }
            }
            this._bars.push(bar);
        }

        var max = 0;
        for(var i =0; i<this._bars.length;i++){
            if(this._bars[i].level>max){
                max = this._bars[i].level;
            }
        }

        if(max>3){
            this._height = (max)*16+20;
        }else{
            this._height = (3)*16+20;
        }


    };




    DevMuBar.prototype.render=function(paper,ruler){
        var self = this;
        if(this._barSet!=null){
            this._barSet.remove();
        }
        this._barSet = paper.set();
        for(var i=0; i<this._bars.length;i++){
            this._bars[i].sx = ruler.getP(this._bars[i].startTime);
            this._bars[i].ex = ruler.getP(this._bars[i].endTime);
        }
        for(var i =0; i<this._bars.length;i++){
            var b = paper.path("M"+this._bars[i].sx+"," + (this._height - this._bars[i].level*15 -this._barWidth/2 -2) +"L"+this._bars[i].ex+"," + (this._height - this._bars[i].level*15 -this._barWidth/2 -2)     ) ;
            b.attr({"stroke-width":10,"stroke":"#f39d12","opacity":0.8});
            b.data("hoverIndex",i);
            this._barSet.push(b);
        }
        this._barSet.mouseover(function(){
            self._hoverIndex = this.data("hoverIndex");
            this.attr("opacity",1);
        });
        this._barSet.mouseout(function(){
            self._hoverIndex = -1;
            this.attr("opacity",0.8);
        });

        this._renderBorder(paper);
        this._renderHead(paper);
    }

    DevMuBar.prototype.getData=function(x){
        var data  = {data:null};
        var calls = 0;
        for(var i=0;i<this._bars.length;i++){
            if(this._bars[i].sx<=x&&this._bars[i].ex>=x){
                calls++;
            }
        }
        data.calls = calls;
        if(this._hoverIndex >-1){
            data.data = this._bars[this._hoverIndex].data;
        }
        return data;
    }



    DevMuBar.prototype.getHeight=function(){
        return this._height;
    }
    DevMuBar.prototype.transform=function(s){
        this._barSet.transform(s);
        this._boderSet.transform(s);
        this._headSet.transform(s);
    }

    DevMuBar.prototype._renderBorder=function(paper){
        if(this._borderSet){
            this._borderSet.remove();
        }
        this._boderSet		= paper.set();
        var topBorder 	 	= paper.path("M0,0L"+this._width+",0");
        var bottomBorder 	= paper.path("M0,"+this._height+"L"+this._width+","+this._height);
        var titleBorder		= paper.path("M"+this._titleWidth+","+0+"L"+this._titleWidth+","+this._height);

        this._boderSet.push(topBorder,bottomBorder,titleBorder);
        this._boderSet.attr({"stroke-width":1});
        this._boderSet.translate(0.5, 0.5);
    }

    DevMuBar.prototype._renderHead=function(paper){
        if(this._headSet){
            this._headSet.remove();
        }
        this._headSet = paper.set();



        var title = paper.text(10,16,this._title);
        title.attr({"text-anchor":"start","font-family":"宋体 Arial","font-size":18,stroke:"#4d4d4d"});
        this._headSet.push(title);

        //this._headerBackground = headerBackground;
    }


    function Ruler(marge,length,value,panddingLeft,panddingRight){
        this._marge 		= marge;
        this._length		= length;
        this._value 		= value;
        this._panddingLeft	= panddingLeft||0;
        this._panddingRight	= panddingRight||0
    }

    Ruler.prototype.getP = function(v){
        if(this._value==0){
            return this._marge + this._panddingLeft;
        }

        if(v<0){
            v =0;
        }
        if(v>this._value){
            v = this._value;
        }
        if(v>this._value){
            return  -1;
        }else{
            return this._marge + this._panddingLeft + v/this._value* (this._length - this._panddingLeft - this._panddingRight);
        }
    }

    Ruler.prototype.getV = function(p){
        if(p<0){
            p =0;
        }
        if(p>this._length+this._marge){
            p = this._length +this._marge;
        }

        return parseInt((p - this._marge)/(this._length - this._panddingLeft - this._panddingRight)*this._value,10);// - this._panddingLeft;

    }


    function EevChartToolTip(devChart){
        this._chart  = devChart;
        this._$html = null;
        this._init();
    }
    /**
     EevChartToolTip.prototype._init = function(){
		var html = '<div class="devChartToolTip" style="position:absolute;z-index:1000;border:#f39d12 2px solid;opacity :0.9;display:none" >\
						<table>\
							<tr>\
								<td class="span_th">时间</td>\
								<td id="duration" ></td>\
							<tr>\
							<tr>\
								<td class="span_th">内存</td>\
								<td id="memory" ></td>\
							<tr>\
							<tr>\
								<td class="span_th">Cpu</td>\
								<td id="cpu"  ></td>\
							<tr>\
							<tr>\
								<td class="span_th">网络请求</td>\
								<td id="calls" ></td>\
							<tr>\
							<tr class="devChartToolTip_network" >\
								<td class="span_th">请求地址</td>\
								<td id="network_url" ></td>\
							<tr>\
							<tr class="devChartToolTip_network" >\
								<td class="span_th">耗时</td>\
								<td id="network_duration" ></td>\
							<tr>\
							<tr class="devChartToolTip_network" >\
								<td class="span_th">字节(上传/下载):</td>\
								<td id="network_bytes"></td>\
							<tr>\
							<tr class="devChartToolTip_network" >\
								<td class="span_th">响应结果:</td>\
								<td id="network_result" ></td>\
							<tr>\
							<tr class="mainThread" >\
								<td class="span_th">方法名称:</td>\
								<td id="mainThread_methodName" >主线程</td>\
							<tr>\
							<tr class="mainThread" >\
								<td class="span_th">处理时间:</td>\
								<td id="mainThread_duration" ></td>\
							<tr>\
							<tr class="thread" >\
								<td class="span_th">方法名称:</td>\
								<td id="thread_methodName" ></td>\
							<tr>\
							<tr class="thread" >\
								<td class="span_th">处理时间:</td>\
								<td id="thread_duration" ></td>\
							<tr>\
						</table>\
					<div>';
		this._$html = $(html);
		this._$html.appendTo("body");

	}
     **/
    EevChartToolTip.prototype._init = function(){
        var html = '<div class="dev-chart-tooltip" style="position:absolute;z-index:1000;opacity :1;display:none"  >\
					<div  class="arrow" ></div>\
					<div  class="number-block-box">\
						<div class="number_block line">\
							<div class="value-box">\
								<span id="duration" class="value" ></span>\
								<span id="duration_unit" class="unit">ms</span>\
							</div>\
							<div class="value-name">'+message_source_i18n.time+'</div>\
						</div>\
						<div class="number_block line">\
							<div class="value-box">\
								<span id="memory"  class="value"></span>\
								<span id="memory_unit" class="unit"></span>\
							</div>\
							<div class="value-name">'+message_source_i18n.memory+'</div>\
						</div>\
						<div class="number_block line">\
							<div class="value-box">\
								<span id="cpu"  class="value"></span>\
								<span id="cpu_unit"  class="unit"></span>\
							</div>\
							<div class="value-name">CPU</div>\
						</div>\
						<div class="number_block">\
							<div class="value-box">\
								<span id="network-value" class="value"></span>\
								<span id="network_unit"  class="unit"></span>\
							</div>\
							<div class="value-name">'+message_source_i18n.http_request+'</div>\
						</div>\
					</div>\
					<div  class="thread">\
						<p>\
							<span>\
								<strong id="thread_methodName" class="thread-method-name"></strong>\
							</span>\
							<br>\
							<span>'+message_source_i18n.begin_time+':</span>\
							<span id="thread_method_startTime" ></span>\
							<span>Ms</span>\
							<br>\
							<span>'+message_source_i18n.process_time+':</span>\
							<span id="thread_duration"></span>\
							<span>Ms</span>\
						</p>\
					</div>\
					<div class="network-panel">\
							<table class="network-table">\
								<thead>\
									<tr>\
										<th>'+message_source_i18n.request_url+'</th>\
										<th>'+message_source_i18n.process_time+'</th>\
										<th class="network_updown">'+message_source_i18n.bytes+'</th>\
										<th>'+message_source_i18n.response_result+'</th>\
									</tr>\
								</thead>\
								<tbody>\
									<tr id="index_24" class="">\
											<td id="network_url" class="network-url" ></td>\
											<td class="network-duration"><span id="network_duration" ></span></td>\
											<td class="network-bytes" id="network_bytes" ></td>\
											<td class="network-http-status" id="network-http-status"></td>\
									</tr>\
								</tbody>\
							</table>\
					</div>\
				</div>';
        this._$html = $(html);
        this._$html.appendTo("body");
    };
    EevChartToolTip.prototype.show =function(){
        if(this._chart._$el._show){
            return;
        }
        this._$html.show();
    }
    EevChartToolTip.prototype.hide =function(){
        this._$html.hide();
    }
    EevChartToolTip.prototype.width =function(){
        return this._$html.width();
    }

    EevChartToolTip.prototype.changeData = function(data){
        //this._$html.find("#duration").text((data.duration)+" ms");
        this._$html.find("#duration").text(data.time);
        this._$html.find("#duration_unit").text(" ms");
        this._$html.find("#memory").text(data.memory);
        this._$html.find("#memory_unit").text("MB");
        this._$html.find("#cpu").text(data.cpu);
        this._$html.find("#cpu_unit").text("%");
        this._$html.find("#network-value").text(data.network.calls);
        this._$html.find("#network_unit").text(message_source_i18n.count);
        if(data.network.data){
            this._$html.find(".network-panel").show();
            this._$html.find("#network_url").text(data.network.data.url);
            this._$html.find("#network_duration").text(data.network.data.duration.value+" ms");
            this._$html.find("#network_bytes").text(data.network.data.bytes.up+"/"+data.network.data.bytes.down+message_source_i18n.bytes);
            this._$html.find("#network-http-status").text(data.network.data.httpStatus);
        }else{
            this._$html.find(".network-panel").hide();
        }
        /**
         if(data.mainThread){
				this._$html.find(".mainThread").show();
			   	this._$html.find("#mainThread_methodName").text(data.mainThread.data.methodName);
				this._$html.find("#mainThread_duration").text(data.mainThread.data.value+" ms");
			}else{
				this._$html.find(".mainThread").hide();
			}
         */
        if(data.thread){
            this._$html.find(".thread").show();
            this._$html.find("#thread_methodName").text(data.thread.data.methodName);
            this._$html.find("#thread_method_startTime").text(data.thread.data.startTime);
            this._$html.find("#thread_duration").text(data.thread.data.duration);
        }else{
            this._$html.find(".thread").hide();
        }

    }
    EevChartToolTip.prototype.move = function(x,y){
        this._$html.css({left:x,top:y});
    }

    var Until = {
        overlap: function(a , b ,A,B){
            //if(  (y1>=x1&&y1<=x2) || (y2>=x1&&y2<=x2) || (y1>=x1&&y2<x2)     ){
            //if(  (x1>=y1&&x1<=y2)||(x2>=y1&&x2<=y2)||(y1>=x1&&y2<=x2)||(y2>=x1&&y2<=x2)     ){
            if(Math.max(b, B) - Math.min(a, A)   <   (b - a) + (B - A)){
                return true;
            }else{
                return false;
            }
        },
        warpText:function(text,textStr,width){
            var tempString ="";
            for(var i=0;i<textStr.length;i++){
                tempString+=textStr.charAt(i);
                text.attr("text",tempString);
                if(text.getBBox().width>width){
                    tempString = tempString.substring(0,tempString.length);
                    tempString+="...";
                    text.attr("text",tempString);
                    break;
                }
            }
            text.attr(tempString);
        }
    }

})(jQuery);
return $;
});