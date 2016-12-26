/**
 *@author lwj
 *@date 2015/07/03
 *@param periodArray 套餐上限
 *@param periodType  第几套套餐从0开始
 *@param ensurePeriodCallback 频度确定按钮的回调函数
 *@param ensureTimeCallback 自定义时间确定按钮的回调函数
 *@param initMinute 初始化分钟数
 *@param initBeignTime 初始化开始时间
 *@param initEndTime 初始化结束时间
 **/
define(function(require,exports,module){
	require("./css/tyChoiceDatePicker.css");
		(function($){
			function toDouble(num){
				var num=parseInt(num);
				return num<10?"0"+num:""+num;
			}
			var drag=function(el,options){
				    this.el=el;
					var defaults={
						disX:0,
					totalDis:100,
					   total:1,
					    minX:null,
						maxX:null,
			  mouseUpCallback:null,
			mouseMoveCallback:null,
			mouseDownCallback:null
					}
					this.opt=$.extend(defaults, (options||{}));;
					this.init();
					this.render();
				};
			var dragProperty={
				 init:function(){
					 
					 },	 
			   render:function(){
				       var self=this; 
					   var el=self.el;
				       $(el).mousedown(function(e){
						    self.clientX=e.clientX;
							self.dragging = true; 
							var oX=self.opt.disX;
							var me=this;
							self.opt.mouseDownCallback&&self.opt.mouseDownCallback.call(me,self);
						    $(document).bind({"mousemove":function(e){
								if (self.dragging) {
									oX=self.opt.disX+e.clientX-self.clientX;
									oX=self.getRightX(oX);
								    $(el).css({left:oX+"px"});
									self.opt.mouseMoveCallback&&self.opt.mouseMoveCallback.call(me,oX,self);
		                            return false;
								}
							},"mouseup":function(){
								self.dragging = false;
								$(document).unbind("mousemove mouseup");
								self.setX(oX);
								self.opt.mouseUpCallback&&self.opt.mouseUpCallback.call(me,self.getX(),self);
								e.cancelBubble = true;
							}});
						    return false;
					   }); 
					   self.setX(self.opt.disX); 
				     },
			   setX:function(x){
				   var self=this;
				   x=self.getRightX(x);
				   self.opt.disX=x;
				   $(self.el).css({left:x+"px"});
			   },
			   getX:function(x){
				  var self=this;
				  return self.getRightX(self.opt.disX);
			   },
		    setMaxX:function(x){
				  this.opt.maxX=x;
			   },
			setMinX:function(x){
				  this.opt.minX=x;
			   },
		  getRightX:function(x){
			       var self=this;
			       if(typeof self.opt.minX==="number"&&x<self.opt.minX){
					  x=self.opt.minX; 
				   }
				   if(typeof self.opt.maxX==="number"&&x>self.opt.maxX){
					  x=self.opt.maxX; 
				   }
				   return x;  
			   },
		getScale:function(){
				 return {totalDis:this.opt.totalDis,total:this.opt.total};
			   }  
			};
			$.extend(drag.prototype,dragProperty); 
			var datePickerProperty={
				getBeginTime:function(){
					           return this.beginTime;
					        },
				setBeginTime:function(t){
					          this.beginTime=t;
					        },
				getEndTime:function(){
					           return this.endTime;
					        },
				setEndTime:function(t){
					           this.endTime=t;
					        },		  
			   getHourDis:function(){
				            return this.hourDis;
				          },
			   setHourDis:function(d){
				            this.hourDis=d;
				          },
			 getMinuteDis:function(){
				            return this.minuteDis;
				          },
			 setMinuteDis:function(d){
				            this.minuteDis=d;
				          },
			getSelectDate:function(){
						     return this.selectDate;
				          },
		    setSelectDate:function(d){
					         this.selectDate=d;
						  },
			getCurrentDate:function(){
						     return this.currentDate;
				          },
		    setCurrentDate:function(d){
					         this.currentDate=d;
						  },
				compareTime:function(data1,data2){
					        return data1.getTime()-data2.getTime();
					      },
			   getDateRange:function(){
				            var self=this;
				            var min=1;
							var max=31;
							var bTime=self.getBeginTime();
							var eTime=self.getEndTime();
							var cDetailTime=self.getDetailDate(self.getCurrentDate());
							if(typeof bTime==="string"){
								var bDetailTime=self.getDetailDate(bTime);
								if(bDetailTime["year"]>cDetailTime["year"]){
									min=32;
								}else if(bDetailTime["year"]==cDetailTime["year"]&&bDetailTime["month"]>cDetailTime["month"]){
									min=32;
								}else if(bDetailTime["year"]==cDetailTime["year"]&&bDetailTime["month"]==cDetailTime["month"]){
									min=bDetailTime["date"]-0;
								}
							}
							if(typeof eTime==="string"){
								var eDetailTime=self.getDetailDate(eTime);
								if(eDetailTime["year"]<cDetailTime["year"]){
									max=0;
								}else if(eDetailTime["year"]==cDetailTime["year"]&&eDetailTime["month"]<cDetailTime["month"]){
									max=0;
								}else if(eDetailTime["year"]==cDetailTime["year"]&&eDetailTime["month"]==cDetailTime["month"]){
									max=eDetailTime["date"]-0;
								}
							}
							return {min:min,max:max};
				          },
			 getHourRange:function(){
				            var self=this;
				            var min=0;
							var max=23;
							var bTime=self.getBeginTime();
							var eTime=self.getEndTime();
							var cDetailTime=self.getDetailDate(self.getSelectDate());
							if(typeof bTime==="string"){
								var bDetailTime=self.getDetailDate(bTime);
								if(bDetailTime["year"]==cDetailTime["year"]&&bDetailTime["month"]==cDetailTime["month"]&&bDetailTime["date"]==cDetailTime["date"]){
									min=bDetailTime["hour"]-0;
								}
							}
							if(typeof eTime==="string"){
								var eDetailTime=self.getDetailDate(eTime);
								if(cDetailTime["year"]>eDetailTime["year"]){
									max=0;
								}else if(cDetailTime["year"]==eDetailTime["year"]&&cDetailTime["month"]>eDetailTime["month"]){
									max=0;
								}else if(cDetailTime["year"]==eDetailTime["year"]&&cDetailTime["month"]==eDetailTime["month"]&&cDetailTime["date"]>eDetailTime["date"]){
									max=0;
								}else if(cDetailTime["year"]==eDetailTime["year"]&&cDetailTime["month"]==eDetailTime["month"]&&cDetailTime["date"]==eDetailTime["date"]){
									max=eDetailTime["hour"]-0;
								}
							}
							return {min:min,max:max};
				          },
		   getMinuteRange:function(){
			                var self=this;
				            var min=0;
							var max=59;
							var bTime=self.getBeginTime();
							var eTime=self.getEndTime();
							var cDetailTime=self.getDetailDate(self.getSelectDate());
							if(typeof bTime==="string"){
								var bDetailTime=self.getDetailDate(bTime);
								if(bDetailTime["year"]==cDetailTime["year"]&&bDetailTime["month"]==cDetailTime["month"]&&bDetailTime["date"]==cDetailTime["date"]&&cDetailTime["hour"]==bDetailTime["hour"]){
										min=bDetailTime["minute"]-0;
								}
							}
							if(typeof eTime==="string"){
								var eDetailTime=self.getDetailDate(eTime);
								if(cDetailTime["year"]>eDetailTime["year"]){
									max=0;
								}else if(cDetailTime["year"]==eDetailTime["year"]&&cDetailTime["month"]>eDetailTime["month"]){
									max=0;
								}else if(cDetailTime["year"]==eDetailTime["year"]&&cDetailTime["month"]==eDetailTime["month"]&&cDetailTime["date"]>eDetailTime["date"]){
									max=0;
								}else if(cDetailTime["year"]==eDetailTime["year"]&&cDetailTime["month"]==eDetailTime["month"]&&cDetailTime["date"]==eDetailTime["date"]&&cDetailTime["hour"]>eDetailTime["hour"]){                   
								   max=0;
								}else if(cDetailTime["year"]==eDetailTime["year"]&&cDetailTime["month"]==eDetailTime["month"]&&cDetailTime["date"]==eDetailTime["date"]&&cDetailTime["hour"]==eDetailTime["hour"]){
								    max=eDetailTime["minute"]-0;
								}
							}
							return {min:min,max:max};
			              },
			  getFirstDay:function(date,iNow){
						     date.setMonth(date.getMonth()+iNow);
						     date.setDate(1);
						     return date.getDay();	
				           },
			  getMonthDay:function(date,iNow){
				            date.setDate(1);
							date.setMonth(date.getMonth()+iNow);
							date.setMonth(date.getMonth()+1);
							date.setDate(0);
							return date.getDate();	
						  },	
			 getDetailDate:function(date){
				            var arr=date.split(" ");
							var ymd=arr[0].split("-");
							var hmi=arr[1].split(":");
							return {year:ymd[0],
							        month:ymd[1],
									date:ymd[2],
									hour:hmi[0],
									minute:hmi[1]}
				          },
			  getHourObject:function(){
				            return this.hourObject;
					      },
			  setHourObject:function(obj){
				             this.hourObject=obj;
				          },
			getMinuteObject:function(){
				             return this.minuteObject;
					      },
			setMinuteObject:function(obj){
				             this.minuteObject=obj;
				          },
				    initDom:function(){
						     var self=this;
							 var el=self.el;
							 $(el).addClass(self.options.className);
							 self.renderDayDom();
						  }, 
				   goMonth:function(date,iNow){
					         var self=this; 
					         date.setDate(1);
							 date.setMonth(date.getMonth()+iNow);
							 self.setCurrentDate(""+date.getFullYear()+"-"+toDouble(date.getMonth()+1)+"-"+toDouble(date.getDate())+" "+toDouble(date.getHours())+":"+toDouble(date.getMinutes()));
						  },
				   goYear:function(date,iNow){
					         var self=this; 
					         date.setDate(1);
							 date.setFullYear(date.getFullYear()+iNow);
							 self.setCurrentDate(""+date.getFullYear()+"-"+toDouble(date.getMonth()+1)+"-"+toDouble(date.getDate())+" "+toDouble(date.getHours())+":"+toDouble(date.getMinutes()));
						  },
			 renderYearDom:function(){
				             var self=this;
							 var el=self.el,
							 currentDate=self.getCurrentDate(),
							 selectDate=self.getSelectDate(),
							 currentdetaildate=self.getDetailDate(currentDate),
							 selectdetaildate=self.getDetailDate(selectDate),
							 months=self.options.months,
							 $el=$(el);
							 var bYear=parseInt(parseInt(currentdetaildate["year"])/10)*10;
							 var eYear=bYear+9;
							 $el.html("");
							 var html='<div class="show_year"> <div class="prev">«</div>'
										+'<div class="next">»</div>'
										+'<h3 class="head">'+bYear+'-'+eYear+'</h3>'
										+'<ul class="years">                                      '
										+'</ul></div>';
							 $el.append(html);
							 html="";
							 html+='<li class="pass">'+(bYear-1)+'</li>';
							 for(var i=0; i<10; i++){
								 if(parseInt(selectdetaildate["year"])==(i+bYear)){
									 html+='<li class="active enable">'+(i+bYear)+'</li>';
								 }else{
									 html+='<li class="enable">'+(i+bYear)+'</li>';
								 }
				             }
							 html+='<li class="future">'+(eYear+1)+'</li>';
							 var $years=$el.find(".years");
							 $years.append(html);
							 $enable=$years.find(".enable");
							 $enable.click(function(){
								var $this=$(this);
								self.setCurrentDate($this.text()+"-"+currentdetaildate["month"]+"-"+currentdetaildate["date"]+" "+currentdetaildate["hour"]+":"+currentdetaildate["minute"]);
								self.renderMonthDom();
							 });
							  var $prev=$el.find(".prev"),$next=$el.find(".next");
							 $prev.click(function(e) {
								var oDate=new Date(currentdetaildate["year"],currentdetaildate["month"]-1,currentdetaildate["date"],currentdetaildate["hour"],currentdetaildate["minute"]);
								self.goYear(oDate,-10);
								self.renderYearDom();
		                     });
							 $next.click(function(e) {
		                        var oDate=new Date(currentdetaildate["year"],currentdetaildate["month"]-1,currentdetaildate["date"],currentdetaildate["hour"],currentdetaildate["minute"]);
								self.goYear(oDate,10);
								self.renderYearDom();
		                     });
				          },
			renderMonthDom:function(){
				             var self=this;
							 var el=self.el,
							 currentDate=self.getCurrentDate(),
							 selectDate=self.getSelectDate(),
							 currentdetaildate=self.getDetailDate(currentDate),
							 selectdetaildate=self.getDetailDate(selectDate),
							 months=self.options.months,
							 $el=$(el);
							 $el.html("");
							 var html='<div class="show_month"> <div class="prev">«</div>'
										+'<div class="next">»</div>'
										+'<h3 class="head">'+currentdetaildate["year"]+'</h3>'
										+'<ul class="months">                                      '
										+'</ul></div>';
							 $el.append(html);
							 html="";
							 for(var i=0,j=months.length; i<j; i++){
								 if(currentdetaildate["year"]==selectdetaildate["year"]&&(selectdetaildate["month"]==(i+1))){
									 html+='<li class="active enable">'+months[i]+'</li>';
								 }else{
									 html+='<li class="enable">'+months[i]+'</li>';
								 }
				             }
							 var $months=$el.find(".months");
							 $months.append(html);
							 var $enable=$months.find(".enable");
							 $enable.click(function(){
								 var $this=$(this);
								 var index=$enable.index($this);
								 self.setCurrentDate(""+currentdetaildate["year"]+"-"+toDouble(index+1)+"-"+currentdetaildate["date"]+" "+currentdetaildate["hour"]+":"+currentdetaildate["minute"]);
								 self.renderDayDom(); 
							 });
							 var $prev=$el.find(".prev"),$next=$el.find(".next"),$head=$el.find(".head");
							 $prev.click(function(e) {
								var oDate=new Date(currentdetaildate["year"],currentdetaildate["month"]-1,currentdetaildate["date"],currentdetaildate["hour"],currentdetaildate["minute"]);
								self.goYear(oDate,-1);
								self.renderMonthDom();
		                     });
							 $next.click(function(e) {
		                        var oDate=new Date(currentdetaildate["year"],currentdetaildate["month"]-1,currentdetaildate["date"],currentdetaildate["hour"],currentdetaildate["minute"]);
								self.goYear(oDate,1);
								self.renderMonthDom();
		                     });
							 $head.click(function(e) { 
		                        self.renderYearDom();
		                     });
				          },  
			  renderDayDom:function(){
					         var self=this;
					         var el=self.el,
							     currentDate=self.getCurrentDate(),
								 selectDate=self.getSelectDate(),
								 weekDay=self.options.weekDay,
							     currentdetaildate=self.getDetailDate(currentDate),
							     selectdetaildate=self.getDetailDate(selectDate),
							     oDate,
								 dataClickCallback=self.options.dataClickCallback,
							     $el=$(el);
							 $el.html("");
							 var html='<div class="show_date">'
										+'<div class="prevMonth">&lt;</div>'
										+'<div class="nextMonth">&gt;</div>'
										+'<h3 class="head">'+currentdetaildate["year"]+' '+currentdetaildate["month"]+'</h3>                        '
										+'<ol>                                      '
										+'<li class="week">'+weekDay[0]+'</li>                  '
										+'<li>'+weekDay[1]+'</li>                               '
										+'<li>'+weekDay[2]+'</li>                               '
										+'<li>'+weekDay[3]+'</li>                               '
										+'<li>'+weekDay[4]+'</li>                               '
										+'<li>'+weekDay[5]+'</li>                               '
										+'<li class="week">'+weekDay[6]+'</li>                  '
										+'</ol>                                     '
										+'<ul class="dates">                                      '
										+'</ul>' 
										+'<div class="hour_label">'+message_source_i18n.choice_hour+'：</div><div class="hour"><div class="drag_box">'
										+'<div class="drag_box_bg"></div>'
										+'<div class="drag">'+currentdetaildate["hour"]+'</div></div></div><br/>'
										+'<div class="minute_label">'+message_source_i18n.choice_minute+'：</div><div class="minute"><div class="drag_box">'
										+'<div class="drag_box_bg"></div>'
										+'<div class="drag">'+currentdetaildate["minute"]+'</div></div>'
										+'</div>'; 
							$el.append(html);
							var $dragBox=$el.find(".hour .drag_box");
							var $hourDrag=$el.find(".hour .drag");
							var maxDis=$dragBox.width()-$hourDrag.width();
							var fnMove=function(x,obj){
								   var scale=obj.getScale();
								   $(this).html(toDouble(parseInt(x*scale.total/scale.totalDis)));
								};
							var fnHourUp=function(x,obj){
								  self.setHourDis(x);
								  var scale=obj.getScale();
								  var str=toDouble(parseInt(x*scale.total/scale.totalDis));
								  currentdetaildate["hour"]=str;
								  self.setCurrentDate(currentdetaildate["year"]+"-"+currentdetaildate["month"]+"-"+currentdetaildate["date"]+" "+str+":"+currentdetaildate["minute"]);
								  selectdetaildate=self.getDetailDate(self.getSelectDate());
								  self.setSelectDate(selectdetaildate["year"]+"-"+selectdetaildate["month"]+"-"+selectdetaildate["date"]+" "+str+":"+currentdetaildate["minute"]);
								  var oM=self.getMinuteRange();
								  var scale=oMinuteDrag.getScale();
								  oMinuteDrag.setMinX(Math.ceil(oM.min*scale.totalDis/scale.total));
								  oMinuteDrag.setMaxX(oM.max*scale.totalDis/scale.total);
								  selectdetaildate=self.getDetailDate(self.getSelectDate());
								  if(oM.min>(selectdetaildate["minute"]-0)||oM.max<(selectdetaildate["minute"]-0)){
								    oMinuteDrag.setX(oM.min*scale.totalDis/scale.total);
								    self.setMinuteDis(oM.min*scale.totalDis/scale.total);
								    $minuteDrag.html(toDouble(oM.min));
									currentdetaildate["minute"]=toDouble(oM.min);
									self.setSelectDate(selectdetaildate["year"]+"-"+selectdetaildate["month"]+"-"+selectdetaildate["date"]+" "+str+":"+currentdetaildate["minute"]);
								  }
								  selectdetaildate=self.getDetailDate(self.getSelectDate());
								  self.setCurrentDate(currentdetaildate["year"]+"-"+currentdetaildate["month"]+"-"+currentdetaildate["date"]+" "+selectdetaildate["hour"]+":"+selectdetaildate["minute"])
								  self.options.hourMouseUpCallback&&self.options.hourMouseUpCallback.call(this,self);
								};
							var fnMinuteUp=function(x,obj){
								   self.setMinuteDis(x);
								   var scale=obj.getScale();
								   var str=toDouble(parseInt(x*scale.total/scale.totalDis));
								   currentdetaildate["minute"]=str;
								   selectdetaildate=self.getDetailDate(self.getSelectDate());
								   self.setCurrentDate(currentdetaildate["year"]+"-"+currentdetaildate["month"]+"-"+currentdetaildate["date"]+" "+selectdetaildate["hour"]+":"+str);
								   self.setSelectDate(selectdetaildate["year"]+"-"+selectdetaildate["month"]+"-"+selectdetaildate["date"]+" "+selectdetaildate["hour"]+":"+str);
								   self.options.minuteMouseUpCallback&&self.options.minuteMouseUpCallback.call(this,self); 
								};
							var hourRange=self.getHourRange();
							var oHourDrag=new drag($hourDrag[0],{disX:self.getHourDis()||Math.ceil((currentdetaildate["hour"]-0)*maxDis/23),
							                                     minX:Math.ceil(hourRange.min*maxDis/23),
																 maxX:hourRange.max*maxDis/23,
															 totalDis:maxDis,
															    total:23,
							                           mouseUpCallback:fnHourUp,
													 mouseMoveCallback:fnMove
																 });
							self.setHourObject(oHourDrag);
							var $minuteDrag=$el.find(".minute .drag");
							var minuteRange=self.getMinuteRange();
							var oMinuteDrag=new drag($minuteDrag[0],{disX:self.getMinuteDis()||(currentdetaildate["minute"]-0)*maxDis/59,
							                                         minX:Math.ceil(minuteRange.min*maxDis/59),
																     maxX:minuteRange.max*maxDis/59,
																 totalDis:maxDis,
																	total:59,
							                              mouseUpCallback:fnMinuteUp,
													    mouseMoveCallback:fnMove
																 });
							self.setMinuteObject(oMinuteDrag);
							var $dates=$el.find(".dates");
							$dates.html("");
							oDate=new Date(currentdetaildate["year"],currentdetaildate["month"]-1,currentdetaildate["date"],currentdetaildate["hour"],currentdetaildate["minute"]);
							var d=self.getFirstDay(oDate,0);
							var lastMonthday=self.getMonthDay(oDate,-1);
							if(d==0){
							   d=7;
							}
							html="";
							for(var i=0; i<d; i++){
					            html+='<li class="pass">'+(lastMonthday-d+i+1)+'</li>';
				            }
							$dates.append(html); 
							oDate=new Date(currentdetaildate["year"],currentdetaildate["month"]-1,currentdetaildate["date"],currentdetaildate["hour"],currentdetaildate["minute"]);
							var m=self.getMonthDay(oDate,0);
							html="";
							var dateRang=self.getDateRange();
							for(var i=0; i<m; i++){
								if(currentdetaildate["year"]==selectdetaildate["year"]&&currentdetaildate["month"]==selectdetaildate["month"]&&(selectdetaildate["date"]==(i+1))){
									html+='<li class="enable active">'+(i+1)+'</li>';
								}else{
									if(dateRang.min<=(i+1)&&(i+1)<=dateRang.max){
										html+='<li class="enable">'+(i+1)+'</li>';
									}else{
										html+='<li class="disable">'+(i+1)+'</li>';
									}
								}
				            }
							$dates.append(html);
							html="";
							for(var i=0,j=42-d-m; i<j; i++){
								html+='<li class="future">'+(i+1)+'</li>';
				            }
							$dates.append(html);
							$enable=$dates.find(".enable");
							$enable.click(function(e) {
		                        var $this=$(this);
								$el.find(".active").removeClass("active");
								$this.addClass("active");
								var date=toDouble($this.text());
								selectdetaildate=self.getDetailDate(self.getSelectDate());	
								self.setSelectDate(currentdetaildate["year"]+"-"+currentdetaildate["month"]+"-"+date+" "+selectdetaildate["hour"]+":"+selectdetaildate["minute"]);
								var oH=self.getHourRange();
								var scale=oHourDrag.getScale();
								oHourDrag.setMinX(Math.ceil(oH.min*scale.totalDis/scale.total));
								oHourDrag.setMaxX(oH.max*scale.totalDis/scale.total);
								selectdetaildate=self.getDetailDate(self.getSelectDate());
								if(oH.min>(selectdetaildate["hour"]-0)||oH.max<(selectdetaildate["hour"]-0)){
									selectdetaildate=self.getDetailDate(self.getSelectDate());
									var scale=oHourDrag.getScale();
								    oHourDrag.setX(oH.min*scale.totalDis/scale.total);
								    self.setHourDis(oH.min*scale.totalDis/scale.total);
								    $hourDrag.html(toDouble(oH.min));
									self.setSelectDate(selectdetaildate["year"]+"-"+selectdetaildate["month"]+"-"+selectdetaildate["date"]+" "+toDouble(oH.min)+":"+selectdetaildate["minute"]);
								}
								var oM=self.getMinuteRange();
								var scale=oMinuteDrag.getScale();
								oMinuteDrag.setMinX(Math.ceil(oM.min*scale.totalDis/scale.total));
								oMinuteDrag.setMaxX(oM.max*scale.totalDis/scale.total);
								selectdetaildate=self.getDetailDate(self.getSelectDate());
								if(oM.min>(selectdetaildate["minute"]-0)||oM.max<(selectdetaildate["minute"]-0)){
									selectdetaildate=self.getDetailDate(self.getSelectDate());
								    oMinuteDrag.setX(oM.min*scale.totalDis/scale.total);
								    self.setMinuteDis(oM.min*scale.totalDis/scale.total);
								    $minuteDrag.html(toDouble(oM.min));
									self.setSelectDate(selectdetaildate["year"]+"-"+selectdetaildate["month"]+"-"+selectdetaildate["date"]+" "+selectdetaildate["hour"]+":"+toDouble(oM.min));
								}
								self.options.dateClickCallback&&self.options.dateClickCallback.call(this,self);
		                    });
							var $prevMonth=$el.find(".prevMonth"),
							    $nextMonth=$el.find(".nextMonth"),
								$prevYear=$el.find(".prevYear"),
								$nextYear=$el.find(".nextYear"),
								$head=$el.find(".head");
							$prevMonth.click(function(e) {
								var oDate=new Date(currentdetaildate["year"],currentdetaildate["month"]-1,currentdetaildate["date"],currentdetaildate["hour"],currentdetaildate["minute"]);
								self.goMonth(oDate,-1);
								self.renderDayDom();
		                    });
							$nextMonth.click(function(e) {
		                        var oDate=new Date(currentdetaildate["year"],currentdetaildate["month"]-1,currentdetaildate["date"],currentdetaildate["hour"],currentdetaildate["minute"]);
								self.goMonth(oDate,1);
								self.renderDayDom();
		                    });
							/**$prevYear.click(function(e) {
								var oDate=new Date(currentdetaildate["year"],parseInt(currentdetaildate["month"])-1,currentdetaildate["date"],currentdetaildate["hour"],currentdetaildate["minute"]);
								self.goMonth(oDate,-12);
								self.renderDayDom();
		                    });
							$nextYear.click(function(e) {
		                        var oDate=new Date(currentdetaildate["year"],parseInt(currentdetaildate["month"])-1,currentdetaildate["date"],currentdetaildate["hour"],currentdetaildate["minute"]);
								self.goMonth(oDate,12);
								self.renderDayDom();
		                    });
							$head.click(function(e) {
		                        self.renderMonthDom();
		                    });**/
						 }
					
			};
			var init=function(el,options){
				   this.el=el;
				   this.options=options;
				   if(this.options.selectDate){
					  this.setCurrentDate(this.options.selectDate);
					  this.setSelectDate(this.options.selectDate);
				   }else{
					  var oDate=new Date();
					  var d=oDate.getFullYear()+"-"+toDouble(oDate.getMonth()+1)+"-"+toDouble(oDate.getDate())+" "+toDouble(oDate.getHours())+":"+toDouble(oDate.getMinutes());
					  this.setCurrentDate(d);
					  this.setSelectDate(d);
				   }
				   this.setBeginTime(this.options.beginTime);
				   this.setEndTime(this.options.endTime); 
				   this.setHourDis(this.options.hourDis);
				   this.setMinuteDis(this.options.minuteDis);   
			}; 
			$.extend(init.prototype,datePickerProperty); 
			$.fn.TyDatePicker=function(options){
				var defaults = {
					   className:"ty_calendar",
					   selectDate:null,//用户选择时间
					   weekDay:["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
					   months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
					   beginTime:null,//开始时间
					   endTime:null,//结束时间
					   hourMouseUpCallback:null,
					   hourMouseDownCallback:null,
					   minuteMouseUpCallback:null,
					   mouseDownCallback:null,
					   dateClickCallback:null,
					   hourDis:null,
					   minuteDis:null
		        }	
				var opt =  $.extend(defaults, (options||{}));		
				return this.each(function(index,element){
				    var dp=new init(element,opt);
					dp.initDom();
					$(element).data("getObj",dp);
				});
			};
			
		})(jQuery);
		;(function($){
			var drag=function(el,options){
				    this.el=el;
					var defaults={
						disX:0,
				    totalDis:100,
					   total:1,
					    minX:null,
						maxX:null,
					   count:1,
			  mouseUpCallback:null,
			mouseMoveCallback:null,
			mouseDownCallback:null
					}
					this.opt=$.extend(defaults, (options||{}));
					this.init();
					this.render();
				}
			var dragProperty={
				 init:function(){
					 
					 },	 
			   render:function(){
				       var self=this; 
					   var el=self.el;
				       $(el).mousedown(function(e){
						    self.clientX=e.clientX;
							self.dragging = true; 
							var oX=self.opt.disX;
							var me=this;
							self.opt.mouseDownCallback&&self.opt.mouseDownCallback.call(me,self);
						    $(document).bind({"mousemove":function(e){
								if (self.dragging) {
									oX=self.opt.disX+e.clientX-self.clientX;
									oX=self.getRightX(oX);
								    $(el).css({left:oX+"px"});
									self.opt.mouseMoveCallback&&self.opt.mouseMoveCallback.call(me,oX,self);
		                            return false;
								}
							},"mouseup":function(){
								self.dragging = false;
								$(document).unbind("mousemove mouseup");
								self.setX(oX);
								self.opt.mouseUpCallback&&self.opt.mouseUpCallback.call(me,self.getX(),self);
								e.cancelBubble = true;
							}});
						    return false;
					   }); 
					   self.setX(self.opt.disX); 
				     },
			   setX:function(x){
				   var self=this;
				   x=self.getRightX(x);
				   self.opt.disX=x;
				   $(self.el).css({left:x+"px"});
			   },
			   getX:function(x){
				  var self=this;
				  return self.getRightX(self.opt.disX);
			   },
		    setMaxX:function(x){
				  this.opt.maxX=x;
			   },
			setMinX:function(x){
				  this.opt.minX=x;
			   },
		  getRightX:function(x){
			       var self=this;
			       if(typeof self.opt.minX==="number"&&x<self.opt.minX){
					  x=self.opt.minX; 
				   }
				   if(typeof self.opt.maxX==="number"&&x>self.opt.maxX){
					  x=self.opt.maxX; 
				   }
				   return x;  
			   },
			   getScale:function(){
					 return {totalDis:this.opt.totalDis,total:this.opt.total};
			   } 
			};
			var myProperty={
				 render:function(){
				       var self=this; 
					   var el=self.el;
				       $(el).mousedown(function(e){
						    self.clientX=e.clientX;
							self.dragging = true; 
							var oX=self.opt.disX;
							var me=this;
							self.opt.mouseDownCallback&&self.opt.mouseDownCallback.call(me,self);
						    $(document).bind({"mousemove":function(e){
								if (self.dragging) {
									var scale=self.getScale();
									oX=self.opt.disX+e.clientX-self.clientX;
									oX=Math.round(oX*scale.total/scale.totalDis)*scale.totalDis/scale.total;
									oX=self.getRightX(oX);
								    $(el).css({left:oX+"px"});
									self.opt.mouseMoveCallback&&self.opt.mouseMoveCallback.call(me,oX,self);
		                            return false;
								}
							},"mouseup":function(){
								self.dragging = false;
								$(document).unbind("mousemove mouseup");
								self.setX(oX);
								self.opt.mouseUpCallback&&self.opt.mouseUpCallback.call(me,self.getX(),self);
								e.cancelBubble = true;
							}});
						    return false;
					   }); 
					   self.setX(self.opt.disX); 
				     }
			};
			$.extend(drag.prototype,dragProperty,myProperty);
			var chiocePeriod=function(el,options){
				   this.el=el;
				   var defaults={
						count:1,
				   }
				   this.opt=$.extend(defaults, (options||{}));
				   this.init();
				   this.render();
				   
				};
			chiocePeriodProperty={
				            init:function(){
								   var self=this;
								   $el=$(self.el);
								   $el.addClass("ty_chioceperiod");
							    },
				//把当前选择频度转化为具体的分钟数
				  setSelectMinute:function(index){
					               var self=this;
					               var oPerid=self.opt.periodArray[self.opt.periodType][index];
					               var minute=0;
							       switch(oPerid.type){
										 case "y":
											      minute=oPerid.value*60*24*30*12;
											      break;
										 case "m":
											      minute=oPerid.value*60*24*30;
									              break;
										 case "d":
											      minute=oPerid.value*60*24;
									              break;
										 
										 case "h":
											      minute=oPerid.value*60;
									              break;
										 
										 case "mi":
											      minute=oPerid.value;
									              break;
								   }
							       self.selectMinute=minute; 
							       self.setMenuLabel(index);
							     },
				  getSelectMinute:function(){
					                return this.selectMinute;
				                 },
				     getMenuLabel:function(){
				            	    return this.menuLabel;
				                },
				     setMenuLabel:function(index){
				    	            var self=this;
				    	            var oPerid=self.opt.periodArray[self.opt.periodType][index]; 
				    	            self.menuLabel=message_source_i18n.recently+oPerid.value+""+oPerid.label;
				                },
				 getIndexByMinute:function(mi){
					              var self=this;
					              $el=$(self.el); 
					              var index=0;
					              var minute=0;
					              var periodArray=self.opt.periodArray[self.opt.periodType];
					              for(var i=0;i<periodArray.length;i++){
					            	  var oP=periodArray[i];
					            	  switch(oP.type){
										 case "y":
											      minute=oP.value*60*24*30*12;
											      break;
										 case "m":
											      minute=oP.value*60*24*30;
									              break;
										 case "d":
											      minute=oP.value*60*24;
									              break;
										 
										 case "h":
											      minute=oP.value*60;
									              break;
										 
										 case "mi":
											      minute=oP.value;
									              break;
								       }  
					            	  if(mi===minute){
					            		  index=i;
					            		  break;
					            	  }
					            	  
					              }
					              return index;
				               },
						  render:function(){
							       var self=this;
								   $el=$(self.el); 
								   var periodArray=self.opt.periodArray[self.opt.periodType];
								   var count=periodArray.length-1;
								   var html='<div class="drag_box">'
								           +'<div class="drag"></div>'
								           +'<div class="drag_box_bg"><div class="drag_box_inner"></div></div>'
								           +'</div>'
								           +'<div class="drag_label_box">';
								   for(var i=0;i<periodArray.length;i++){
									     var obj=periodArray[i]; 
									     html+='<div class="label">'
									    	   +'<div class="line"><div></div></div>'
											   +'<div>'+obj.value+obj.showLabel+'</div>'
										       +'</div>';
									  }	 
								   html+='</div>';   
								   $el.html(html);
								   var $dragLabelBox=$el.find(".drag_label_box");
								   var $dragBox=$el.find(".drag_box");
								   var $drag=$el.find(".drag");
								   var maxDis=$dragBox.width()-$drag.width();
								   var $dragBoxInner=$el.find(".drag_box_inner");
								   var $label=$el.find(".drag_label_box .label");
								   $label.each(function(index,element){
									     if(index==0){
											$(this).addClass("active");
										 }
									     $(this).css("left",maxDis/count*index+"px");
								   });
								   var fnMcallback=function(x,obj){
									      $dragBoxInner.css("width",x+"px");
										  $label.removeClass("active");
										  var scale=obj.getScale();
										  var num=Math.ceil(x*scale.total/scale.totalDis);
										  $label.filter(function(index){
											 return  index<=num;
										  }).addClass("active");  
										  self.setSelectMinute(num);
									   };
								   var cindex=0;
								   if(typeof self.opt.initMinute==="number"){
									   cindex=self.getIndexByMinute(self.opt.initMinute);				   
								   }
								   var oDrag=new drag($drag[0],{ disX:Math.ceil(cindex*maxDis/count),
							                                     minX:0,
																 maxX:maxDis,
															 totalDis:maxDis,
																total:count,
																count:count,
													mouseMoveCallback:fnMcallback
															  });
								   fnMcallback(cindex*maxDis/count,oDrag);
								  $el.find(".drag_box_bg").click(function(e){ 
									  var x=$(window).scrollLeft()+e.clientX-$(this).offset().left-7;
									  var num=Math.round(x*count/maxDis);
									  var dis=num*maxDis/count;
									  oDrag.setX(dis);
									  $dragBoxInner.css("width",dis+"px");
									  $label.removeClass("active");
									  $label.filter(function(index){
										 return  index<=num;
									  }).addClass("active"); 
									  self.setSelectMinute(num);
								  });
							    }	
				
		    }; 
			$.extend(chiocePeriod.prototype,chiocePeriodProperty);
			$.fn.TyChiocePeriod=function(options){
				var defaults = {
					periodArray:[[{type:"mi",value:30,label:message_source_i18n.choice_minute,showLabel:"m"},//套餐1
					              {type:"h",value:1,label:message_source_i18n.choice_hour,showLabel:"H"},
								  {type:"h",value:6,label:message_source_i18n.choice_hour,showLabel:"H"},
					              {type:"h",value:12,label:message_source_i18n.choice_hour,showLabel:"H"},
								  {type:"d",value:1,label:message_source_i18n.choice_day,showLabel:"D"},
					              {type:"d",value:3,label:message_source_i18n.choice_day,showLabel:"D"}],
								 [{type:"mi",value:30,label:message_source_i18n.choice_minute,showLabel:"m"},//套餐2
					              {type:"h",value:1,label:message_source_i18n.choice_hour,showLabel:"H"},
								  {type:"h",value:6,label:message_source_i18n.choice_hour,showLabel:"H"},
					              {type:"h",value:12,label:message_source_i18n.choice_hour,showLabel:"H"},
								  {type:"d",value:1,label:message_source_i18n.choice_day,showLabel:"D"},
								  {type:"d",value:3,label:message_source_i18n.choice_day,showLabel:"D"},
								  {type:"d",value:7,label:message_source_i18n.choice_day,showLabel:"D"},
					              {type:"d",value:14,label:message_source_i18n.choice_day,showLabel:"D"}],
				                 [{type:"mi",value:30,label:message_source_i18n.choice_minute,showLabel:"m"},//套餐3
					              {type:"h",value:1,label:message_source_i18n.choice_hour,showLabel:"H"},
								  {type:"h",value:6,label:message_source_i18n.choice_hour,showLabel:"H"},
					              {type:"h",value:12,label:message_source_i18n.choice_hour,showLabel:"H"},
								  {type:"d",value:1,label:message_source_i18n.choice_day,showLabel:"D"},
								  {type:"d",value:3,label:message_source_i18n.choice_day,showLabel:"D"},
								  {type:"d",value:7,label:message_source_i18n.choice_day,showLabel:"D"},
					              {type:"d",value:14,label:message_source_i18n.choice_day,showLabel:"D"},
								  {type:"m",value:1,label:message_source_i18n.choice_month,showLabel:"M"},
								  {type:"m",value:2,label:message_source_i18n.choice_month,showLabel:"M"},
					              {type:"m",value:3,label:message_source_i18n.choice_month,showLabel:"M"}],
								 [{type:"mi",value:30,label:message_source_i18n.choice_minute,showLabel:"m"},//套餐4
						          {type:"h",value:1,label:message_source_i18n.choice_hour,showLabel:"H"},
								  {type:"h",value:6,label:message_source_i18n.choice_hour,showLabel:"H"},
						          {type:"h",value:12,label:message_source_i18n.choice_hour,showLabel:"H"},
								  {type:"d",value:1,label:message_source_i18n.choice_day,showLabel:"D"},
								  {type:"d",value:3,label:message_source_i18n.choice_day,showLabel:"D"},
								  {type:"d",value:7,label:message_source_i18n.choice_day,showLabel:"D"},
						          {type:"d",value:14,label:message_source_i18n.choice_day,showLabel:"D"},
								  {type:"m",value:1,label:message_source_i18n.choice_month,showLabel:"M"},
								  {type:"m",value:2,label:message_source_i18n.choice_month,showLabel:"M"},
						          {type:"m",value:3,label:message_source_i18n.choice_month,showLabel:"M"}],
						         [{type:"mi",value:30,label:message_source_i18n.choice_minute,showLabel:"m"},//套餐5 腾讯云 数据7天,索引为4
					              {type:"h",value:1,label:message_source_i18n.choice_hour,showLabel:"H"},
								  {type:"h",value:6,label:message_source_i18n.choice_hour,showLabel:"H"},
					              {type:"h",value:12,label:message_source_i18n.choice_hour,showLabel:"H"},
								  {type:"d",value:1,label:message_source_i18n.choice_day,showLabel:"D"},
								  {type:"d",value:3,label:message_source_i18n.choice_day,showLabel:"D"},
								  {type:"d",value:7,label:message_source_i18n.choice_day,showLabel:"D"}]
					            ],
					periodType:2,
					initMinute:null,//初始化分钟，如果存在，就会根据初始化分钟初始化滚动条
				};
			    var opt =  $.extend(defaults, (options||{}));
				return this.each(function(index,element){
				     var cp=new chiocePeriod(element,opt);
					 $(element).data("getObj",cp);
				});
			}
			
		})(jQuery);
		;(function($){
			function toDouble(num){
				var num=parseInt(num);
				return num<10?"0"+num:""+num;
			}
			var choiceDateProperty={
			                       init:function(){ 
			                    	      if(this.opt.timeType==2&&this.opt.initEndTime){
			                    	    	  this.opt.initBeignTime=this.getBeginTimeByEndTimeAndMinute(this.opt.initEndTime,this.opt.initMinute);
			                    	      }
										  var self=this; 
										  var el=self.el;
										  $(el).addClass("ty_choiceDatePicker");
										  $(el).find(".choiceDatePicker_box,.choiceDatePicker_menu").remove();
										  var html= '<div class="choiceDatePicker_menu">'
											        +'</div>'
											        +'<div class="choiceDatePicker_box" >'
											        +'<div class="choiceDatePicker_head">'
											        +'   <span class="title">'+message_source_i18n.choice_time+'</span>  '
											        +'   <span class="time_selection_close"></span>  '
											        +'</div>'
													+'<div class="choiceDatePicker_tab_header">'
													+'<span>'+message_source_i18n.recently+'&nbsp;</span><span class="change_tab">'
													+'<div class="change_button_bg">'
													+'<div class="change_button"></div>'
													+'</div></span><span>&nbsp;'+message_source_i18n.specifiedTime+'</span>'
													+'</div>'
													+'  <div class="tab_content">'
													+'  <div class="chioceperiod"></div>'
													+'   <div class="bottom1">'
													+'     <div class="ensure ensure_period">'+message_source_i18n.settings+'</div>'
													+'   </div>'
													+'  </div>'
													+'<div class="tab_content">'
													+'<div class="selectTime_box">'
													+'</div>'
													+	'<div class="left">'
													+	  ' <div class="tyDatePicker_label"><span class="l">'+message_source_i18n.choice_start_time+'</span><span class="begin_tyDatePicker_text"></span></div>'
													+	  ' <div class="begin_tyDatePicker"></div>'
													+	'</div>'
													+	'<div class="right">'
													+	 '  <div class="tyDatePicker_label"><span class="l">'+message_source_i18n.choice_end_time+'</span><span class="end_tyDatePicker_text"></span></div>'
													+	 '  <div class="end_tyDatePicker"></div>'
													+	'</div>'
													+'   <div style="clear:both;"></div>'
													+'   <div class="bottom2">'
													+'     <div class="ensure ensure_time">'+message_source_i18n.settings+'</div>'
													+'   </div>'
													+  '</div>'
													+'</div>';
										  $(el).append(html);
										  var $cMenu=$(el).find(".choiceDatePicker_menu,.time_selection_close");
										  var $cBox=$(el).find(".choiceDatePicker_box");
										  $cMenu.click(function(){
											  $cBox.toggle(); 
											  var $icon=$cMenu.find(".icon");
											  $icon.toggleClass("active");
										  });
										 var oDate=new Date();
										 self.initTime=""+oDate.getFullYear()+"-"+toDouble(oDate.getMonth()+1)+"-"+toDouble(oDate.getDate())+" "+toDouble(oDate.getHours())+":"+toDouble(oDate.getMinutes());
					                   },
		getBeginTimeByEndTimeAndMinute :function(e,m){
			                              var detail=this.getDetailDate(e);
			                              var oDate=new Date(detail["year"],detail["month"]-1,detail["date"],detail["hour"],detail["minute"]-m);
			                              return ""+oDate.getFullYear()+"-"+toDouble(oDate.getMonth()+1)+"-"+toDouble(oDate.getDate())+" "+toDouble(oDate.getHours())+":"+toDouble(oDate.getMinutes()); 
		                                },             
						 getDetailDate:function(date){
										var arr=date.split(" ");
										var ymd=arr[0].split("-");
										var hmi=arr[1].split(":");
										return {year:ymd[0],
												month:ymd[1],
												date:ymd[2],
												hour:hmi[0],
												minute:hmi[1]}
				                       },
							 getEndTime:function(date){
								           var self=this;
										   if(self.opt.periodType<self.opt.periodArray.length){
										     var oPerid=self.opt.periodArray[self.opt.periodType];
											 var bTime=self.getDetailDate(date);
											 var eTime;
		                                     switch(oPerid.type){
												 case "y":
													      eTime=new Date(bTime["year"],bTime["month"]-1,bTime["date"]+parseInt(oPerid.value)+30*12,bTime["hour"],bTime["minute"]);
											              break;
												 case "m":
												          eTime=new Date(bTime["year"],bTime["month"]-1,(bTime["date"]-0)+oPerid.value*30,bTime["hour"],bTime["minute"]);//套餐为月份*天数,即30*月份
											              break;
												
												 case "d":
												          eTime=new Date(bTime["year"],bTime["month"]-1,(bTime["date"]-0)+oPerid.value,bTime["hour"],bTime["minute"]);
											              break;
												
												 case "h":
												          eTime=new Date(bTime["year"],bTime["month"]-1,bTime["date"],(bTime["hour"]-0)+oPerid.value,bTime["minute"]);
											              break;
												 
												 case "mi":
												          eTime=new Date(bTime["year"],bTime["month"]-1,bTime["date"],bTime["hour"],bTime["minute"]+oPerid.value);
											              break;
												 
											  }
										   }
										   if(eTime){
											  return ""+eTime.getFullYear()+"-"+toDouble(eTime.getMonth()+1)+"-"+toDouble(eTime.getDate())+" "+toDouble(eTime.getHours())+":"+toDouble(eTime.getMinutes()); 
										   }else{
											 return date;
										   }
									   },
						   getBeginTime:function(){
			    	             var self=this;
			    	             if(self.opt.chocieRangArray&&self.opt.chocieRangArray.length>0){
			    	            	 var c=self.opt.chocieRangArray[self.opt.periodType];
			    	            	 if(!c.enable){
			    	            		 return null;
			    	            	 }
			    	            	 var minute=0;
			    	            	 switch(c.type){
			    	            	 case "y":
									      minute=c.value*60*24*30*12;
									      break;
								     case "m":
									      minute=c.value*60*24*30;
							              break;
								     case "d":
									      minute=c.value*60*24;
							              break;
								 
								      case "h":
									      minute=c.value*60;
							              break;
								 
								      case "mi":
									      minute=c.value;
							              break;
									 
								  }
			    	            	return self.getBeginTimeByEndTimeAndMinute(self.initTime,minute);
							   }			    	 
			                 },	
					 getBeginDataPicker:function(){
						                  return this.beginDataPicker;  
						               },
			         setBeginDataPicker:function(obj){
						                  this.beginDataPicker=obj;
						               },
					   getEndDataPicker:function(){
						                  return this.endDataPicker;  
						               },
			           setEndDataPicker:function(obj){
						                  this.endDataPicker=obj;
						               },
					 getPeriodObject:function(){
							              return this.periodObject;  
							           },
				     setPeriodObject:function(obj){
							              this.periodObject=obj;
							           },
					             render:function(){
										  var self=this;
										  var el=self.el;
										  var $el=$(el);
										  var bCallback=function(obj){
											    $el.find(".begin_tyDatePicker_text").text(obj.getSelectDate());
											    var sDate=obj.getSelectDate();
											    var beginT=sDate;
											    if(self.opt.minTimeSpan>0){
											    	beginT=self.getBeginTimeByEndTimeAndMinute(beginT,-self.opt.minTimeSpan);
											    	sDate=beginT;
											    }
											    var endT=self.getEndTime(beginT);
												  if(endT>self.initTime){
													  endT=self.initTime;
												  } 
												var beforeEndObj=self.getEndDataPicker();
												var beforeEndDate=beforeEndObj.getSelectDate();
												var beforeEndHourDis=null;
												var beforeEndMinuteDis=null;
												if(beforeEndDate>=beginT&&beforeEndDate<=endT){
													sDate=beforeEndDate;
													beforeEndHourDis=beforeEndObj.getHourDis();
													beforeEndMinuteDis=beforeEndObj.getMinuteDis();
												 }
												$el.find(".end_tyDatePicker").TyDatePicker({
													                                  selectDate:sDate,
											                                           beginTime:beginT,
										                                                 endTime:endT,
											                                 hourMouseUpCallback:eCallback,
										                                   minuteMouseUpCallback:eCallback,
																			   dateClickCallback:eCallback,
																			             hourDis:beforeEndHourDis,
																			           minuteDis:beforeEndMinuteDis
										                                             });
												self.setEndDataPicker($el.find(".end_tyDatePicker").data("getObj"));
										        $el.find(".end_tyDatePicker_text").text(sDate); 	
												
											  }
										  var eCallback=function(obj){
											    $el.find(".end_tyDatePicker_text").text(obj.getSelectDate());
											  }
										  var initBeignTime=null;
										  var sbTime=self.initTime;
										  if(self.opt.defaultTimeSpan>0&&(!self.opt.initEndTime)){
											  sbTime=self.getBeginTimeByEndTimeAndMinute(sbTime,self.opt.defaultTimeSpan);
										  }
										  if(self.opt.initBeignTime&&self.opt.initBeignTime<sbTime){
											  sbTime=self.opt.initBeignTime;
										  }
										  var endTime=self.initTime;
										  if(self.opt.minTimeSpan>0){
											  endTime=self.getBeginTimeByEndTimeAndMinute(endTime,self.opt.minTimeSpan);
										  }
										  $el.find(".begin_tyDatePicker").TyDatePicker({beginTime:self.getBeginTime(),
											                                            endTime:endTime,
											                                         selectDate:sbTime,
											                                            hourMouseUpCallback:bCallback,
										                                              minuteMouseUpCallback:bCallback,
																						  dateClickCallback:bCallback
										                                               });
							              var $oB=$el.find(".begin_tyDatePicker");
										  var oB=$oB.data("getObj");
										  self.setBeginDataPicker(oB);
										  $el.find(".begin_tyDatePicker_text").text(oB.getSelectDate());
										  var endT=self.getEndTime(oB.getSelectDate());
										  if(endT>self.initTime){
											  endT=self.initTime;
										  }
										  var seTime=self.initTime;
										  if(self.opt.initEndTime&&self.opt.initEndTime<seTime){
											  seTime=self.opt.initEndTime;
										  }
										  $el.find(".end_tyDatePicker").TyDatePicker({ 
										                                              selectDate:seTime,
											                                           beginTime:oB.getSelectDate(),
										                                                 endTime:endT,
											                                 hourMouseUpCallback:eCallback,
										                                   minuteMouseUpCallback:eCallback,
																			   dateClickCallback:eCallback
										                                             });
										  var $cMenu=$(el).find(".choiceDatePicker_menu");
										  var html='<span class="box">'
										          +'<span class="b">'+ sbTime+'</span>'
												  +'<span class="span-c">~</span>'
										          +'<span class="e">'+ seTime+'</span>'
										          +'</span>'
										          +'<span class="icon"></span>';
										  if(self.opt.timeType==2){
											  $cMenu.html(html);
										  }
										  
										  var $oE=$el.find(".end_tyDatePicker");
										  var oE=$oE.data("getObj");
										  self.setEndDataPicker(oE);
		                                  $el.find(".end_tyDatePicker_text").text(oE.getSelectDate());
										  //以下是频度选择条
										  var $CP=$el.find(".chioceperiod");
										  $CP.TyChiocePeriod({periodType:self.opt.periodType,
											                  initMinute:self.opt.initMinute
														     });
										  var CP=$CP.data("getObj");
										  
										  if(self.opt.timeType==1){
											  $cMenu.html('<span class="p">'+CP.getMenuLabel()+'</span><span class="icon"></span>');
										  }
										  
										  self.setPeriodObject(CP);
										  $el.find(".tab_content").eq(self.opt.timeType-1).show();
										  var $changeButton=$el.find(".change_button");
										  var $changeButtonBg=$el.find(".change_button_bg");
										  if(self.opt.timeType==1){
											  $changeButton.addClass("active");
										  }
										  if(self.opt.periodType!==0){
											  $changeButtonBg.click(function(){
												  $changeButton.toggleClass("active");
												  if(self.opt.timeType==1){
													 self.opt.timeType=2;
												  }else{
													 self.opt.timeType=1;
												  }
												  $el.find(".tab_content").hide();
												  $el.find(".tab_content").eq(self.opt.timeType-1).show(); 
											  }); 
										  }else{
											  $changeButtonBg.addClass("disable");
											  $cth=$(".choiceDatePicker_tab_header");
											  $cth.append('<div style="color:red;float:left;margin-top:15px;margin-left:15px;">'+message_source_i18n.time_validate_3+'</div>');
										  }
										  
										  var $inputTimePeriod=$el.find(".input_timePeriod");
										  var $inputEndTime=$el.find(".input_endTime");
										 // var $inputStartTime=$el.find(".input_startTime");
										  var $inputTimeType=$el.find(".input_timeType");
										  $el.find(".ensure_period").click(function(){
											  //固定的分钟数
											  $inputTimePeriod.val(self.getPeriodObject().getSelectMinute());
											  $inputTimeType.val("1");
											  $inputEndTime.val(""); 
											  var oP=self.getPeriodObject();
											  $cMenu.html('<span class="p">'+oP.getMenuLabel()+'</span><span class="icon"></span>');
											  $(el).find(".choiceDatePicker_box").hide(); 
											  self.opt.ensurePeriodCallback&&self.opt.ensurePeriodCallback.call(this,self);
										  });
		                                  $el.find(".ensure_time").click(function(){
		                                	  //自定义分钟数
		                                	  var bTime=self.getBeginDataPicker().getSelectDate();
		                                	  var eTime=self.getEndDataPicker().getSelectDate();
		                                	  var getDetailDate=self.getBeginDataPicker().getDetailDate;
		                                	  var bDetail=getDetailDate.call(this,bTime);
		                                	  var eDetail=getDetailDate.call(this,eTime);
		                                	  var bDate=new Date(bDetail["year"],bDetail["month"]-1,bDetail["date"],bDetail["hour"],bDetail["minute"]);
		                                	  var eDate=new Date(eDetail["year"],eDetail["month"]-1,eDetail["date"],eDetail["hour"],eDetail["minute"]);
		                                	  var minute=(eDate.getTime()-bDate.getTime())/1000/60;
		                                	  $inputTimePeriod.val(minute);
		                                	//  $inputStartTime.val(bTime);
		                                	  $inputTimePeriod.val(minute);
											  $inputTimeType.val("2");
											  $inputEndTime.val(eTime);
											  var html='<span class="box">'
												      +'<span class="b">' +bTime+'</span>'
												      +'<span class="span-c">~</span>'
												      +'<span class="e">'+ eTime+'</span>'
												      +'</span>'
												      +'<span class="icon"></span>'
											  $cMenu.html(html);
											  $(el).find(".choiceDatePicker_box").hide();
		                                	  self.opt.ensureTimeCallback&&self.opt.ensureTimeCallback.call(this,self);
										  });
					                   }
				};
				function choiceDatePicker(el,opt){
					this.el=el;
					this.opt=opt;
					this.init();
					this.render();
				}
				$.extend(choiceDatePicker.prototype,choiceDateProperty); 
			$.fn.TyChoiceDatePicker=function(options){
				var defaults = {
					periodArray:[{type:"d",value:3},{type:"d",value:14},{type:"m",value:3},{type:"m",value:3}],//套餐上限
					chocieRangArray:[{enable:true,type:"d",value:3},
					                 {enable:true,type:"d",value:14},
					                 {enable:true,type:"y",value:1},
					                 {enable:true,type:"y",value:1},
					                 {enable:true,type:"d",value:7}],//限制日历选择时间范围false为不限制
					periodType:1,//第几套套餐从0开始
					  timeType:1,// 1代表最近选择视图,2代码表自定义时间
		  ensurePeriodCallback:null,//频度确定回调函数
		    ensureTimeCallback:null,//自定义时间回调函数
		            initMinute:null,//初始化分钟数
		         initBeignTime:null,//初始化开始时间
		         initEndTime:null,//初始化结束
		     defaultTimeSpan:30,//初始化,默认时间跨度,开始时间和结束时间默认值,值为分钟数
		         minTimeSpan:0,//最小时间跨度值为分钟数
				};
			    var opt =  $.extend(defaults, (options||{}));
				return this.each(function(index,element){
					var periodType=$(element).attr("periodType");
					if(typeof periodType==="string"){
						opt.periodType=parseInt(periodType);
					}
					var timeType=$(element).find(".input_timeType").val();
					if(typeof timeType==="string"){
						opt.timeType=parseInt(timeType);
					}
					var ensurePeriodCallback=$(element).attr("ensurePeriodCallback");
					if(typeof ensurePeriodCallback==="string"){
						ensurePeriodCallback=eval(ensurePeriodCallback);
						if($.isFunction(ensurePeriodCallback)){
							opt.ensurePeriodCallback=ensurePeriodCallback;
						}
					}
					var ensureTimeCallback=$(element).attr("ensureTimeCallback");
					if(typeof ensureTimeCallback==="string"){
						ensureTimeCallback=eval(ensureTimeCallback);
						if($.isFunction(ensureTimeCallback)){
							opt.ensureTimeCallback=ensureTimeCallback;
						}
					}
					var initMinute=$(element).find(".input_timePeriod").val();
					if(typeof initMinute==="string"&&initMinute!==""){
						opt.initMinute=parseInt(initMinute);
					}
					
					
					/**var initBeignTime=$(element).find(".input_startTime").val();
					if(typeof initBeignTime==="string"){
						opt.initBeignTime=initBeignTime;
					}**/
					
					var initEndTime=$(element).find(".input_endTime").val();
					if(typeof initEndTime==="string"&&initEndTime!==""){
						opt.initEndTime=initEndTime;
					}
					
					
				    var choiceDate=new choiceDatePicker(element,opt);
					    $(element).data("getObj",choiceDate);
				});
			}
		})(jQuery);
		
//require("../../styles/tyChoiceDatePicker.css");
return $;
});