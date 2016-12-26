/**
 * ProgressBar
 */

/**
 div 上属性 
 canvasWidth 画布的宽度 
 canvasHeight 画布的高度 
 circleR 圆的半径
 circleRX 圆心点X值 
 circleRY 圆心点Y值
 rectWidth 矩形进度条的宽度 
 rectHeight 矩形进度条的高度
 arcSpeed 圆弧转动的速度
 cricleSpeed 圆形进度条转动的速度
 rectSpeed 矩形进度条转动的速度
 animation 动画效果
 showlegend 显示图例
 c_stroke_width 大圆边环的宽度
 r_stroke_width 矩形圆上边环的宽度
 initrectwidth 矩形初始化的长度
 params {p1:1,p2:[]} 画小图时图的颜色渐变值

*/
define(function(require, exports,modules){
(function ($) {
	var defaults ={
		/*canvasWidth : 900,
		canvasHeight: 250,
		circleR: 60,
		circleRX:100,
		circleRY:100,
		rectWidth:600,
		rectHeight:20,
		animation:true,
		showlegend:true,
		c_stroke_width:13,
		r_stroke_width:2,
		initrectwidth:0*/	

		/*canvasWidth : 600,
		canvasHeight: 200,
		circleR: 15,
		circleRX:40,
		circleRY:40,
		rectWidth:300,
		rectHeight:6,
		animation:false,
		showlegend:false,
		c_stroke_width:4,
		r_stroke_width:2,
		initrectwidth:300*/

		id:null,
		canvasWidth : null,
		canvasHeight: null,
		circleR: null,
		circleRX:null,
		circleRY:null,
		rectWidth:null,
		rectHeight:null,
		animation:null,
		showlegend:null,
		c_stroke_width:null,
		r_stroke_width:null,
		initrectwidth:null,
		params:null,
		wait:"",
		imageX:null
	};
	//g1蓝色 g2橙色 g3红色
	var colors = {g1:"#3598db",g2:"#ff5400",g3:"#dc0303"};
	
	var methods = {
		init : function (options) {
			return  this.each(function(){
				var $this = $(this);
				var opts  = $.extend(true,{}, defaults, options);
					if (!opts.id) {
						opts.id = $this.attr("id");
					};
					if(!opts.canvasWidth){
						opts.canvasWidth = $this.attr("canvasWidth");
					}
					if(!opts.canvasHeight){
						opts.canvasHeight = $this.attr("canvasHeight");
					}
					if(!opts.circleR){
						opts.circleR = Number($this.attr("circleR"));
					}
					if(!opts.circleRX){
						opts.circleRX 	= Number($this.attr("circleRX"));
					}
					if(!opts.circleRY){
						opts.circleRY = Number($this.attr("circleRY"));
					}
					if(!opts.rectWidth){
						opts.rectWidth = $this.attr("rectWidth");
					}
					if(!opts.rectHeight){
						opts.rectHeight 	= Number($this.attr("rectHeight"));
					}
					if(!opts.url){
						opts.url 	= $this.attr("url");
					}
					if(!opts.animation){
						opts.animation 	= $this.attr("animation")=="true";
					}
					if(!opts.showlegend){
						opts.showlegend 	= $this.attr("showlegend")=="true";
					}
					if(!opts.c_stroke_width){
						opts.c_stroke_width 	= Number($this.attr("c_stroke_width"));
					}
					if(!opts.r_stroke_width){
						opts.r_stroke_width 	= Number($this.attr("r_stroke_width"));
					}
					if(!opts.initrectwidth){
						opts.initrectwidth 	= Number($this.attr("initrectwidth"));
					}
					if(!opts.params){
					   var params		= $this.attr("params");
					   if(params){
						 try{
							  opts.params = eval("("+params+")");	
						 }catch(e){
							
						 }
					   }	
				   }		

				var	progressbar = $this.data("progressbar");
				if(progressbar&&progressbar instanceof OverviewBar){
					progressbar.reDraw();
				}else{
					progressbar = new OverviewBar($this,opts);
					progressbar.draw();	
				}

			});
		}
	};
	$.fn.rumOverviewBar = function () {
		var method = "init";
		var opts = {};

		if (methods[method]) {
			return methods[method].call(this,opts);
		}else {
			$.error('Method ' + method + ' does not exist on jQuery.rpcchart');
		}
	};
	$.fn.rumOverviewBar.defaults	= defaults;
	function OverviewBar($el,options){
		this._opts  			= options;
		this._$el    			= $el;
		this._elId  			= this._$el.attr("id");;
		this._paper             = null;
		this._within            = null; //圆形进度条
		this._rectangular       = null; //矩形进度条
		this._arcSpeed          =4000;
		this._cricleSpeed       =900;
		this._rectSpeed         =4000;
		this._root				= options.root||"./";
	}

	OverviewBar.prototype.draw=function(){
		this._drawProgressBar(true);
	}
	OverviewBar.prototype.reDraw=function(){
		this._drawProgressBar(false);
	}

	//计算比例
	OverviewBar.prototype._caculateRatio=function(r){
			this._$el.data("progressbar");
			
			if(r){
				this._$el.empty();
			}
			var w = 0,h=0;
			if(this._opts.canvasWidth){
				if(this._opts.canvasWidth.indexOf("%")>0){
					w = $(".rightbox").innerWidth() * ( parseFloat(this._opts.canvasWidth.substring(0,this._opts.canvasWidth.indexOf("%"))) / 100.0) ;
				}else{
					w = this._opts.canvasWidth;
				}
			}else{
				w	= $(".rightbox").innerWidth();
			}

			if(this._opts.canvasHeight){
				if(this._opts.canvasHeight.indexOf("%")>0){
					h = $(".rightbox").innerHeight() * ( parseFloat(this._opts.canvasHeight.substring(0,this._opts.canvasHeight.indexOf("%"))) / 100.0) ;
				}else{
					h = this._opts.canvasHeight;
				}
			}else{
				h	= $(".rightbox").innerHeight();
			}

			if(isNaN(w)){
				this._opts.canvasWidth=0;
			}
			if(isNaN(h)){
				this._opts.canvasHeight=0;
			}
		if(w>0){
			this._opts.canvasWidth = Number(w);
		}
		if(h>0){
			this._opts.canvasHeight = Number(h);
		}
		if(this._h<200){
			this._opts.canvasHeight = 200;
		}
		this._opts.rectWidth = (this._opts.canvasWidth - this._opts.circleR*2 - 80)* 0.8;
		
	}
	
	OverviewBar.prototype._drawProgressBar=function(r){
		this._caculateRatio();
		this._creatPaper();
		this._renderPaper(r);
		this._$el.data("progressbar",this);
	}

	//创建画布
	OverviewBar.prototype._creatPaper=function(){
		var self = this;
		this._paper  = Raphael(self._opts.id,self._opts.canvasWidth,self._opts.canvasHeight);
		//画布上的图例

		//半圆弧的转动
        this._paper.customAttributes.along = function (v) {
        	/*$($(self._$el).children()[1]).html('<b>计算中'+wait+'</b>').css('font-size:'+self._opts.circleR/4+'px');
        	if (v == 0) {
        		wait = (wait == ".") ? ".." : ((wait == "..") ? "..." : ".");
        	};*/
        	if(!self._opts.wait){
        		self._opts.wait = self._paper.text(self._opts.circleRX,self._opts.circleRY,message_source_i18n.detecting).attr({"font-size":self._opts.circleR/3});
        	}
            return {
                transform: "r" + [v * 360, self._opts.circleRX, self._opts.circleRY]
            };
        };
		//圆的属性值    
    	this._paper.customAttributes.cri = function (value, total,data) {
	        var RX = self._opts.circleRX,
	        	RY = self._opts.circleRY,
	        	R = self._opts.circleR,
	        	alpha = 360 / total * value,
	            a = (90 - alpha) * Math.PI / 180,
	            x = RX + R * Math.cos(a),
	            y = RY - R * Math.sin(a),
	            path;
	        if (total == value) {
	            path = [["M", RX, RY - R], ["A", R, R, 0, 1, 1, 99.99, RY - R]];
	        } else {
	            path = [["M", RX, RY - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
	        }
	        return {path: path};
	    };
		
	}
	OverviewBar.prototype._StaticCircle=function(data){
		var self = this,
			rx = this._opts.circleRX,
        	ry = this._opts.circleRY,
        	r = this._opts.circleR,
        	score = data.score,
        	status = data.status,
        	c_stroke_width = this._opts.c_stroke_width,
        	color = (status==0) ? colors.g1 : ((status==2) ? colors.g3 : colors.g2);
        
        	this._within = this._paper.circle(rx,ry,r).attr({"stroke": color, opacity: .9, "stroke-width": c_stroke_width});
        	this._paper.text(rx,ry,score).attr({"font-size":14,"fill":color});
	}

	OverviewBar.prototype._StaticRectBar=function(data){
		var self = this,
			rectSpeed = this._rectSpeed;
        	rectwidth = this._opts.initrectwidth,
        	rectheight = this._opts.rectHeight,
        	rectx = this._opts.circleRX + this._opts.circleR + 60,
        	recty = this._opts.circleRY - rectheight/2,
        	rectoffest = rectheight/2, //矩形进度条Y值偏移
        	responseTime = data.responseTime,//响应时间
			apdex = data.apdex,//APDEX
			errorPercent = data.errorPercent,//错误率
			//矩形进度条的颜色变化
			color1 = (responseTime==0) ? colors.g1 : ((responseTime==2) ? colors.g3 : colors.g2),
			color2 = (apdex==0) ? colors.g1 : ((apdex==2) ? colors.g3 : colors.g2),
			color3 = (errorPercent==0) ? colors.g1 : ((errorPercent==2) ? colors.g3 : colors.g2);
			//color4 = (networkErrorPercent==0) ? colors.g1 : ((networkErrorPercent==2) ? colors.g3 : colors.g2);
			//perc_period是每一段占的百分比 4个统计目标分3段
			var perc_period  = Math.round(100/2);
			//perc_icon是每一图标占的百分比 图标的大小为40
			var offest = rectheight/2;//颜色变换位置X方向偏移
        //矩形进度条
        this._rectangular = this._paper.rect(rectx,recty,rectwidth,rectheight)
        	.attr({"stroke":"#fff","stroke-width":0.1,"fill": "0-"+color1+":0-"+color1+":"+offest+"-"
        		+color2+":"+(perc_period-offest)+"-"+color2+":"+(perc_period+offest)+"-"
        		+color3+":"+(perc_period*2-offest)+"-"+color3+":"+(perc_period*2+offest)});
        this._paper.circle(rectx,recty+rectoffest,rectheight).attr({"stroke": color1, "stroke-width": 2 ,"fill" : color1});
        this._paper.circle(rectx+rectwidth*perc_period/100,recty+rectoffest,rectheight).attr({"stroke": color2, "stroke-width": 2 ,"fill" : color2});
        this._paper.circle(rectx+rectwidth*perc_period*2/100,recty+rectoffest,rectheight).attr({"stroke": color3, "stroke-width": 2 ,"fill" : color3});
       // this._paper.circle(rectx+rectwidth*perc_period*3/100,recty+rectoffest,rectheight).attr({"stroke": color4, "stroke-width": 2 ,"fill" : color4});	
	}

	OverviewBar.prototype._AnimationCircle=function(data){
		var self = this,
			rx = this._opts.circleRX,
        	ry = this._opts.circleRY,
        	r = this._opts.circleR,
        	score = data.score,
        	c_stroke_width = this._opts.c_stroke_width;
        //背景圆
        var outside = this._paper.circle(rx,ry,r).attr({stroke: "#D3D3D3", opacity: .3, "stroke-width": 15});
        //内圆
    	this._within = this._paper.path([["M", rx, ry - r], ["A", r, r, 0, 0, 1, rx + r* Math.cos(45), ry-r*Math.sin(45)]])
    				  .attr({"stroke": "#90EE90","stroke-width": c_stroke_width/*,"opacity":.8*/});
	}

	OverviewBar.prototype._createLegend = function(data){
		var self = this;
		this._paper.text(self._opts.canvasWidth-400,20,message_source_i18n.overviewInstantCount+": "+data.instantCount).attr({"font-size":"12px","text-anchor":"start","fill":"#666666"});
		this._paper.text(self._opts.canvasWidth-300,20,message_source_i18n.overviewThoughtOut+": "+data.throught).attr({"font-size":"12px","text-anchor":"start","fill":"#666666"});
		//this._paper.text(self._opts.canvasWidth-200,20,message_source_i18n.active_time+": "+data.activeTime).attr({"font-size":"12px","text-anchor":"start","fill":"#666666"});
	}

	OverviewBar.prototype._renderPaper=function(r){
		var self = this;
		var url  = this._opts.url;
		if(!url){
			//创建静态效果图
			var data = self._opts.params;
			if (data) {
				self._StaticCircle(data);
				//验证宽度，是否有足够的宽度，来显示横条
				var winWidth=$(window).width();
				//console.log("widWidth ={}",winWidth);
				if(winWidth>1480){
					self._StaticRectBar(data);
				}else{
					$("#"+this._opts.id).css("margin-left","80%");
				}
			};
		}else{
			$.ajax({
				url		:url,
				data	:self._opts.data||{},
				dataType:"text",
				type:"post",
				error	:function(XMLHttpRequest,textStatus,errorThrown) {

						},
				success :function(data, textStatus, jqXHR){
					try{
						data = eval("("+data+")").data;	
						//绘制图例
						if (self._opts.showlegend) {
							self._createLegend(data);
						};

						//创建动态效果图
						if (self._opts.animation && r) {
							//绘制圆形进度条
							self._AnimationCircle(data);
							//绘制矩形进度条
				            var rectgrow = Math.round(self._opts.rectWidth/3);
				            var i = 0;

				        	var rectwidth = self._opts.initrectwidth,
				        	rectheight = self._opts.rectHeight,
				        	rectx = self._opts.circleRX + self._opts.circleR + 86,
				        	recty = self._opts.circleRY - rectheight/2,
				        	rectoffest = rectheight/2, //矩形进度条Y值偏移
				        	responseTime = data.responseTime,//响应时间
							apdex = data.apdex,//APDEX
							errorPercent = data.errorPercent;//HTTP错误率
							//矩形进度条的颜色变化
							var barcolor = [];
							barcolor[0] = (responseTime.status==0) ? colors.g1 : ((responseTime.status==2) ? colors.g3 : colors.g2);
							barcolor[1] = (apdex.status==0) ? colors.g1 : ((apdex.status==2) ? colors.g3 : colors.g2);
							barcolor[2] = (errorPercent.status==0) ? colors.g1 : ((errorPercent.status==2) ? colors.g3 : colors.g2), 	
							//barcolor[3] = (networkErrorPercent.status==0) ? colors.g1 : ((networkErrorPercent.status==2) ? colors.g3 : colors.g2),
							//perc_period是每一段占的百分比 4个统计目标分3段
							perc_period  = Math.round(100/3),
							//perc_icon是每一图标占的百分比 小圆的大小为40
//							perc_circle = Math.round(100/(self._opts.rectWidth/52)),
							perc_circle = Math.round(26/(self._opts.rectWidth/3)*100),
							
							offest = perc_circle/2;//颜色变换位置X方向偏移
				            function run() {
				                if (i < 3) {
				                    self._within.animate({along: 1}, 800, function () {
				                        self._within.attr({along: 0});
										//1.绘制一个圆圈一个矩形
										if (i<2) {
											self._paper.rect(rectx+rectgrow*i,recty,rectwidth,rectheight)
											.attr({"stroke":"#fff","stroke-width":0.1,"fill": 
													"0-"+barcolor[i]+":0-"+barcolor[i]+":"+perc_circle+"-"+barcolor[i+1]+":"+100
												})
											.animate({"width":rectgrow}, 800, "<");
										};

										switch(i)
											{
											case 0:
												var response = self._paper.image((responseTime.status==0) ? self._root+"/img/svgprogress_01.png" : ((responseTime.status==2) ? 
				                						self._root+"/img/svgprogress_05.png" : self._root+"/img/svgprogress_03.png"),rectx+rectgrow*i-26,recty-(52-rectheight)/2,52,52);
							                		
							                		response.mouseover(function(){
							                			$(this.node).attr("href",(responseTime.status==0) ? self._root+"/img/svgprogress_02.png" : ((responseTime.status==2) ? 
							                						self._root+"/img/svgprogress_06.png" : self._root+"/img/svgprogress_04.png"))
							                			if(this.$toolTip){
														}else{
															var html = '<div class="prompt_box">\
														                	<p>'+responseTime.tooltips+'</p>\
														              	</div>';
															this.$toolTip = $(html);
															this.$toolTip.appendTo(self._$el[0]);
														}
														$(".prompt_box" ,self._$el).css({"margin-left":230,"margin-top":-60});
														this.$toolTip.show();
											        });
											        response.mouseout(function(){
							                			$(this.node).attr("href",(responseTime.status==0) ? self._root+"/img/svgprogress_01.png" : ((responseTime.status==2) ? 
							                						self._root+"/img/svgprogress_05.png" : self._root+"/img/svgprogress_03.png"))
											        	if(this.$toolTip){
															this.$toolTip.hide();
														}
											        });		
			
							                	//图例	
							                    self._paper.text(rectx+rectgrow*i,recty+rectheight*2 + 10,message_source_i18n.response_time).attr({"font-size":12,"fill": "#666666"});
							                    self._paper.text(rectx+rectgrow*i,recty-rectheight - 10,responseTime.value+responseTime.unit).attr({"font-size":12,"fill": barcolor[i]});
											 	break;
											case 1:
												var collapse = self._paper.image((apdex.status==0) ? self._root+"/img/svgprogress_01.png" : ((apdex.status==2) ? 
					                					self._root+"/img/svgprogress_05.png" : self._root+"/img/svgprogress_03.png"),(rectx+rectgrow*i) - 26,
					                					recty-(52-rectheight)/2,52,52);		
						
							                    	collapse.mouseover(function(){
							                    		$(this.node).attr("href",(apdex.status==0) ? self._root+"/img/svgprogress_02.png" : ((apdex.status==2) ? 
							                						self._root+"/img/svgprogress_06.png" : self._root+"/img/svgprogress_04.png"))
							                			if(this.$toolTip){
		
														}else{
										                	var html = '<div class="prompt_box">\
											                	<p>'+apdex.tooltips+'</p>\
											              	</div>';            	
															this.$toolTip = $(html);
															this.$toolTip.appendTo(self._$el[0]);
														}
														$(".prompt_box" ,self._$el).css({"margin-left":230+rectgrow*1,"margin-top":-60});
														this.$toolTip.show();
											        });
											        collapse.mouseout(function(){
							                    		$(this.node).attr("href",(apdex.status==0) ? self._root+"/img/svgprogress_01.png" : ((apdex.status==2) ? 
							                						self._root+"/img/svgprogress_05.png" : self._root+"/img/svgprogress_03.png"))
											        	if(this.$toolTip){
															this.$toolTip.hide();
														}
											        });
		
							                    //图例	
							                    self._paper.text(rectx+rectgrow*i,recty+rectheight*2 + 10,message_source_i18n.overviewApdex).attr({"font-size":12,"fill": "#666666"});
							                    self._paper.text(rectx+rectgrow*i,recty-rectheight - 10,apdex.value+apdex.unit).attr({"font-size":12,"fill": barcolor[i]});
											  	break;
											case 2:
												var httperror = self._paper.image((errorPercent.status==0) ? self._root+"/img/svgprogress_01.png" : ((errorPercent.status==2) ? 
					                					self._root+"/img/svgprogress_05.png" : self._root+"/img/svgprogress_03.png"),(rectx + rectgrow*i) - 26,
					                					recty-(52-rectheight)/2,52,52);			
					                		
							                		httperror.mouseover(function(){
							                			$(this.node).attr("href",(errorPercent.status==0) ? self._root+"/img/svgprogress_02.png" : ((errorPercent.status==2) ? 
							                						self._root+"/img/svgprogress_06.png" : self._root+"/img/svgprogress_04.png"))
							                			if(this.$toolTip){
		
														}else{
										                	var html = '<div class="prompt_box">\
											                	<p>'+errorPercent.tooltips+'</p>\
											              	</div>';
															this.$toolTip = $(html);
															this.$toolTip.appendTo(self._$el[0]);
														}
							                			$(".prompt_box" ,self._$el).css({"margin-left":230+rectgrow*2,"margin-top":-60});
														this.$toolTip.show();
											        });
											        httperror.mouseout(function(){
											        	$(this.node).attr("href",(errorPercent.status==0) ? self._root+"/img/svgprogress_01.png" : ((errorPercent.status==2) ? 
							                						self._root+"/img/svgprogress_05.png" : self._root+"/img/svgprogress_03.png"))
											        	if(this.$toolTip){
															this.$toolTip.hide();
														}
											        });	
							                	//图例	
							                    self._paper.text(rectx+rectgrow*i,recty+rectheight*2 + 10,message_source_i18n.overviewErrorPercent).attr({"font-size":12,"fill": "#666666"});
							                    self._paper.text(rectx+rectgrow*i,recty-rectheight - 10,errorPercent.value+errorPercent.unit).attr({"font-size":12,"fill": barcolor[i]});
												
											  	break;
											/*case 3:
												var networkerror = self._paper.image((networkErrorPercent.status==0) ? self._root+"/img/svgprogress_01.png" : ((networkErrorPercent.status==2) ? 
					                					self._root+"/img/svgprogress_05.png" : self._root+"/img/svgprogress_03.png"),(rectx + rectgrow*i) - 24,
					                					recty-(52-rectheight)/2,52,52);
					                		
							                		networkerror.mouseover(function(){
							                			$(this.node).attr("href",(networkErrorPercent.status==0) ? self._root+"/img/svgprogress_02.png" : ((networkErrorPercent.status==2) ? 
							                						self._root+"/img/svgprogress_06.png" : self._root+"/img/svgprogress_04.png"))
							                			if(this.$toolTip){
		
														}else{
										                	var html = '<div class="prompt_box">\
											                	<p>'+networkErrorPercent.tooltips+'</p>\
											              	</div>';
															this.$toolTip = $(html);
															this.$toolTip.appendTo(self._$el[0]);
														}
							                			$(".prompt_box" ,self._$el).css({"margin-left":230+rectgrow*3,"margin-top":-60});
														this.$toolTip.show();
											        });
											        networkerror.mouseout(function(){
											        	$(this.node).attr("href",(networkErrorPercent.status==0) ? self._root+"/img/svgprogress_01.png" : ((networkErrorPercent.status==2) ? 
							                						self._root+"/img/svgprogress_05.png" : self._root+"/img/svgprogress_03.png"))
											        	if(this.$toolTip){
															this.$toolTip.hide();
														}
											        });		
							                	//图例	
							                    self._paper.text(rectx+rectgrow*i,recty+rectheight*2 + 10,message_source_i18n.network_error_percent).attr({"font-size":12,"fill": "#666666"});//fill 填充字体的颜色
							                    self._paper.text(rectx+rectgrow*i,recty-rectheight - 10,networkErrorPercent.value+networkErrorPercent.unit).attr({"font-size":12,"fill": barcolor[i]});
											  	break;*/  
											}
										i++;	
				                        setTimeout(run);
				                    });
				                }else{
				                	$(self._opts.wait.node).empty();
	                            	var color = (data.status==0) ? colors.g1 : ((data.status==2) ? colors.g3 : colors.g2);
	                            	self._paper.text(self._opts.circleRX,self._opts.circleRY,data.score).attr({"font-size":60,"fill": color});
				                    self._within.attr({cri: [0, 60,data],"stroke":color});
				                    self._within.animate({cri: [data.score, 100,data]}, 900, "<");
				                }
				            }
				            run();
						}else{
							//创建静态效果图
							self._StaticCircle(data);
							self._StaticRectBar(data);
						};

					}catch(e){
						console.log("数据格式有误"+e.message);
						return;
					}
				}
			});

		}
	}

})(jQuery);
return $;
});