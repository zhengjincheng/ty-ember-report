//版本1.3_s_.1

/**
* 后台传输参数的类型
 {
	pageLoadingTime		:10,


	networkTime	    	:1,


	blockingTime		:2,


	codeTime			:3,


	//不显示 -1
	outServerTime		:4,

	dataBaseTime		:5,

	memoryCatchTime		:6,

	mongodbTime			:2,

	redisTime			:20,

	threshold			:[0,5,10]

}


*/
define(function(require, exports,modules){
	require("../jquery.json.js");
(function ($) {
	var defaults ={
		chartWidth : null,
		chartHeight: null,
		url		   : null,
		root	   : null,
		chartType  : null,

		toolTipUrls:{
					blockingTimeUrl		   :null,
					codeTimeUrl	   		   :null,
					outServerTimeUrl	   :null,
					dataBaseTimeUrl	   	   :null,
					memoryCatchTimeUrl	   :null,
					mongodbTimeUrl	   	   :null,
					redisTimeUrl	   	   :null
		}
	};
	var colors 		={g1:"#7aa228",g2:"#e0d90e",g3:"#e64d3d",noData:"#9a9a9a",performance:"#4DA2C6"};
	var dashlinecolor="#4DA2C6";
	var colorsInfo 	={g1:message_source_i18n.excellent,g2:message_source_i18n.general,g3:message_source_i18n.intolerable,noData:message_source_i18n.no_data,performance:message_source_i18n.performance};
	var threshold	=[0,500,2000];


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

						if(!opts.toolTipUrls.blockingTimeUrl){
							opts.toolTipUrls.blockingTimeUrl = $this.attr("blockingTimeUrl");
						}

						if(!opts.toolTipUrls.codeTimeUrl){
							opts.toolTipUrls.codeTimeUrl = $this.attr("codeTimeUrl");
						}
						if(!opts.toolTipUrls.outServerTimeUrl){
							opts.toolTipUrls.outServerTimeUrl = $this.attr("outServerTimeUrl");
						}

						if(!opts.toolTipUrls.dataBaseTimeUrl){
							opts.toolTipUrls.dataBaseTimeUrl 	= $this.attr("dataBaseTimeUrl");
						}

						if(!opts.toolTipUrls.memoryCatchTimeUrl){
							opts.toolTipUrls.memoryCatchTimeUrl	= $this.attr("memoryCatchTimeUrl");
						}

						if(!opts.toolTipUrls.mongodbTimeUrl){
							opts.toolTipUrls.mongodbTimeUrl	= $this.attr("mongodbTimeUrl");
						}

						if(!opts.toolTipUrls.redisTimeUrl){
							opts.toolTipUrls.redisTimeUrl	= $this.attr("redisTimeUrl");
						}




						opts.autoRefresh= $this.attr("autoRefresh")=="true";
						opts.logoUrl	= $this.attr("logoUrl");
						var onClick		= $this.attr("onClick");
						if(onClick){
							if($.isFunction(onClick)){
								opts.onClick = onclick;
							}else{
								try{
									onClick = eval(onClick)
								}catch(e){

								}
								if($.isFunction(onClick)){
									opts.onClick = onClick;
								}
							}
						}
				var	chart = $this.data("chart");
				if(chart&&chart instanceof ApdexChart){
					chart.reDraw();
				}else{
					chart = new ApdexChart($this,opts);
					chart.draw();
				}

			});
		}
	};
	$.fn.rumApdexChart = function () {
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
	$.fn.rumApdexChart.defaults	= defaults;
	function ApdexChart(el,options){
		this._opts  			= options;
		this._ratio 			= 1;
		this._el    			= el;
		this._$el   			= null;
		this._elId  			= null;
		this._h	    			= 200;
		this._w	    			= 400;
		this._root				= options.root||_ctx_+"/assets/"+tyConfig.path+"/common/js/apdexchart";
	}

	ApdexChart.prototype._initEl=function(){

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
				var id = "rumChinaMapId" + (new Date()).valueOf();
				this._$el.attr("id",id);
			}
			this._elId = this._$el.attr("id");
		}
	}

	//计算比例
	ApdexChart.prototype._caculateRatio=function(r){
			this._$el.data("chart")

			if(r){
				this._$el.empty();
			}
			var w = 0,h=0;
			if(this._opts.chartWidth){
				if(this._opts.chartWidth.indexOf("%")>0){
					w = this._$el.innerWidth() * ( parseFloat(this._opts.chartWidth.substring(0,this._opts.chartWidth.indexOf("%"))) / 100.0) ;
				}else{
					w = this._opts.chartWidth;
				}
			}else{
				w	= this._$el.innerWidth();
			}

			if(this._opts.chartHeight){
				if(this._opts.chartHeight.indexOf("%")>0){
					h = this._$el.innerHeight() * ( parseFloat(this._opts.chartHeight.substring(0,this._opts.chartHeight.indexOf("%"))) / 100.0) ;
				}else{
					h = this._opts.chartHeight;
				}
			}else{
				h	= this._$el.innerHeight();
			}

			if(isNaN(w)){
				w=0;
			}
			if(isNaN(h)){
				h=0;
			}
		if(w>0){
			this._w = w;
		}
		if(h>0){
			this._h = h;
		}
		if(this._h<450 && !this._opts.chartHeight){
			this._h = 450;
		}
	}

	ApdexChart.prototype._initParams=function(r){
		var self = this;
		if(r){
			if(!this._opts.data){
				this._opts.data=[];
			}
		}else{
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
					$fs.unbind("change");
					$fs.change(function(e){
						self.reDraw();
					});
				}
			}
		}
	}

	//创建画布
	ApdexChart.prototype._creatPaper=function(r,maxh){
		if(r){
			this._$el.empty();
		}
		// 去掉画布的+10 +30 解决仪表盘 X关闭按钮被遮盖问题
		this._canvasWidth   =  this._w*this._ratio/*+10*/ ;
		this._canvasHeight  =  this._h*this._ratio/*+10 +30 +30*/;
		if(maxh>this._canvasHeight){
			this._canvasHeight = maxh+30;
			$(this._$el[0]).css({"height":this._canvasHeight});
		}
		this._paper  = Raphael(this._elId,this._canvasWidth ,this._canvasHeight);
	}
	ApdexChart.prototype._creatBackGround=function(){
		this._backGround = this._paper.rect(0,0,this._w, this._h);
		this._backGround.attr({"stroke-width":0,"fill":"#FFFFFF"} );
	}

	ApdexChart.prototype._createPage=function(position,data,threshold){
		var self = this;
		var c	 = colors.noData;
		var info = colorsInfo.noData;
		if(data>0){
			var  r = this._caculateGrade(data,threshold);
			c	 = r.color;
			info = r.info;
		}

		var	pageBack 	= this._paper.circle(28, 28, 28);
			pageBack.attr({"stroke-width":0,fill:c})

		var no			= this._paper.text(28,28+28+10,"");
		if(data>0){
			no.attr({text:data+"s"});
		}else{
			no.attr({text:message_source_i18n.no_data});
		}

		var	title	   = this._paper.text(28,28+28+10+20,message_source_i18n.page_load_time);
		var	name	   = this._paper.text(28,28-28-20	,message_source_i18n.final_user);


		var iconHeight  = 32;
		var iconWidth	= 32;
		var pageIcon	= this._paper.image(this._root+"/img/icon_user.png",28-iconHeight/2,28-iconWidth/2,iconHeight,iconWidth);

		var page	 	= this._paper.set();
			page.push(pageBack,pageIcon,no,title,name);
			page.regX = 28;
			page.regY = 28;
			page.transform("...t"+(position.x-page.regX)+","+(position.y-page.regY)+"");
		/*
		var hitArea = this._paper.set();
			hitArea.push(pageBack,pageIcon);

			hitArea.mouseover(function(){
				pageBack.attr("opacity",0.8);
				self._showToolTip(position.x,position.y-30,"页面加载时间",data,info,self._opts.toolTipUrls.blockingTimeUrl);
			});
			hitArea.mouseout(function(){
				pageBack.attr("opacity",1);
				self._hideToolTip();
			});
		*/
		return  page;
	}


	//目前使用的地方被注释了
	ApdexChart.prototype._createNet=function(position,data,threshold){
		var self = this;
		var c	= colors.noData;
		var info = colorsInfo.noData;
		if(data>0){
			var  r = this._caculateGrade(data,threshold);
			c	 = r.color;
			info = r.info;
		}


		var d= "M 0.28841821,23.723299 C 0.23964925,19.4323 2.2585874,15.164224 5.6068096,12.480112 8.9550319,9.796 13.5601,8.7539218 17.73772,9.7350157 c 1.280468,-2.5072218 3.266011,-4.649584 5.668857,-6.1165846 2.402846,-1.4670005 5.215744,-2.2542131 8.031008,-2.2475434 2.830065,0.0067 5.653869,0.8158361 8.058021,2.3089412 2.404152,1.493105 4.381246,3.6655839 5.641844,6.1993959 2.668986,-0.7256402 5.676834,-0.05723 7.787291,1.7305092 1.842644,1.560877 2.973806,3.930932 3.028391,6.345201 1.905422,0.09323 3.765825,0.91889 5.113293,2.269317 1.347467,1.350427 2.169044,3.212638 2.258092,5.118259 0.08905,1.905622 -0.55529,3.836333 -1.770952,5.306533 -1.215663,1.4702 -2.990963,2.465754 -4.879387,2.736265 -1.95499,0.280047 -3.966254,-0.190835 -5.912573,0.144209 -2.32904,0.400927 -4.332719,1.912084 -6.63362,2.451554 -2.091995,0.49049 -4.372584,0.119231 -6.200991,-1.009463 -2.096771,1.453328 -4.659942,2.222279 -7.210455,2.163136 -3.111006,-0.07214 -6.175546,-1.393063 -8.364128,-3.605227 -1.697624,1.634232 -3.853129,2.787714 -6.154604,3.293532 -2.301476,0.505819 -4.742001,0.362453 -6.9684244,-0.409351 C 6.6247645,35.510791 4.3319543,33.749632 2.7551487,31.488446 1.1783432,29.22726 0.31974697,26.4798 0.28841821,23.723299Z"

		var netBack = this._paper.path(d);
			netBack.attr({"stroke-width":0,fill:c});

		var no			= this._paper.text(32,19+28+10,"");
		if(data>0){
			no.attr({text:data+"s"});
		}else{
			no.attr({text:message_source_i18n.no_data});
		}

		var	title	   = this._paper.text(32,19+28+10+20,message_source_i18n.network_layer_time);
		var	name	   = this._paper.text(28,19-28-20	,message_source_i18n.network);


		var net	= this._paper.set();
			net.regX=32;
			net.regY=19;
			net.push(netBack,no,title,name);
			net.transform("...t"+(position.x-net.regX)+","+(position.y-net.regY)+"");
		/*
			var hitArea = this._paper.set();
				hitArea.push(netBack);

			hitArea.mouseover(function(){
				netBack.attr("opacity",0.8);
				self._showToolTip(position.x,position.y-30,"页面加载时间",data,info,self._opts.toolTipUrls.codeTimeUrl);
			});
			hitArea.mouseout(function(){
				netBack.attr("opacity",1);
				self._hideToolTip();
			});
		*/
	}

	ApdexChart.prototype._createWall=function(position,data){
		var iconWidth	 	= 24;
		var iconHeight   	= 54;
		var pageIcon		= this._paper.image(this._root+"/img/firewall.png",0,0,iconWidth,iconHeight);

		var	name	   		= this._paper.text(iconWidth/2,iconHeight/2-28-20	,message_source_i18n.firewall);

		var wall	= this._paper.set();
			wall.regX		= iconWidth/2;
			wall.regY		= iconHeight/2;
			wall.push(pageIcon,name);
			wall.transform("...t"+(position.x-wall.regX)+","+(position.y-wall.regY)+"");

	}

	ApdexChart.prototype._createWeb=function(position,data,threshold){
		var self = this;
		var c	= colors.noData;
		var info = colorsInfo.noData;
		if(data>0){
			var  r = this._caculateGrade(data,threshold);
			c	 = r.color;
			info = r.info;
		}

		var webBack	= this._paper.circle(28, 28, 28);
			webBack.attr({"stroke-width":0,fill:c});

		var	name	   = this._paper.text(28,28-28-20	,message_source_i18n.web_server);

		var iconHeight  = 32;
		var iconWidth	= 32;
		var webBackIcon	= this._paper.image(this._root+"/img/icon_webserver.png",28-iconHeight/2,28-iconWidth/2,iconHeight,iconWidth);


		var webBackNodeRight	= this._paper.circle(28+28, 28, 8);
			webBackNodeRight.attr({"stroke-width":3,fill:colors.g5,stroke:"#FFFFFF"});

		var web = this._paper.set();
			web.regX =28;
			web.regY =28;
			web.push(webBack,webBackIcon,webBackNodeRight,name);
			web.transform("...t"+(position.x-web.regX)+","+(position.y-web.regY)+"");
		/*
		var hitArea = this._paper.set();
			hitArea.push(webBack,webBackIcon);

			hitArea.mouseover(function(){
				webBack.attr("opacity",0.8);
				self._showToolTip(position.x,position.y-30,"页面加载时间",data,self._opts.toolTipUrls.outServerTimeUrl);
			});
			hitArea.mouseout(function(){
				webBack.attr("opacity",1);
				self._hideToolTip();
			});
		*/
	}

	ApdexChart.prototype._createApp=function(position,data,threshold){
		var self = this;
		var c	= colors.noData;
		var info = colorsInfo.noData;
		if(data>0){
			var  r = this._caculateGrade(data,threshold);
			c	 = r.color;
			info = r.info;
		}
		var appBack				= this._paper.circle(28, 28, 28);
			appBack.attr({"stroke-width":0,fill:c});

		var no	= this._paper.text(28,28+28+10,"");
		if(data>0){
			no.attr({text:data+"s"});
		}else{
			no.attr({text:message_source_i18n.no_data});
		}

		var	title	   = this._paper.text(28,90,message_source_i18n.code_time);
		var	name	   = this._paper.text(25,-28	,message_source_i18n.application_server_name);



		var iconHeight  = 32;
		var iconWidth	= 32;
		var appBackIcon	= this._paper.image(this._root+"/img/icon_appserver.png",28-iconHeight/2,28-iconWidth/2,iconHeight,iconWidth);


		var appBackNodeRight	= this._paper.circle(28+28, 28, 8);
			appBackNodeRight.attr({"stroke-width":3,fill:colors.g5,stroke:"#FFFFFF"});

		var appBackNodeLeft		= this._paper.circle(28-28, 28, 8);
			appBackNodeLeft.attr({"stroke-width":3,fill:colors.g5,stroke:"#FFFFFF"});

		var hitArea		= this._paper.circle(28, 28, 28);
			hitArea.attr({"opacity":0,fill:"#FFFFFF","stroke-width":0});

		var app	= this._paper.set();
			app.regX = 28;
			app.regY = 28;
			app.push(appBack,appBackIcon,appBackNodeRight,appBackNodeLeft,no,title,name,hitArea);
			app.transform("...t"+(position.x-app.regX)+","+(position.y-app.regY)+"");
		//var hitArea = this._paper.set();
		//	hitArea.push(appBack,appBackIcon);
			hitArea.mouseover(function(){
				self._showToolTip(position.x,position.y-30,message_source_i18n.code_time,data,self._opts.toolTipUrls.codeTimeUrl,false);
				appBack.attr("opacity",0.8);
			});
			hitArea.mouseout(function(event){
				appBack.attr("opacity",1);
				self._hideToolTip(position,self._getMouseOffset(event));
			});
	}

	ApdexChart.prototype._createOutServer=function(position,outServerTime,threshold,hostname,hostId){
		var self = this;
		var c	= colors.noData;
		var info = colorsInfo.noData;
		/*if(outServerTime==0){
			outServerTime="0.000";
		}
		console.log(outServerTime);*/
		var  r = this._caculateGrade(outServerTime,threshold);
		c	 = r.color;
		info = r.info;
		c="#4DA2C6";//固定蓝色
		var outServerBack  = this._paper.circle(28, 28, 28);
			outServerBack.attr({"stroke-width":0,fill:c});
		var calcName=calcHostName(hostname);
		var	name	    = this._paper.text(28+28+4,28,calcName);
			name.attr({"text-anchor":"start"});
		var iconHeight  = 32;
		var iconWidth	= 32;
		var outServerIcon	= this._paper.image(this._root+"/img/icon_internet.png",28-iconHeight/2,28-iconWidth/2,iconHeight,iconWidth);

		var hitArea		= this._paper.circle(28, 28, 28);
			hitArea.attr({"opacity":0,fill:"#FFFFFF","stroke-width":0});

		var outServer  	   = this._paper.set();
			outServer.regX = 28;
			outServer.regY = 28;
			outServer.push(outServerBack,outServerIcon,name,hitArea);
			outServer.transform("...t"+(position.x-outServer.regX)+","+(position.y-outServer.regY)+"");

		//var hitArea			= this._paper.set();
		//	hitArea.push(outServerBack,outServerIcon);
			hitArea.mouseover(function(){
				self._showToolTip(position.x,position.y-30,message_source_i18n.external_server_time,outServerTime,self._opts.toolTipUrls.outServerTimeUrl,hostId,true);

				outServerBack.attr("opacity",0.8);
			});
			hitArea.mouseout(function(event){
				self._hideToolTip(position,self._getMouseOffset(event));
				outServerBack.attr("opacity",1);
			});

	}

	ApdexChart.prototype._createDataBase=function(position,dataBaseTime,threshold){

		var self = this;
		var c	= colors.noData;
		var info = colorsInfo.noData;
		if(dataBaseTime>-1){
			var  r = this._caculateGrade(dataBaseTime,threshold);
			c	 = r.color;
			info = r.info;
		}
		c="#4DA2C6";//固定蓝色

		var dataBaseBack  = this._paper.circle(28, 28, 28);
			dataBaseBack.attr({"stroke-width":0,fill:c});

		var	name	    = this._paper.text(28+28+4,28,message_source_i18n.database_server);
			name.attr({"text-anchor":"start"});

		var iconHeight  = 32;
		var iconWidth	= 32;
		var dataBaseIcon	= this._paper.image(this._root+"/img/icon_database.png",28-iconHeight/2,28-iconWidth/2,iconHeight,iconWidth);

		var hitArea		= this._paper.circle(28, 28, 28);
			hitArea.attr({"opacity":0,fill:"#FFFFFF","stroke-width":0});

		var dataBase	= this._paper.set();
			dataBase.regX = 28;
			dataBase.regY = 28;
			dataBase.push(dataBaseBack,dataBaseIcon,name,hitArea);
			dataBase.transform("...t"+(position.x-dataBase.regX)+","+(position.y-dataBase.regY)+"");

		//var hitArea			= this._paper.set();
		//	hitArea.push(dataBaseBack,dataBaseIcon);

			hitArea.mouseover(function(){
				self._showToolTip(position.x,position.y-30,message_source_i18n.database_time,dataBaseTime,self._opts.toolTipUrls.dataBaseTimeUrl,"",true);
				dataBaseBack.attr("opacity",0.8);
			});
			hitArea.mouseout(function(event){
				self._hideToolTip(position,self._getMouseOffset(event));
				dataBaseBack.attr("opacity",1);
			});
	}



	ApdexChart.prototype._createMemoryCache=function(position,memoryCacheTime,threshold){


		var self = this;
		var c	= colors.noData;
		c="blue";
		var info = colorsInfo.noData;
		if(memoryCacheTime>-1){
			var  r = this._caculateGrade(memoryCacheTime,threshold);
			c	 = r.color;
			info = r.info;
		}
		c="#4DA2C6";//固定蓝色
		var memoryCacheBack  = this._paper.circle(28, 28, 28);
			memoryCacheBack.attr({"stroke-width":0,fill:c});

		var	name	    = this._paper.text(28+28+4,28,"Memcached\n"+message_source_i18n.server);
			name.attr({"text-anchor":"start"});

		var iconHeight  	= 32;
		var iconWidth		= 32;
		var memoryCacheIcon	= this._paper.image(this._root+"/img/icon_memcache.png",28-iconHeight/2,28-iconWidth/2,iconHeight,iconWidth);

		var hitArea		= this._paper.circle(28, 28, 28);
			hitArea.attr({"opacity":0,fill:"#FFFFFF","stroke-width":0});

		var memoryCache		= this._paper.set();
			memoryCache.regX = 28;
			memoryCache.regY = 28;
			memoryCache.push(memoryCacheBack,memoryCacheIcon,name,hitArea);

			memoryCache.transform("...t"+(position.x-memoryCache.regX)+","+(position.y-memoryCache.regY)+"");


		//var hitArea			= this._paper.set();
		//	hitArea.push(memoryCacheBack,memoryCacheIcon);
			hitArea.mouseover(function(){
				self._showToolTip(position.x,position.y-30,"Memcached"+message_source_i18n.time,memoryCacheTime,self._opts.toolTipUrls.memoryCatchTimeUrl,"",true);
				memoryCacheBack.attr("opacity",0.8);
			});
			hitArea.mouseout(function(event){
				self._hideToolTip(position,self._getMouseOffset(event));
				memoryCacheBack.attr("opacity",1);
			});
	}


	ApdexChart.prototype._createMongodb=function(position,mongodbTime,threshold){

		var self = this;
		var c	 = colors.noData;
		var info = colorsInfo.noData;
		if(mongodbTime>-1){
			var  r = this._caculateGrade(mongodbTime,threshold);
			c	 = r.color;
			info = r.info;
		}
		c="#4DA2C6";//固定蓝色
		var mongodbBack  = this._paper.circle(28, 28, 28);
			mongodbBack.attr({"stroke-width":0,fill:c});

		var	name	    = this._paper.text(28+28+4,28,"MongoDB");
			name.attr({"text-anchor":"start"});

		var iconHeight  = 32;
		var iconWidth	= 32;
		var mongodbIcon	= this._paper.image(this._root+"/img/icon_mongoDB.png",28-iconHeight/2,28-iconWidth/2,iconHeight,iconWidth);

		var hitArea		= this._paper.circle(28, 28, 28);
			hitArea.attr({"opacity":0,fill:"#FFFFFF","stroke-width":0});

		var mongodb	= this._paper.set();
			mongodb.regX = 28;
			mongodb.regY = 28;
			mongodb.push(mongodbBack,mongodbIcon,name,hitArea);
			mongodb.transform("...t"+(position.x-mongodb.regX)+","+(position.y-mongodb.regY)+"");

		//var hitArea			= this._paper.set();
		//	hitArea.push(mongodbBack,mongodbIcon);

			hitArea.mouseover(function(){
				self._showToolTip(position.x,position.y-30,message_source_i18n.message_4,mongodbTime,self._opts.toolTipUrls.mongodbTimeUrl,"",true);
				mongodbBack.attr("opacity",0.8);
			});
			hitArea.mouseout(function(event){
				self._hideToolTip(position,self._getMouseOffset(event));
				mongodbBack.attr("opacity",1);
			});
	}

	ApdexChart.prototype._createRedis=function(position,redisTime,threshold){

		var self = this;
		var c	 = colors.noData;
		var info = colorsInfo.noData;
		if(redisTime>-1){
			var  r = this._caculateGrade(redisTime,threshold);
			c	 = r.color;
			info = r.info;
		}
		c="#4DA2C6";//固定蓝色

		var redisBack  = this._paper.circle(28, 28, 28);
			redisBack.attr({"stroke-width":0,fill:c});

		var	name	    = this._paper.text(28+28+4,28,"Redis");
			name.attr({"text-anchor":"start"});

		var iconHeight  = 32;
		var iconWidth	= 32;
		var redisIcon	= this._paper.image(this._root+"/img/icon_redis.png",28-iconHeight/2,28-iconWidth/2,iconHeight,iconWidth);

		var hitArea = this._paper.circle(28, 28, 28);
			hitArea.attr({"opacity":0,fill:"#FFFFFF","stroke-width":0});
		var redis	= this._paper.set();
			redis.regX = 28;
			redis.regY = 28;
			redis.push(redisBack,redisIcon,name,hitArea);
			redis.transform("...t"+(position.x-redis.regX)+","+(position.y-redis.regY)+"");

		//var hitArea			= this._paper.set();
		//	hitArea.push(redisBack,redisIcon);




			hitArea.mouseover(function(){
				self._showToolTip(position.x,position.y-30,"Redis"+message_source_i18n.time,redisTime,self._opts.toolTipUrls.redisTimeUrl,"",true);
				redisBack.attr("opacity",0.8);
			});
			hitArea.mouseout(function(event){
				self._hideToolTip(position,self._getMouseOffset(event));
				redisBack.attr("opacity",1);
			});
	}


	ApdexChart.prototype._createLegend = function(){
			var width	= this._w;
			var keys = [];
			for(var key in colors){
				keys.push(key);
			}

			var end = width - 40;
			for(var i=keys.length-1; i>=0;i--){
				var info = this._paper.text(end,20,colorsInfo[keys[i]]);
					info.attr({"text-anchor":"end"});

					end -= (info.getBBox().width+10);

				var c	 = this._paper.circle(end,20,6);
					c.attr({"fill":colors[keys[i]],"stroke-width":0});
					end -=10;
			}


	}

    ApdexChart.prototype._createApdexT = function(data){
    	var len=calcLength(message_source_i18n.application_server_name);
        this._paper.text(this._w - 460-len,20,message_source_i18n.application_server_name+"ApdexT:"+data.apdexT+"ms");
    }
    function calcLength(s) { 
		if(!arguments.length||!s) return null; 
		if(""==s) return 0;
		var l=0; 
		for(var i=0;i<s.length;i++) 
		{ 
			if(s.charCodeAt(i)>255) l+=2; 
			else l++; 
		} 
		return l; 
    };

	ApdexChart.prototype._createLine = function(position,data){
			var self	  = this;
			var lines	  = this._paper.set();
			//var pageToNet = this._paper.path("M"+(position.page.x+28)+" "+(position.page.y)+"L"+(position.net.x-32)+" "+(position.net.y));
			//	lines.push(pageToNet);
			//var netToWall = this._paper.path("M"+(position.net.x+28)+" "+(position.net.y)+"L"+(position.wall.x-12)+" "+(position.wall.y));
			//	lines.push(netToWall);
			//var wallToWeb = this._paper.path("M"+(position.wall.x+12)+" "+(position.wall.y)+"L"+(position.web.x-28)+" "+(position.web.y));
			//	lines.push(wallToWeb);
			var blockingTimeFormat = data.blockingTime;
			if(blockingTimeFormat==0){
				blockingTimeFormat = "0.000";
			}
			var blockingTimeNo		= this._paper.text((position.web.x+position.app.x)/2,position.app.y/*+28*/+10,blockingTimeFormat+"s");
			var blockingTimeTitle	= this._paper.text((position.web.x+position.app.x)/2,position.app.y/*+28*/+30,message_source_i18n.blocking_time);


			var webToApp  		= this._paper.path("M"+(position.web.x+28)+" " +(position.web.y)+"L"+(position.app.x-28)+" "+(position.app.y));
			webToApp.attr({"stroke":colors.g1,"stroke-width":3})
			lines.push(webToApp);
//			var webToAppHitArea	= this._paper.path("M"+(position.web.x+28)+" " +(position.web.y)+"L"+(position.app.x-28)+" "+(position.app.y)+"Z");
			var webToAppHitArea	= this._paper.path("M"+(position.web.x+28)+" " +(position.web.y)+"L"+(position.app.x-28)+" "+(position.app.y));
				webToAppHitArea.attr({opacity:0,"stroke-width":30,stroke:"#ffffff",fill:"#ffffff"});

				webToAppHitArea.mouseover(function(){
					self._showToolTip((position.web.x+position.app.x)/2,position.app.y-30,message_source_i18n.blocking_time,data.blockingTime,self._opts.toolTipUrls.blockingTimeUrl,false);
				});
				webToAppHitArea.mouseout(function(event){
					self._hideToolTip(position,self._getMouseOffset(event));
				});


				//lines.push(webToAppHitArea);

			if(data.externals){
				for(var i=0;i<data.externals.length;i++){
					var path 		=   "M"+(position.app.x+28)+" "+(position.app.y);
					if(position.app.y!=position.outServer[i].y){
						path	+=	"L"+(position.app.x+28)+" "+(position.outServer[i].y);
					}
					path    +=  "L"+(position.outServer[i].x-28)+" "+(position.outServer[i].y);
					var outTimeTotalFormat = data.externals[i].outTimeTotal;
					if(outTimeTotalFormat==0){
						outTimeTotalFormat="0.000";
					}
					var outServerTimeNo		= this._paper.text((position.app.x+position.outServer[i].x)/2,position.outServer[i].y+10,outTimeTotalFormat+"s");
					var outServerTimeTitle	= this._paper.text((position.app.x+position.outServer[i].x)/2,position.outServer[i].y+25,message_source_i18n.external_server_time);
					var appToOutServer = this._paper.path(path);
					appToOutServer.attr("stroke-dasharray","-");
					appToOutServer.attr({"stroke":dashlinecolor,"stroke-width":3})
					lines.push(appToOutServer);
				}
			}

			if(position.dataBase){
				var path 		=   "M"+(position.app.x+28)+" "+(position.app.y);
					if(position.app.y!=position.dataBase.y){
						path	+=	"L"+(position.app.x+28)+" "+(position.dataBase.y);
					}
						path    +=  "L"+(position.dataBase.x-28)+" "+(position.dataBase.y);
				var dataBaseTimeFormat = data.dataBaseTime;
				if(dataBaseTimeFormat==0){
					dataBaseTimeFormat="0.000";
				}
				var	dataBaseTimeNo		= this._paper.text((position.app.x+position.dataBase.x)/2,position.dataBase.y+10,dataBaseTimeFormat+"s");
				var dataBaseTimeTitle	= this._paper.text((position.app.x+position.dataBase.x)/2,position.dataBase.y+25,message_source_i18n.database_time);


				var appToDataBase = this._paper.path(path);
				appToDataBase.attr("stroke-dasharray","-");
				appToDataBase.attr({"stroke":dashlinecolor,"stroke-width":3})
				lines.push(appToDataBase);
			}

			if(position.memoryCache){
				var path 		=   "M"+(position.app.x+28)+" "+(position.app.y);
					if(position.app.y!=position.memoryCache.y){
						path	+=	"L"+(position.app.x+28)+" "+(position.memoryCache.y);
					}
						path    +=  "L"+(position.memoryCache.x-28)+" "+(position.memoryCache.y);
				var memoryCacheFormat   = data.memoryCacheTime;
				if(memoryCacheFormat==0){
					memoryCacheFormat="0.000";
				}
				var	memoryCacheNo		= this._paper.text((position.app.x+position.memoryCache.x)/2,position.memoryCache.y+10,memoryCacheFormat+"s");
				var memoryCacheTitle	= this._paper.text((position.app.x+position.memoryCache.x)/2,position.memoryCache.y+25,"Memcached "+message_source_i18n.time);


				var appToMemoryCache = this._paper.path(path);
					appToMemoryCache.attr("stroke-dasharray","-");
					appToMemoryCache.attr({"stroke":dashlinecolor,"stroke-width":3});
					lines.push(appToMemoryCache);
			}

			if(position.mongodb){
				var path 		=   "M"+(position.app.x+28)+" "+(position.app.y);
					if(position.app.y!=position.mongodb.y){
						path	+=	"L"+(position.app.x+28)+" "+(position.mongodb.y);
					}
						path    +=  "L"+(position.mongodb.x-28)+" "+(position.mongodb.y);
				var mongodbTimeFormat = data.mongodbTime;
				if(mongodbTimeFormat==0){
					mongodbTimeFormat="0.000";
				}
				var	memoryCacheNo		= this._paper.text((position.app.x+position.mongodb.x)/2,position.mongodb.y+10,mongodbTimeFormat+"s");
				var memoryCacheTitle	= this._paper.text((position.app.x+position.mongodb.x)/2,position.mongodb.y+25,"MongoDB "+message_source_i18n.time);


				var appToMongodb = this._paper.path(path);
				appToMongodb.attr("stroke-dasharray","-");
				appToMongodb.attr({"stroke":dashlinecolor,"stroke-width":3});
				lines.push(appToMongodb);
			}

			if(position.redis){
				var path 		=   "M"+(position.app.x+28)+" "+(position.app.y);
					if(position.app.y!=position.redis.y){
						path	+=	"L"+(position.app.x+28)+" "+(position.redis.y);
					}
						path    +=  "L"+(position.redis.x-28)+" "+(position.redis.y);
				var redisCacheFormat   = data.redisTime;
				if(redisCacheFormat==0){
					redisCacheFormat="0.000";
				}
				var	redisCacheNo		= this._paper.text((position.app.x+position.redis.x)/2,position.redis.y+10,redisCacheFormat+"s");
				var redisCacheTitle		= this._paper.text((position.app.x+position.redis.x)/2,position.redis.y+25,"Redis "+message_source_i18n.time);


				var appToRedis = this._paper.path(path);
					appToRedis.attr("stroke-dasharray","-");
					appToRedis.attr({"stroke":dashlinecolor,"stroke-width":3});
					lines.push(appToRedis);
			}

			lines.attr({"stroke-width":3})
	}
	ApdexChart.prototype._caculateGrade=function(value,thresholds){
		var	th	= threshold;
		if(thresholds){
			th  = thresholds;
		}
		var grade  = {};
		if(!th){
			return;//如果数组不存在 返回
		}
		if(value<th[0]/1000){
			grade.no = 1;
		}else{
			for(var i=th.length-1 ;i>=0;i--){
				if(value>th[i-1]/1000&&value<=th[i]/1000){
					grade.no = i+1 ;
					break;
				}
			}
			if(!grade.no){
				grade.no = 3;
			}
		}
		grade.color=colors["g"+grade.no];
		grade.info =colorsInfo["g"+grade.no];
		return grade;
	}

	ApdexChart.prototype._render=function(r){
		var self = this;
		var url  = this._opts.url;
		if(!url){
			return null;
		}
		$.ajax({
				url		:url,
				data	:self._opts.data||{},
				dataType:"text",
				type:"post",
				error	:function(XMLHttpRequest,textStatus,errorThrown) {

						},
				success :function(data, textStatus, jqXHR){
					try{
						data = eval("("+data+")");
					}catch(e){
						//alert("数据格式有误"+e.message);
						console.log(message_source_i18n.data_validate_message_1+e.message);
						return;
					}
					self._renderChart(data,r);
				}

		});
	}
	ApdexChart.prototype._renderChart 		= function(data,r){
		var ps	= this._calculatePosition(data,r);
	/*	var length = ps.outServer.length;
		if(ps.mongodb){
			length = length + 1;
		}
		if(ps.redis){
			length = length + 1;
		}
		if(ps.memoryCache){
			length = length + 1;
		}
		if(ps.dataBase){
			length = length + 1;
		}*/

		//this._createPage(ps.page,data.pageLoadingTime);
		//this._createNet(ps.net,data.networkTime);

		this._createWeb(ps.web,data.webApdex,data.threshold);
		//this._createWall(ps.wall);
		this._createApp(ps.app,data.codeTime,data.threshold);

		//mongodbTime			:2,
		//mongodbApdex;		:0.2,
		//redisTime			:2,
		//redisApdex			:0.1
		if(data.externals){
			for(var i=0;i<data.externals.length;i++){
				this._createOutServer(ps.outServer[i],data.externals[i].outTimeTotal,data.threshold,data.externals[i].host,data.externals[i].hostId);
			}
		}
		if(data.dataBaseTime>-1){ 
			this._createDataBase(ps.dataBase,data.dataBaseTime,data.threshold);
		}
		if(data.memoryCacheTime>-1){
			this._createMemoryCache(ps.memoryCache,data.memoryCacheTime,data.threshold);
		}
		if(data.mongodbTime>-1){
			this._createMongodb(ps.mongodb,data.mongodbTime,data.threshold)
		}
		if(data.redisTime>-1){
			this._createRedis(ps.redis,data.redisTime,data.threshold);
		}


		this._createLine(ps,data);

        this._createApdexT(data);
	}
	ApdexChart.prototype._calculatePositionAfresh = function(maxh,data){
		var height 		= maxh;
		var width  		= this._w;
		var mLefe		= 40;
		var mRight		= 120;
		var w			= width - mLefe - mRight;

		var position   		= {};
			position.page	= {x:mLefe,y:height/2}
			position.web	= {x:position.page.x+ w*0/3,	y:position.page.y}
			position.app	= {x:position.page.x+ w*1/3,	y:position.page.y}

		var c = 0;
		if(data.memoryCacheTime>-1){
			c++;
		}
		if(data.dataBaseTime>-1){
			c++;
		}
		if(data.externals){
			for(var i=0;i<data.externals.length;i++){
				c++;
			}
		}
		if(data.mongodbTime>-1){
			c++;
		}
		if(data.redisTime>-1){
			c++;
		}
		var ps = [];
		for(var i=0;i<=c;i++){
			ps.push(28+ height/(c+1)*i);
		}
		var min = 28 ;
		var max = height/(c+1)*c;
		var b	= (max - min)/2-position.page.y
		for(var i=0;i<ps.length;i++){
			ps[i] = ps[i]-b;
		}
		return ps;
	}
	
	ApdexChart.prototype._calculatePosition = function(data,r){
			var height 		= this._h;
			var width  		= this._w;
			var mLefe		= 40;
			var mRight		= 120;
			var w			= width - mLefe - mRight;

			var position   		= {};
				position.page	= {x:mLefe,y:height/2}
				position.web	= {x:position.page.x+ w*0/3,	y:position.page.y}
				position.app	= {x:position.page.x+ w*1/3,	y:position.page.y}


			var c = 0;
			if(data.memoryCacheTime>-1){
				c++;
			}
			if(data.dataBaseTime>-1){
				c++;
			}
			if(data.externals){
				for(var i=0;i<data.externals.length;i++){
					c++;
				}
			}
			if(data.mongodbTime>-1){
				c++;
			}
			if(data.redisTime>-1){
				c++;
			}
			var ps = [];
			for(var i=0;i<=c;i++){
				ps.push(28+ height/(c+1)*i);
			}
			var min = 28 ;
			var max = height/(c+1)*c;
			var b	= (max - min)/2-position.page.y
			for(var i=0;i<ps.length;i++){
				ps[i] = ps[i]-b;
			}
			var maxh = ps[ps.length-1];
			if(maxh>height && maxh/(ps.length-1)<70){
				maxh = 78*(ps.length-1);
				ps = this._calculatePositionAfresh(maxh,data);
			}
			//得到最大的y轴值之后再创建画布 防止画布的高度小于实例的高度
			this._creatPaper(r,maxh);
			this._creatBackGround();
			this._createLegend();
			
			if(data.memoryCacheTime>-1){
				position.memoryCache={x: width - mRight,y:ps.shift()};
			}
			if(data.dataBaseTime>-1){
				position.dataBase={x: width - mRight,y:ps.shift()};
			}
			position.outServer=[];
			for(var i=0;i<data.externals.length;i++){
				position.outServer[i]={x: width - mRight,y:ps.shift()};
			}
			if(data.mongodbTime>-1){
				position.mongodb={x: width - mRight,y:ps.shift()};
			}
			if(data.redisTime>-1){
				position.redis={x: width - mRight,y:ps.shift()};
			}
		return position;
	}

	// ApdexChart.prototype._showToolTip=function(x,y,title,value){
			// var width = this._w;
			// if(!this._tooltip){
				// this._tooltip = this._paper.set();
				// var path ="M0 0L0 54L10 54L14 60L18 54L156 54L156 0L0 0Z"
				// var box	= this._paper.path(path);
					// box.attr({fill:"#000000"});

				// var line1 = this._paper.text(10,20,"");
					// line1.attr({fill:"#FFFFFF","text-anchor":"start"});


				// this._tooltip.push(box,line1);

				// this._tooltip.line1= line1;

			// }
			// if(title&&value){
				// this._tooltip.line1.attr({text:title+":"+value+"s"});
			// }else{
				// this._tooltip.line1.attr({text:""});
			// }


			// var _x = x-14;

			// if(_x+156>width){

				// _x = _x -(_x+156-width+10);
			// }

			// this._tooltip.transform("t"+(_x)+","+(y-60));
			// this._tooltip.show();

	// }


	ApdexChart.prototype._showToolTip=function(x,y,title,value,url,outServerHost,flag){
		outServerHost = encodeURIComponent(outServerHost);
		var width  = 310;
		var height = 210;
		if(this.$toolTip && this._$el[0].children[1]){

		}else{
			var html = '<div class="apdexToolTip" style="z-index:1000;width:310px;height:210px;margin:10px 10px 10px 10px">\
							<div class="content">\
								<div class="toolTipChart" sendRequest="false" chartWidth="300" chartHeight="200" ></div>\
							</div>\
						</div>'
			this.$toolTip = $(html);
			this.$toolTip.appendTo(this._$el[0])
		}
		
        var top_offset = y-this.$toolTip.height()+this._$el.offset().top-30;
        var left_offset = x;
        if (top_offset<0) {
            left_offset = x-150 ;
            top_offset =y ;
        }
        if(flag){
        	this.$toolTip.css({height:height,width:width,position:"relative","margin-left":x-340,"margin-top":-(this._canvasHeight-y+170+28)})
        }else{
        	this.$toolTip.css({height:height,width:width,position:"relative","margin-left":x-150,"margin-top":-(this._canvasHeight-y+200+28)})
        }
		
		this.$toolTip.find(".title").text(title);
		this.$toolTip.find(".toolTipChart").empty();
		this.$toolTip.show();
        var _toolTip = $(".apdexToolTip");
        var self = this;
        var left,top,bottom,right,pos;
        this.$toolTip.mouseout(function(event){

            left = _toolTip.offset().left;
            top = _toolTip.offset().top;
            bottom = top+_toolTip.height();
            right = left+ _toolTip.width();
            pos = self._getMousePos(event);
            if(pos.x<left || pos.x > right || pos.y<top || pos.y>bottom){
                _toolTip.hide();
            }

        });
       
		if(url){
		  if(outServerHost && outServerHost!='false'){
			  url+="?hostId="+outServerHost;
		  }
		  var $toolTipChart = this.$toolTip.find(".toolTipChart");
			  $toolTipChart.attr("url"	,url);
			  $toolTipChart.attr("forms",this._opts.forms);
			  $toolTipChart.attr("params",this._$el.attr("params"));
              $toolTipChart.attr("hchartSetting","{series:[{marker:{lineWidth:1.5,radius:1.5}}]}");
			  $toolTipChart.rumchart();
		}


	}


	ApdexChart.prototype._hideToolTip=function(position,pos,model){//向下移出鼠标，则隐藏tooltip
            if (model) {
                if(pos.x-position.x>200){
                    this.$toolTip.hide();
                }
            }else{
                if(pos.y-position.y>0){
                    this.$toolTip.hide();
                }
                if(!position.y && pos.y>240){
                	this.$toolTip.hide();
                }
            }

	}
    ApdexChart.prototype._getMousePos=function(event){
        var e = event || window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || e.clientX + scrollX;
        var y = e.pageY || e.clientY + scrollY;
        return {"x":x,"y":y};
    }
    ApdexChart.prototype._getMouseOffset = function(event){
        return {"x":event.offsetX,"y":event.offsetY}
    }
	ApdexChart.prototype._drawEmptyChart=function(r){
		this._initEl();
		this._initParams()
		this._caculateRatio(r);
		/*this._creatPaper(r);
		this._creatBackGround();
		this._createLegend();*/
		//this._createPage();
		// this._createNet();
		// this._createWeb();
		// this._createApp();
		// this._createOutServer();
		// this._createDataBase();
		// this._createMemoryCache();
	}
	ApdexChart.prototype._draw=function(r){
		this._drawEmptyChart(r);
		this._render(r);
		this._$el.data("chart",this);
	}
	ApdexChart.prototype.draw=function(){
		this._draw(false);
	}
	ApdexChart.prototype.reDraw=function(){
		this._draw(true);
	}
	ApdexChart.prototype.getDataString=function(){
		var data = this._opts.data;
		var r  = {};
		if(data&&data.length>0){
			$.each(data,function(k,v){
				if(!r[v.name]){
					r[v.name] =[];
				}
				r[v.name].push(v.value);
			});
		}
		return $.toJSON(r);
	}
	ApdexChart.prototype.getUrl=function(){
		return this._opts.url;
	}
	ApdexChart.prototype.getChartType=function(){
		return this._opts.chartType;
	}

	ApdexChart.prototype.getExtattr=function(){
		var  extAttr = [];
			 extAttr.push({name:"blockingTimeUrl",value:this._opts.toolTipUrls.blockingTimeUrl});
			 extAttr.push({name:"codeTimeUrl",value:this._opts.toolTipUrls.codeTimeUrl});
			 extAttr.push({name:"outServerTimeUrl",value:this._opts.toolTipUrls.outServerTimeUrl});
			 extAttr.push({name:"dataBaseTimeUrl",value:this._opts.toolTipUrls.dataBaseTimeUrl});
			 extAttr.push({name:"memoryCatchTimeUrl",value:this._opts.toolTipUrls.memoryCatchTimeUrl});
			 extAttr.push({name:"mongodbTimeUrl",value:this._opts.toolTipUrls.mongodbTimeUrl});
			 extAttr.push({name:"redisTimeUrl",value:this._opts.toolTipUrls.redisTimeUrl});
		return $.toJSON(extAttr);
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
	function calcHostName(s){
	    if(!arguments.length||!s) return s;
	    if(""==s) return s;
	    var l=0;
	    var arr=[];
	    var index=0;
	    for(var i=0;i<s.length;i++)
	    {
	         if(s.charCodeAt(i)>255){
	        	 l+=2;
	         }else{
	        	 l++;
	         }
	         if(l*6>=90){
	        	 l=0;
	        	 arr[index]=i;
		         index++;
	         }
	    }
	    if(arr.length>0){
	    	var temp=[];
	    	var start=0;
	    	var newstr="";
	    	for(var j=0;j<arr.length;j++){
	    		var str=s.substring(start,arr[j]);
	    		newstr+=str+"\n";
	    		start=arr[j];
	    	}
	    	if(s.substring(arr[arr.length])!=""){
	    		newstr+=s.substring(arr[arr.length-1]);
	    	}
	    	return newstr;
	    }else{
	    	return s;
	    }
	}
})(jQuery);
return $;
});
