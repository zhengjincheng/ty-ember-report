/**
rumMap 1.1

* 后台传输参数的类型
  {
	unit:"s",
	data[
		  {locationId:08012 ,value 0.15},,,
		]
  }
	

*/



(function ($) {
	var defaults ={
		chartWidth : null,
		chartHeight: null,
		url		   : null,
		forms	   : null,	
		autoRefresh:false,
		onClick	   : null,
		logoUrl	   : null,
		location   : "china",
		map		   : null	
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
									onClick = eval(onClick)
								}catch(e){
									
								}
								if($.isFunction(onClick)){
									opts.onClick = onClick;
								}
							}
						}
						opts.logoUrl	= $this.attr("logoUrl");
						
						
						opts.location	= $this.attr("location");
						if(!opts.location){
							opts.location = "china"
						}
						
						opts.map 		= window._maps_[opts.location];
						
						opts.chartAlign	= $this.attr("chartAlign");
						
						
				var	rumMap = $this.data("chart");	
				if(rumMap&&rumMap instanceof RumMap){
					rumMap.reDraw();
				}else{
					rumMap = new RumMap($this,opts);		
					rumMap.draw();
				}		
					
			});
		}
	};
	$.fn.rumMap = function () {
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
	$.fn.rumMap.defaults = defaults; 
	function Tooltip(){
			 this._toolTipContainer	= null;		
	}
	Tooltip.prototype.init=function($elc){
			 var self 	= this;
			 if(!this._toolTipContainer){
				this._toolTipContainer = $('<span style="font-size:12px;background:#333333;color:#FFFFFF;z-index:1000;position:absolute;display:none;padding:4px" ></span>');
				this._toolTipContainer.appendTo("body");
			 }
			 $elc.on("mousemove",function(e){
					var x 	   = e.pageX+15;
					var y 	   = e.pageY+15;
					self.move(x,y);
			 });
	}
	Tooltip.prototype.show=function(){
			//this.toolTipSet.show();
			this._toolTipContainer.show();
	}
	Tooltip.prototype.hide=function(){
			//this.toolTipSet.hide();
			this._toolTipContainer.hide();
	}
	Tooltip.prototype.setText=function(text){
			//this.text.attr("text",text);
			//var b = this.text.getBBox();
			//this.box.attr({width:b.width*1.5,height:b.height*1.5});
			this._toolTipContainer.text(text);
	}
	Tooltip.prototype.move =function(x,y){
			//this.toolTipSet.transform("t"+(x+this.source)+","+(y+this.source));
			this._toolTipContainer.css({"left":x,"top":y});
	}
	
	
	
	
	
	
	
	
	
	
	
	function RumMap(el,options){
		this._opts  	  = options;
		this._ratio 	  =1;
		this._el   		  = el;
		this._$el  		  = null;
		this._elId 		  = null;
		this._h	   		  = this._opts.map.height;
		this._w	   		  = this._opts.map.width;	 
		this._paper		  =null;
		this._allMap	  =null;
		this._backGround  =null;
		this._tooltip	  =null;
		this._logo		  =null;
		this._lstartText  =null;
		this._lendText	  =null;
		this._data	  	  =null;
		this._canvasHeight=this._opts.map.height;
		this._canvasWidth =this._opts.map.width;	  	
	}
	
	RumMap.prototype.initEl=function(){
		
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
				var id = "rumMapId" + (new Date()).valueOf();
				this._$el.attr("id",id);	
			}
			this._elId = this._$el.attr("id");		
		}
	}
	
	//计算比例
	RumMap.prototype.caculateRatio=function(r){
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
		if(w>0&&h==0){
			this._ratio = w/this._opts.map.width;
		}else if(w==0&&h>0){
			this._ratio = h/this._opts.map.height;
		}else if(w>0&&h>0){
			this._ratio = Math.max(w/this._opts.map.width,h/this._opts.map.height);
		}
	}
	//创建画布
	RumMap.prototype.creatPaper=function(r){
		if(r){
			this._$el.empty();
		}
		this._canvasWidth   =  this._w*this._ratio+10 ;
		this._canvasHeight  =  this._h*this._ratio+10 +30;// +30;
		this._$elc = $('<div style="position:relative"  ></div>');
		this._$elc.css({"text-align":"left","padding":0,"width":this._canvasWidth});
		if(this._opts.chartAlign=='center'){
			this._$elc.css({"margin":"0px auto"});
		}
		this._$el.append(this._$elc);	
		
		this._lpaper = Raphael(this._$elc[0],this._canvasWidth ,30);
		this._paper  = Raphael(this._$elc[0],this._canvasWidth ,this._canvasHeight);
		
	
		this._allMap = this._paper.set();	
	}
	
	RumMap.prototype.initParams=function(r){
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
	
	
	RumMap.prototype.creatBackGround=function(){
		this._backGround = this._paper.rect(0,0,this._opts.map.width, this._opts.map.height); this._allMap.push(this._backGround);
		this._backGround.attr("fill","#FFFFFF"); 
		this._backGround.attr("stroke-width",0); 
	}
	RumMap.prototype.creatEmptyMap=function(r){
		var self = this;
		this._mapGroup	= this._paper.set(); this._allMap.push(this._mapGroup);
		for(var p in this._opts.map.paths){
				var path = this._paper.path(this._opts.map.paths[p].path).attr({"stroke-width":1,"stroke-opacity":0.5});
						path.data("area",this._opts.map.paths[p]);
						path.data("name",p)
						path.data("id",this._opts.map.paths[p].localId)
						path.data("valueLable",null);
				var group = this._paper.set();
						group.push(path);
				group.mouseover(function(e){
					self._tooltip.show();
					//self._tooltip.setText(this.data("area").name);
					var valueLable = this.data("valueLable");
					if(!valueLable){
						valueLable =message_source_i18n.no_data_1;
					}
					self._tooltip.setText(this.data("area").name +" : "+valueLable);
					this.c = this.c||this.attr("fill");
					if(!this.data("valueLable")){
					  this.attr({fill: "#E6E6E6"});
					}
					
					
				});
				group.mouseout(function(e){
					this.attr("fill",this.c);
					self._tooltip.hide();
				});
				group.click(function(e){
					if(self._opts.onClick&&!self._panZoom.isDragging()){
						self._opts.onClick.call(self._$el,this.data("area").localId);
					}
				});
				this._mapGroup.push(group);
		}
		this._mapGroup.attr("fill","#F7F7F7");
	}
	RumMap.prototype.supportCreatLegend =function(){
		if(this._canvasWidth<300){
			return false;
		}
		return true;
	}
	RumMap.prototype.creatLegend=function(){
		if(!this.supportCreatLegend()){
			return;
		}
		this._legendGroup 	= this._paper.set();//this._allMap.push(this._legendGroup);
		var lstart  		= " "
		var lend			= " "
		var legendOffSetX	= 20;
		var legendOffSetY	= 5 ; //map.height -20;
		
		var lwidth  = 12;
		var lheight = 12;
		
		
		for(var i=0;i<this._opts.map.legendColors.length;i++){
			 this._legendGroup.push(this._lpaper.rect( legendOffSetX + i*(lwidth+4)+15  ,legendOffSetY,lwidth,lheight).attr(  {"fill":this._opts.map.legendColors[i],"stroke-width":0  } )  );
		}
			
		var	lstartText = this._lpaper.text(legendOffSetX,legendOffSetY+8,lstart).attr("font-size",12);	
		var	lendText   = this._lpaper.text(legendOffSetX+(this._opts.map.legendColors.length+1)*(lwidth+4)+10,legendOffSetY+8,lend).attr("font-size",12);
		this._lstartText = 	lstartText;
		this._lendText	 = 	lendText;
		this._legendGroup.push(lstartText,lendText);
			
			
	}
	
	RumMap.prototype.setMinAndMaxLable=function(lstartText,lendText){
		if(!this.supportCreatLegend()){
			return;
		}
		if(this._lstartText){
			this._lstartText.attr("text",lstartText);
		}
		if(this._lendText){
			this._lendText.attr("text",lendText);
		}
	}
	
	RumMap.prototype.creatLogo=function(){
		if(this._opts.logoUrl){
			this._logo = this._lpaper.image(this._opts.logoUrl,this._canvasWidth-120 ,5,96,10);	//this._allMap.push(this._logo);
		}
		
	}
	RumMap.prototype.creatAggregateValue=function(aggregateValue,unit){
		var self = this;
		if($("#aggregateValue",self._$elc).size()==0){
			self._$elc.append('<div id="aggregateValue" style="position:absolute;right:20px;top:10px;font-size:12px;color:#333333" ></div>');
		}
		var $aggregateValue = $("#aggregateValue",self._$elc);
		
		var text ;
		if(!unit){
		   unit ="";
		}else{
		   unit ="("+unit+")";	
		}
		if(aggregateValue&&aggregateValue>0){
			/*
			if(this._aggregateValue){
			   this._aggregateValue.remove();
			}
			
			text = this._paper.text(-1000,6,"平均值："+aggregateValue+unit);
			text.attr({
						"font-size":12,
						x:this._canvasWidth-text.getBBox().width-2,
						"font-family": "Arial, 宋体, sans-serif"
					});
			
			this._aggregateValue = text;
			*/
			$aggregateValue.text(message_source_i18n.avg_data+"："+aggregateValue+unit);
		}
		
		
		
	}
	RumMap.prototype.zoom=function(){
		//this._allMap.transform(["s",this._ratio,this._ratio,0,0]);
		this._allMap.transform("...s"+this._ratio+","+this._ratio+",0,0t0,60");
		this._panZoom  = this._paper.panzoom({initialPosition:  { x: 0, y: 0} ,initialZoom:0});
		this._panZoom.enable();
	}
	
	RumMap.prototype.divideData=function(resData){
		var self= this;	
		var max = 0;
		var min = 0;
		if(!resData.data||resData.data.length<=0){
			return;
		}
		min = resData.data[0].value;
		$.each(resData.data,function(index,value){			
				for(var i=0;i<self._mapGroup.length;i++){
						if(self._mapGroup[i][0].data("id") == value.locationId){
							 self._mapGroup[i][0].data("data",value);
							 self._mapGroup[i][0].data("valueLable",value.value+" "+resData["unit"]);
							 break;
						}	
				}

				if(value.value>max){
					max = value.value;
				}	
				if(value.value<min){
					min = value.value
				}
		});
		
		var d   = (max-min)/12;
		var dv  = [];
		for(i=0;i<12;i++){
				dv.push(min+d*i);
		}
		
		dv.push(max);
		
		var group =[];
		$.each(resData.data,function(index,value){
				for(var i=0;i<=11;i++){
						if(!group[i]){
							 		group[i]={color:self._opts.map.legendColors[i],localIds:[]};
						}
						if(dv[i]<= value.value && value.value<=dv[i+1]  ){
							 group[i].localIds.push(value.locationId);
							 break;
						}
				}   
		});
		this.setMinAndMaxLable(Math.floor(min)+""+resData.unit,Math.ceil(max)+""+resData.unit);  
		this.creatAggregateValue(resData.aggregateValue,resData.unit);
		return group;
	}
	RumMap.prototype.fillLocal=function(group){
		for(var i=0;i<group.length;i++){
			  for(var j=0;j<group[i].localIds.length;j++){
			  		for(var k=0;k<this._mapGroup.length;k++){
			  			 if(this._mapGroup[k][0].data("id")==group[i].localIds[j]){
			  			 		
			  			 		this._mapGroup[k].attr({"fill":group[i].color});
			  			 }
			  		}
			  }
		}
	}
	
	RumMap.prototype.renderLocal=function(){
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
						try{
							data = eval("("+data+")");
						}catch(e){
							try{
							 	data = eval(data);	
							}catch(ee){
								
							}
						}
					 //alert(self._mapGroup[0][0].data("id"));
					 var group = 	self.divideData(data);
						 if(group){
							self.fillLocal(group);
						 }
					}	
			});
	}
	
	
	
	RumMap.prototype.drawEmptyMap=function(r){
		this.initEl();
		this.caculateRatio(r);
		this.creatPaper(r);
		this.initParams(r);
		this.creatBackGround();
		this._initTooltip();
		this.creatEmptyMap(r);
		this.creatLegend();
		this.creatLogo();
		//this.creatAggregateValue();
		this.zoom();
		this._initZoom();
	}
	
	RumMap.prototype._initTooltip=function(){
		if(!this._tooltip){
			this._tooltip = new Tooltip();
		}
		this._tooltip.init(this._$elc);
	}
	
	//缩放控制
	RumMap.prototype._initZoom=function(r){
		var self = this;
		var $div = $('<div style="position:absolute;top:10px;left:10px;width:20px;font-size:20px;font-weight:bold;color:#333333"  ><div id="up" style="height:20px;width:20px;background:#F3F3F3;border:#CCCCCC 1px solid;text-align:center;line-height:20px;cursor:pointer" >+</div><div id="down" style="height:20px;width:20px;background:#F3F3F3;border:#CCCCCC 1px solid;text-align:center;line-height:20px;cursor:pointer;margin-top:8px" >-</div></div>');
		this._$elc.append($div);
		$("#up",$div).on("click",function(e){
			self._panZoom.zoomIn(1);
			e.preventDefault();
		});
		
		$("#down",$div).on("click",function(e){
			self._panZoom.zoomOut(1);
			e.preventDefault();
		});
	}
	
	
	
	RumMap.prototype._draw=function(r){
		this.drawEmptyMap(r);
		this.renderLocal();
		this._$el.data("chart",this);
	}
	RumMap.prototype.draw=function(){
		this._draw(false);
	}
	RumMap.prototype.reDraw=function(){
		this._draw(true);
	}
	RumMap.prototype.getDataString=function(){
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
	RumMap.prototype.getUrl=function(){
		return this._opts.url;
	}
	RumMap.prototype.getChartType=function(){
		return "rumMap";
	}
	RumMap.prototype.getExtattr=function(){
		var  extAttr = [];
		extAttr.push({name:"location",value:this._opts.location});
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
	
})(jQuery);
