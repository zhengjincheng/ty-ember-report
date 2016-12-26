/**
 * RumChart 1.8
 *
 */

/**
 div 上属性
 webContext		项目路径
 chartType
 chartId	    (可以指定在params中或者url中)
 chartWidth    （如果没有指定以div宽度）
 chartHight    （如果没有指定以div高度）
 url      	   （如果没有指定以from上的Action为准）
 params    		{p1:1,p2:[]}
 formId 		指定form
 forms			根据样式绑定 表单
 tooltipGroup   指定tooltipGroup  相同group会产生联动效果
 autoRefresh		表单更新自动刷新  大量表单影响性能
 showAggregateLable	显示平均数Lable
 hchartSetting	higchart 原生设置
 apdex
 showYRangeBar	 显示Y轴区间设置
 addLegendHeight 自动加载图例的高度
*/
(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}
//define(function(require, exports,modules){
//	require("./css/rumchart.css");	
//	var $=require("../json2.js");	
(function ($) {
	var message_source_i18n={
		add : "立即添加",
		cancel:"取消",
		add_dashboard:"添加自定义仪表盘",
		icon_group:"仪表盘组",
		icon_group_add:"新增",
		icon_group_save:"确定",
		icon_name:"图表别名",
		application_server_name:"应用服务器",
		excellent:"优秀",
		performance:"性能",
		general:"一般",
		dissatisfied:"不满意",
		unbearable:"难以忍受",
		intolerable:"无法忍受",
		no_data:"暂无数据",
		page_load_time:"页面加载时间",
		final_user:"最终用户",
		network_layer_time:"网络层时间",
		network:"互联网",
		firewall:"防火墙",
		web_server:"web服务器",
		code_time:"代码时间",
		external_server:"外部服务器",
		external_server_time:"外部服务器时间",
		database_server:"数据库服务器",
		database_time:"数据库时间",
		server:"服务器",
		time:"时间",
		day:"天",
		days:"天",
		minutes:"分钟",
		minute:"分钟",
		hour:"小时",
		hours:"小时",
		month:"月",
		months:"月",
		blocking_time:"阻塞时间",
		data_validate_message_1:"数据格式有误",
		hide:"隐藏",
		show:"显示",
		message_1:"个隐藏的App",
		message_2:"您当前没有事件信息",
		message_3:"小于1分钟",
		message_4:"MongoDB时间",
		
		support_emailIsNull:"邮件地址不能为空！",
		support_emailFormatError:"输入邮箱格式不正确!",
		support_keyIsNull:"关键字不能为空！",
		support_descIsNull:"描述不能为空！",
		support_submitSuccess:"提交成功！",
		support_submitFailsAndContactAdmin:"提交失败，请与管理员联系！",
		support_mailSendError:"邮件发送错误！",
		appList_confirmDeleteApp:"您确认删除该应用吗?",
		password_yourCurrentPassword:"填写当前密码",
		password_newpassword:"填写新密码",
		password_inputPassword:"填写密码!" ,
		password_newpasswordLongFormat:"新密码长度在6到32位之间!",
		password_passwordLongFormat:"密码长度在6到32位之间!",
		password_confirmNewPassword:"填写确认新密码!",
		password_2PasswordNotEqual:"新密码与确认新密码不相同!",
		password_cannotUpdatePassword:"暂时不能修改密码!",
		password_currentPasswordError:"当前密码不正确!",
		password_newPasswordError:"新密码不正确!",
		xAuthKey_ConfirmGenerateAuthKey:"确认生成授权码？",
		
		error_noHaveError:"暂无错误",
		error_all:"全部",
		errorDetail_dataError:"数据存在问题，请联系客服!",
		message_4:"MongoDB时间",
		//以下为app国际化内容
		china_xizang:"西藏",
		china_guizhou:"贵州",
		china_fujian:"福建",
		china_chongqing:"重庆",
		china_sichuan:"四川",
		china_shanghai:"上海",
		china_jiangsu:"江苏",
		china_zhejiang:"浙江",
		china_shanxi:"山西",
		china_neimeng:"内蒙古",
		china_tianjin:"天津",
		china_hebei:"河北",
		china_beijing:"北京",
		china_anhui:"安徽",
		china_yunnan:"云南",
		china_jiangxi:"江西",
		china_shandong:"山东",
		china_henan:"河南",
		china_hunan:"湖南",
		china_hubei:"湖北",
		china_guangxi:"广西",
		china_guangdong:"广东",
		china_hainan:"海南",
		china_xinjiang:"新疆",
		china_ningxia:"宁夏",
		china_qinghai:"青海",
		china_gansu:"甘肃",
		china_shanxi_1:"陕西",
		china_heilongjiang:"黑龙江",
		china_jilin:"吉林",
		china_liaoning:"辽宁",
		china_taiwan:"台湾",
		china_diaoyudao:"钓鱼岛",
		avg_data:"平均值",
		memory:"内存",
		network:"网络",
		interaction_time:"交互时间",
		app_version:"App版本",
		sys_version:"操作系统版本",
		sdk_version:"SDK版本",
		model_version:"设备型号",
		regional:"地域",
		operators:"运营商",
		access_style:"接入方式",
		process_time:"处理时间",
		close:"关闭",
		method_name:"方法名称",
		begin_time:"开始时间",
		http_request:"网络请求",
		request_url:"请求地址",
		bytes:"字节",
		response_result:"响应结果",
		count:"个",
		avg:"平均",
		pre_month:"上月",
		next_month:"下月",
		year:"年",
		week:"周",
		today:"今天",
		january:"一月",
		february:"二月",
		march:"三月",
		april:"四月",
		may:"五月",
		june:"六月",
		july:"七月",
		august:"八月",
		september:"九月",
		october:"十月",
		november:"十一月",
		december:"十二月",
		one:"一",
		two:"二",
		three:"三",
		four:"四",
		five:"五",
		six:"六",
		seven:"七",
		eight:"八",
		nine:"九",
		ten:"十",
		eleven:"十一",
		twelve:"十二",
		date:"日",
		sunday:"星期日",
		mondy:"星期一",
		tuesday:"星期二",
		wednesday:"星期三",
		thursday:"星期四",
		friday:"星期五",
		saturday:"星期六",
		sunday_0:"周日",
		mondy_1:"周一",
		tuesday_2:"周二",
		wednesday_3:"周三",
		thursday_4:"周四",
		friday_5:"周五",
		saturday_6:"周六",
		load_img_error:"加载图片错误",
		input_name:"填写名称",
		select_style:"全选/反选",
		delete_all:"全部移除",
		more:"更多",
		response_time:"响应时间",
		crash_percent:"崩溃率",
		http_error_percent:"HTTP错误率",
		network_error_percent:"网络错误率",
		active_versions:"活跃版本数",
		active_devices:"活跃设备数",
		active_time:"首次接收数据",
		detecting:"检测中",
		minutes2:"分",
		minutes3:"分",
		expand:"展开",
		collapse:"关闭",
		recently:"最近",
		timeUpTo:"截止到",
		now:"现在",
		specifiedTime:"指定时间",
		choice_time:"选择时间",
		choice_start_time:"开始时间：",
		choice_end_time:"结束时间：",
		begin:"开始：",
		end:"结束：",
		settings:"设置",
		time_validate_1:"选择的时间超出范围",
		time_validate_2:"选择的日期超出范围",
		time_validate_3:"您购买的套餐不支持自定义时间",
			
		choice_month:"月",
		
		choice_day:"天",
		
		choice_hour:"小时",
		
		choice_minute:"分钟",
		
		choice_second:"秒",
		
		message:"消息",

		firstPageText : '首页',
		firstPageTipText : '首页',
		lastPageText : '尾页',
		lastPageTipText : '尾页',
		prePageText : '上一页',
		prePageTipText : '上一页',
		nextPageText : '下一页',
		nextPageTipText : '下一页',
		totalPageBeforeText : '共',
		totalPageAfterText : '页',
		totalRecordsAfterText : '条数据',
		gopageBeforeText : '转到',
		gopageButtonOkText : '确定',
		gopageAfterText : '页',
		buttonTipBeforeText : '第',
		buttonTipAfterText : '页',
		resetZoom:'重置缩放比例',
		resetZoomTitle:'重置缩放比例(1:1)',
		no_data_1:"无数据",
		
		selfService:'自身服务',
		thirdPartyService:'第三方服务',
		
		installOsAgent:'安装操作系统探针',
		//拓扑图
		topologyTipsNormal:'正常',
		topologyTipsWarning:'警报',
		topologyTipsBadWarn:'严重警报',
		topologyTipsNoData:'无数据',
		topologyTipsEG:'图例',
		topologyEGThroughtOut:'吞吐量',
		topologyEGResponseTime:'响应时间',
		topologyEGErrorRate:'错误率',
		topologyEGCallService:'调用服务器数量',
		topologyEGCallerService:'服务应用数量',
		topologyEGView:'查看',
		topologyEGCount:'个',
		topologyDiscover:'自动发现',
		topologyLayoutAuto:'自动布局',
        topologyStartingApplicationFloatingWindow:'起始应用',
        topologyApplicationProcess:'应用过程',
        topologyInstance:'实例',
        topologyTimeConsuming:'耗时',
        topologyCallServiceNumber:'调用服务数',
        topologyCrossApplicationNumber:'跨应用数',
        topologyCorrelationTrackingNumber:'相关追踪数',
        topologyIsCalledAnApplicationWindow:'被调用应用',
        topologyCallNumber:'调用次数',
        topologyServiceSuspensionWindow:'服务',
        topologyServiceName:'服务名称',
        topologyType:'类型',
        topologyApplicationCallConnectionSuspensionWindow:'',
        topologyAgreement:'协议',
        topologyStart:'（起始）',
        overviewApdex:'Apdex',
        overviewErrorPercent:'错误率',
        overviewThoughtOut:'吞吐率',
        overviewInstantCount:'实例数量',
        successadd:'添加成功',
        failadd:'添加失败',
        successdelete:'删除成功',
        dashboardGroupNameNutNull:'分组名称不可以为空！',
        dashboardGroupIdNotNull:'请选择一个分组！',
        dashboardGroupIdSelectNotNull:'请选择分组',
        dashboardGroupBtnSure:'确定',
        dashboardGroupTitleName:'名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称'
};


	// 设置Highcharts全局配置参数
	if(Highcharts){
		Highcharts.setOptions({
			lang: {
				resetZoom:message_source_i18n.resetZoom,
				resetZoomTitle:message_source_i18n.resetZoomTitle
			},
			global: {
				useUTC: false
			}
		});
	}

	var defaults 	= {
		chartType 		  :null,
		chartId	  		  :null,
		chartWidth		  :null,
		chartHight		  :null,
		url		  		  :null,
		params	  		  :null,
		formId	  		  :null,
		tooltipGroup	  :null,
		webContext		  :null,
		onSeriesClick	  :null,
		onPointClick	  :null,
		autoRefresh		  :false,
		autoExpand		  :false,
		apdex			  :false,
		showAggregateLable:true,
		showYRangeBar	  :false,
		addLegendHeight	  :false,
		hchartSetting	  :null,
		logoUrl			  :"/assets/images/chart_logo.png",
		showWaitting	  :true,
        showApdexT        :false,
        sendRequest       :true,
        errorMsg		  :message_source_i18n.no_data+"!",//没有数据时的提示信息
        showErrorIcon	  :true//是否显示错误图表

	};
	var methods = {
		init : function (options) {
			return  this.each(function(){
			  var  $this = $(this);
			  if($this.attr("chartType")=="chinaMap"){
				if($.fn.rumChinaMap){
					$this.rumChinaMap(options);
					return true;
				}else{
					return;
				}
			  }else if($this.attr("chartType")=="apdexChart"){
				if($.fn.rumApdexChart){
					$this.rumApdexChart(options);
					return true;
				}else{
					return;
				}
			  }else if($this.attr("chartType")=="devChart"){
				if($.fn.rumDevChart){
					$this.rumDevChart(options);
					return true;
				}else{
					return;
				}
			  }else if($this.attr("chartType")=="rumMap"){
				if($.fn.rumMap){
					$this.rumMap(options);
					return true;
				}else{
					return;
				}
			  }
			  var  opts  = $.extend(true,{}, defaults, options);
				   if(!opts.chartType){
					  opts.chartType		= $this.attr("chartType");
				   }
				   if(!opts.chartId){
					  opts.chartId 			= $this.attr("chartId");
				   }
				   if(!opts.chartWidth){
					 opts.chartWidth		= $this.attr("chartWidth");
				   }
				   if(!opts.chartHeight){
					  opts.chartHeight		= $this.attr("chartHeight");
				   }
				   if(!opts.url){
					  opts.url				= $this.attr("url");
				   }
				   if(!opts.onSeriesClick){
					  opts.onSeriesClick	= $this.attr("onSeriesClick");
				   }
				   if(!opts.onPointClick){
					  opts.onPointClick	= $this.attr("onPointClick");
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

			   if(!opts.formId){
				  opts.formId		= $this.attr("formId");
			   }
			   if(!opts.tooltipGroup){
				  opts.tooltipGroup= $this.attr("tooltipGroup");
			   }

			   if(!opts.forms){
				  opts.forms = $this.attr("forms");
			   }

			   if($this.attr("showAggregateLable")){
				  opts.showAggregateLable= "true" == $this.attr("showAggregateLable")
			   }

 			   if($this.attr("showYRangeBar")){
				  opts.showYRangeBar= "true" == $this.attr("showYRangeBar")
			   }

			   if($this.attr("addLegendHeight")){
				  opts.addLegendHeight= "true" == $this.attr("addLegendHeight")
			   }

			   if($this.attr("sendRequest")){
				  opts.sendRequest= "true" == $this.attr("sendRequest")
			   }
			   
			   if($this.attr("errorMsg")){
					opts.errorMsg=$this.attr("errorMsg");
			   }
			   
			   if($this.attr("showErrorIcon")){
					opts.showErrorIcon=$this.attr("showErrorIcon");
			   }
			   
			   opts.autoRefresh = ("true"==$this.attr("autoRefresh"));
			   opts.apdex 		= ("true"==$this.attr("apdex"));
			   opts.showApdexT 	= ("true"==$this.attr("apdex"));

			   if(!opts.hchartSetting){
				  var hs = $this.attr("hchartSetting");
				  if(hs){
					try{
						opts.hchartSetting = eval("("+hs+")");
					  }catch(e){

					  }
				  }

			   }

			   if(!opts.logoUrl){
				  opts.logoUrl = $this.attr("logoUrl");
			   }
			   if(!opts.webContext){
					opts.webContext = $this.attr("webContext");
			   }
			   if(!opts.onComplete){
					opts.onComplete	= $this.attr("onComplete");
			   }
			   if($this.attr("showWaitting")){
				  opts.showWaitting= "true" == $this.attr("showWaitting")
			   }

				var	rumChart = new RumChart($this,opts);
					rumChart.draw();
			  });
		}
	};


	$.fn.rumchart = function () {
		var method ;
		var opts;
		if(arguments.length==0){
			method = "init";
			opts   = {};
		}else if( arguments.length==1&&typeof arguments[0] == "object"){
			method = "init";
			opts   = arguments[0];
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
	$.fn.rumchart.defaults= defaults;
	function RumChart(el,opts){
			this.el			= el;
			this.$el		= el;
			this.$elC		= null;
			this.opts 		= opts;
			this.setting    ={
					url	:"",
				data	:[],
				height	:100,
				width	:200,
				events	:{
						seriesClick :null,
						pointClick	:null
				}
			}
			this.chartSetting 		= null;
			this.highChart		  	= null;
			this.dataChartSetting	= null;

	}
	//初始化url
	RumChart.prototype.initUrl=function(){
		if(this.opts.url){
		   this.setting.url	= this.opts.url;
		}
		if(!this.setting.url&&this.opts.formId){
			this.setting.url = $("#"+this.opts.formId).attr("action");
		}
		if(this.setting.url&&this.opts.chartId){
			opts._url = connectUrl(opts._url,"chartId="+opts.chartId);
		}
	}

	//初始化参数
	RumChart.prototype.initParams=function(r){
		var self = this;
		//防止重绘时重复表单
		if(r){
			this.setting.data=[];

			var hs = $(this.el).attr("hchartSetting");
			if(hs){
				try{
					this.opts.hchartSetting = eval("("+hs+")");
				  }catch(e){

				  }
			 }


		}
		if(this.opts.params){
			this.setting.data = serializeArrayObject(this.opts.params);
		}
		if(this.opts.formId){
			var dataForm = $("#"+this.opts.formId).serializeArray();
			if(dataForm&&dataForm.length>0){
			   this.setting.data  = $.merge(this.setting.data,dataForm);
			}
			if(this.opts.autoRefresh&&!r){
				$("#"+this.opts.formId).find(":input").change(function(){
					if(self.$el.is(":visible")){
						self.reDraw();
					}
				});
			}
		}
		if(this.opts.forms){
			var fs 	 =  this.opts.forms.split(/\s+/);
			var $fs	 =	$(fs.join());
			if(fs.length>0){
				this.setting.data  = $.merge(this.setting.data,$fs.serializeArray());
				if(this.opts.autoRefresh&&!r){
					$fs.change(function(e){
						if(self.$el.is(":visible")){
							//
							self.reDraw();	
						}
					});
				}
			}
		}
	}
	
      




	//初始化高度和宽度
	RumChart.prototype.initHeightAndWidth=function(){
		if(this.opts.chartWidth){
			if(this.opts.chartWidth.indexOf("%")>0){
				this.setting.width = this.$el.innerWidth() * ( parseFloat(this.opts.chartWidth.substring(0,this.opts.chartWidth.indexOf("%"))) / 100.0) ;
			}else{
				this.setting.width = this.opts.chartWidth;
			}

		}else{
			this.setting.width	= this.$el.innerWidth();
		}

		if(this.opts.chartHeight){
			if(this.opts.chartHeight.indexOf("%")>0){
				this.setting.height = this.$el.innerHeight() * ( parseFloat(this.opts.chartHeight.substring(0,this.opts.chartHeight.indexOf("%"))) / 100.0) ;
			}else{
				this.setting.height = this.opts.chartHeight;
			}
		}else{
			this.setting.height= this.$el.innerHeight();
		}
		
		this.setting.height = parseFloat(this.setting.height);
		this.setting.width	= parseFloat(this.setting.width);
	}
	RumChart.prototype._createElc = function(){
		this.$elC = $('<div class="rum-chart-container" ></div>');
		this.$elC.css({width:this.setting.width,height:this.setting.height});
		if(this.opts.showYRangeBar){
			this.$elC.css({"float":"left",width:this.setting.width-20});
		}
		this.$el.append(this.$elC);
		return this.$elC;
	}

	//初始化事件
	RumChart.prototype.initEvents=function(){
		var self = this;
		if(this.opts.onSeriesClick){
			if($.isFunction(this.opts.onSeriesClick)){
				this.setting.events.seriesClick = this.opts.onSeriesClick;
			}else if(typeof this.opts.onSeriesClick == "string"){
				var f;
				try{
					f = eval(this.opts.onSeriesClick);
				}catch(e){

				}
				if($.isFunction(f)){
					this.setting.events.seriesClick = f;
				}
			}
		}

		if(this.opts.onPointClick){
			if($.isFunction(this.opts.onPointClick)){
				this.setting.events.pointClick = this.opts.onPointClick;
			}else if(typeof this.opts.onPointClick == "string"){
				var f;
				try{
					f = eval(this.opts.onPointClick);
				}catch(e){

				}
				if($.isFunction(f)){
					this.setting.events.pointClick = f;
				}
			}
		}




	}
	//初始化配置信息
	RumChart.prototype.initChartSetting=function(chartSetting){
		var self    = this;
		var $c 		= this.$el;
		var $elC	= this.$elC;
		var opts	= this.opts;
		var cs 		= chartSetting;
		var os = {
					global:{
							useUTC:false
					},
					chart	:{
						renderTo:$c[0],
						borderWidth:0,
						plotBorderWidth:0
					},
					credits :{enabled:false},
					title:{
						text:""
					},
					subtitle:{
						text:""
					},
					tooltip:{
						shared: false,
						useHTML:true,
						formatter:function(){
							return toolTipFormatter(this);
						},
						style: {
							padding: 1
						}

					}
				 };
			if(!this.opts.addLegendHeight){
				os.chart.height = this.setting.height;
			}


			os.chart.width  = this.setting.width;

			os.chart.marginTop 		= 26;
			os.chart.spacingBottom	= 24;

		if(opts.tooltipGroup){
			//plotOptions.series.point.events
			os.plotOptions = {
				series:{
					point:{
						events:{
							mouseOut:function(){
								var group =$(document).data("rum-chart-toolTipGroup-"+self.opts.toolTipGroup);
								var selfChart  = self.highChart; //$c.data("chart");
								if(!group||group.length==0){
									return;
								}
								for(var i=0;i<group.length;i++){
									if(group[i]==selfChart){
										continue;
									}
								   hideChartTooltip(group[i],this.series.name, this.x,this.category);
								}

							},
							mouseOver:function(){
								var group =$(document).data("rum-chart-toolTipGroup-"+self.opts.toolTipGroup);
								var selfChart  = self.highChart; //$c.data("chart");
								if(!group||group.length==0){
									return;
								}
								for(var i=0;i<group.length;i++){
									if(group[i]==selfChart){
										continue;
									}
									
								    showChartTooltip(group[i],this.series.name,this.x,this.category);
								}
							}
						}
					}
				}
			};
		}
		os = $.extend(true,{},cs,os);
		if(this.setting.events.pointClick){
			os = $.extend(true,{},os,{
									plotOptions:{
												  series:{
													point:{
														events:{
															click:function(){
																var params = this.params;
																var p = {};
																if(params){
																	if(typeof params=="string"){
																		try{
																			p = $.parseJSON(params)
																		}catch(e){
																		}
																	}else if(typeof params=="object"){
																		p = params;
																	}
																}
																self.setting.events.pointClick.call(self.$el,this,p);
															}
														}
													}
												  }
												}
								});
		}

		if(this.setting.events.seriesClick){
			os = $.extend(true,{},os,{
									plotOptions:{
													series:{
														events:{
															click:function(){
																var params = this.options.params;
																var p = {};
																if(params){
																	if(typeof params=="string"){
																		try{
																			p = $.parseJSON(params)
																		}catch(e){
																		}
																	}else if(typeof params=="object"){
																		p = params;
																	}
																}
																self.setting.events.seriesClick.call(self.$el,this,p);
															}
														}
													}
												}
								});
		}
		if(opts.chartType){
			os.chart.type   = opts.chartType;
		}
		if(os.chart.type&&os.chart.type.toLowerCase()=="area"){
			os = $.extend(true,{},os,{
				 plotOptions:{
					area:{
						stacking :"normal"
					},
					series: {
						stacking: 'normal'
					}
				 }
			});
		}
		if(opts.hchartSetting){
			os = $.extend(true,{},os,opts.hchartSetting);
		}
		if(os.chart.type=="pie"){
			os = $.extend(true,{},os,{
					plotOptions: {
						pie: {
							dataLabels: {
								enabled: false
							},
							showInLegend: true
						}
					}
					/**
					,
					legend: {
							align: 'right',
							verticalAlign: 'top',
							y: 100
					}
					**/
			});
		}
		if(opts.apdex){
			os = $.extend(true,{},os,{
				 yAxis:{
					title: {
						text: ""
					},
					max :1,
					min: 0,
					tickInterval: 0.01,
					minorGridLineWidth:0,
					labels: {
						formatter: function() {
								if(this.value==0||this.value==0.7||this.value==0.85||this.value==0.94||this.value==1){
									return this.value;
								}else{
									return null;
								}

						}
					}
				}
			});
		}

		return os;
	}

	RumChart.prototype._addLegendHeight=function(){
		if(this.opts.addLegendHeight){
			var height = this.highChart.legend.legendHeight;
			if(height>0){
				this.setting.height+=height;
				this.$el.height(this.$el.height()+height);
				this.$elC.height(this.setting.height);
				this.highChart.setSize(null,this.setting.height);
			}
		}
	}
	RumChart.prototype._createYRangeBar=function(){
		var self = this;
		if(this.opts.showYRangeBar){
			if(!self.highChart){
				return false;
			}
		var y = self.highChart.yAxis[0];
			var $barDiv = $('<div class="rum-chart-YRangeBar" style="float:left;" > </div>');
				$barDiv.css({height:y.height,top:y.top});
			var init   = false;
			var min	   = y.min;
			var max	   = y.max;
			var tid	  = -1;
			this.$elC.before($barDiv);
				$barDiv.slider({
					orientation: "vertical",
					range: true,
					values: [ 0, 100],
					slide: function( event, ui ) {

							if(!init){
								max = y.max
								min = y.min;
								init=true;
							}
							if(tid>0){
								clearTimeout(tid);
								//console.log("bb");
							}
							tid = setTimeout(function(){
								//y.options.startOnTick =true;
								//y.options.endOnTick=true;
								y.setExtremes(min+(max-min)*ui.values[0]/100,min+(max-min)*ui.values[1]/100);
							},200);
					}
				});
		}
	}

	RumChart.prototype.drawChart=function(chartSetting){
		//如果初始化过清除
		this.clear();
		var $c 	  = this.$el;

			chartSetting.chart.renderTo=this._createElc()[0];

		var cs 	  = chartSetting;
		
		var chart = new Highcharts.Chart(cs);
		this.highChart =chart;
		this._addLegendHeight();
		//$c.data("chart",chart);
		//$c.data("opts" ,this.opts);
		if(this.opts.tooltipGroup){
			var group =$(document).data("rum-chart-toolTipGroup-"+this.opts.toolTipGroup);
				if(!group){
					group=[];
				}
				group.push(chart);
			$(document).data("rum-chart-toolTipGroup-"+this.opts.toolTipGroup,group);
		}
		this.creatWaterMark();
		this.creatAggregateLable();
		this.creatYaxisTickUnit();
		this._createApdex();
		this._createYRangeBar();
	}


	RumChart.prototype.clear=function(){
		var  $this 	 =  this.$el;
		var  rchart  =  $this.data("chart")
		if(!rchart){
			return;
		}
		var chart	= rchart.higchart;
		if(chart){
			var opts  = chart.opts;
			if(opts&&opts.tooltipGroup){
				var group = $this.data("rum-chart-toolTipGroup-"+opts.toolTipGroup);
				  if(group&&group.length>0){
					for(var i=0;i<group.length;i++){
						if(group[i]==chart){
							group.splice(i,1)
							break;
						}
					}
				  }
			}
			$this.removeData("chart opts");
		}
		this.$el.empty();
	}

	RumChart.prototype.creatAggregateLable=function(){
		var  $this 	 = this.$el;
		var  chart 	 = this.highChart;
		var  opts	 = this.opts;
		if(!opts.showAggregateLable){
			return;
		}
		if(!chart){
			return;
		}
		
		if(chart.series){
			var tempSeriesArray = chart.series;
			var tsf = tempSeriesArray[0];
			if(tsf){
				// 堆叠图暂时不展示平均值
				if(tsf.type && tsf.type == "area"){
					return;
				}
			}
		}
		
		var text = "";
		if(chart.options.aggregateValue){
			text = chart.options.aggregateValue;
		}
		if(  !(chart.options.aggregateValue!=undefined&&chart.options.aggregateValue>0) ){
			return;
		}
		if(chart.yAxis[0].options.tickUnit){
			text = text+" ("+chart.yAxis[0].options.tickUnit+")";
		}
		var atext = chart.renderer.text(message_source_i18n.avg_data+"："+text,-1000,-1000).css({
                fontSize: '12px',
				"font-family": "Arial, 宋体, sans-serif"
            });
			atext.add();
		var box	  = atext.getBBox();
		var _x    = chart.options.chart.width-box.width-5;
		if(!isNaN(_x)){
			atext.attr({x:_x,y:14});
		}

        //以下处理显示ApdexT

        if(!opts.showApdexT){
            return;
        }

        if(chart.options.params && chart.options.params.apdexT){
            text = chart.options.params.apdexT;
        }
        if(  !(chart.options.params.apdexT != undefined && chart.options.params.apdexT > 0) ){
            return;
        }

        var apdextext = chart.renderer.text("Apdex T："+text+"(ms)",-1000,-1000).css({
            fontSize: '12px',
            "font-family": "Arial, 宋体, sans-serif"
        });
        apdextext.add();
        var apdexbox	  = apdextext.getBBox();
        _x    = chart.options.chart.width - box.width - apdexbox.width - 20;
        if(!isNaN(_x)){
            apdextext.attr({x:_x,y:14});
        }

	}

	RumChart.prototype.creatWaterMark=function(){
		var  $this 	 = this.$el;
		var  chart 	 = this.highChart;
		var  opts	 = this.opts;
		if(!chart){
			return;
		}
		// if(this.setting.height>500&&opts.logoUrl){
			// var logoImg = new Image();
				// logoImg.src		= opts.logoUrl;
				// logoImg.onload  = function() {
				// var waterWidth  = logoImg.width;
				// var waterHeight = logoImg.height;
				// var x		= chart.options.chart.width  - waterWidth;
				// var y		= chart.options.chart.height;// - waterHeight;
				// var water = chart.renderer.image(opts.logoUrl, chart.plotLeft+chart.plotWidth-waterWidth, chart.plotTop+chart.plotHeight+10, waterWidth, waterHeight).add();
			// }
		// }


		if(this.setting.width>500&&opts.logoUrl){
				var waterWidth  = 96;
				var waterHeight = 10;
				var x		= chart.options.chart.width  - waterWidth;
				var y		= chart.options.chart.height;// - waterHeight;
				var water = chart.renderer.image(opts.logoUrl, chart.plotLeft+chart.plotWidth-waterWidth, y-14, waterWidth, waterHeight).add();
		}





	}
	RumChart.prototype.showWaitting =function(){
		// var $err_box = this.$el.find(".err_box");
		// if($err_box.size()>0){
			// $err_box.remove();
		// }
		this.$el.find("div").remove();
		var html ='<div class="waitting_box"  ><span class="waitting_icon" style="" ></span></div>';
		this.$el.append(html);
		var $waitting_box = this.$el.find(".waitting_box");
			$waitting_box.height(this.setting.height).width(this.setting.width);
		var $waitting_icon= this.$el.find(".waitting_icon");
			$waitting_icon.css({"margin-left":this.setting.width/2-$waitting_icon.width()/2,"margin-top":this.setting.height/2-$waitting_icon.height()/2});
	}
	RumChart.prototype.showErr =function(err){
		// var $waitting_box = this.$el.find(".waitting_box");
		// if($waitting_box.size()>0){
			// $waitting_box.remove();
		// }
		var self =this;
		this.$el.find("div").remove();
		var html ='<div class="err_box"  ><span class="err_message_box">';
		if(self.opts.showErrorIcon=="false"||!self.opts.showErrorIcon){
			html+='<span class="err_icon" style="display:none;"></span>';
		}else{
			html+='<span class="err_icon"></span>';
		}
		html+='<span class="err_message" style="" ></span></span></div>';
		this.$el.append(html);
		var $err_box = this.$el.find(".err_box");
			$err_box.height(this.setting.height);//.width(this.setting.width);
		var $err_message_box= this.$el.find(".err_message_box");
		var $err_message	= this.$el.find(".err_message");
			$err_message.text(err);
			$err_message_box.css({"margin-left":this.setting.width/2-$err_message_box.width()/2,"margin-top":this.setting.height/2-$err_message_box.height()/2});

	}
	RumChart.prototype.hideWaittingAndErr=function(){
		var $waitting_box = this.$el.find(".waitting_box");
		if($waitting_box.length>0){
			$waitting_box.remove();
		}
	}

	RumChart.prototype.creatYaxisTickUnit=function(){
		var chart 	= this.highChart;
		var yAxises	= chart.yAxis;
		for(var i=0;i<yAxises.length;i++){
			var se = yAxises[i];
			var tick = se.options.tickUnit;
			if(tick){
				tick =" ("+tick+")";
				var te 		= chart.renderer.text(tick,-1000,-1000).add();
				var boxx	= te.getBBox();
				var x = se.left- ((yAxises.length > 1 ? yAxises.length -1 : 1) - i) * (se.left / 2 + boxx.width / 2) + i * se.width + i * (se.right / 2 - boxx.width / 2);
				if(x<4||isNaN(x)){
					x = 4;
				}else if(x >10){
					x = x -10;
				}
				//te.attr({x:x,y:se.top-boxx.height/2});
				te.attr({
						  x:x,
						  y:14,
						  fontSize: '12px',
						  "font-family": "Arial, 宋体, sans-serif"
						});
			}
		}
	}

	//绘图
	RumChart.prototype._draw=function(r){
			   if(!r){
				  r = false;
			   }
               var self   = this;
               var params = "noData";
               if(!self.opts.autoExpand && !self.$el.is(":visible")){
                    return;
               }
			   this.initUrl();
			   this.initParams(r);
			   /*var oldfs = self.$el.data("settingfs");
			   //定时刷新 每过五分钟不管什么青总总要刷新 根据参数状况无法区别用户主动刷新还是时间到刷新 以后改为后台推送在使用
			  if(self.opts.sendRequest && objequals(oldfs,self.setting.data)){
				  return;
			  }
			  self.$el.data("settingfs",self.setting.data);*/
			   this.initHeightAndWidth(this.$el,this.opts);
			   this.initEvents();
			   var url = this.setting.url;
			   if(this.opts.webContext){
				   url = this.opts.webContext + url;
			   }
			   
			   $.ajax({
					type:"post",
					url:  url,
					data:this.setting.data||{},
					dataType:"text",
					beforeSend:function(requset){
					  if(self.opts.showWaitting){
						self.showWaitting();
					  }


					},
					error:function(){
						self.showErr(message_source_i18n.load_img_error+"！");
					},
					success:function(chart){
						try{
							chart = eval("("+chart+")");
						}catch(e){
							try{
								chart = eval(chart);
								this.dataChartSetting = chart;
							}catch(e){
								//self.$el.append("data is illegal :"+e.message);
								self.showErr(message_source_i18n.load_img_error+"！");
							}

							return;
						}
						self.$el.data("chartData",chart);
						var sl = chart.series.length;
						if(!chart.series||chart.series.length==0){
							self.showErr(self.opts.errorMsg);
							return;
						}else{
							// FIXME 临时改的，以后要从dataset里改 。针对饼图 无数据的时候 多嵌套了一层。导致无法显示 暂无数据
							if(!chart.series[0].data || chart.series[0].data.length==0){
								self.showErr(message_source_i18n.no_data+"！");
								return;	
							}
//							alert("有数据，chart.series ="+chart.series);
//							alert("有数据 sl = "+sl);
							  if(self.opts.hchartSetting){
								  var hs = self.opts.hchartSetting;
								  var hsSeries = hs.series;
								  if(hsSeries){
									  var hsSeriesSetting = hsSeries[0];
									  for(var n=1;n<sl;n++){
										  hsSeries[n] = hsSeriesSetting;
									  }
									  if(hs){
										try{
											opts.hchartSetting = eval("("+hs+")");
										  }catch(e){
		
										  }
									  }
								 }
							 }
						}
						chart = self.initChartSetting(chart);
                        params= "hasData";
						self.drawChart(chart);
						
					},
					complete:function(){
                        self._onComplete(params);
					}
			   });
			   this.$el.data("chart",this);
			   if(this.setting.events.onComplete){
					setTimeout(function(){
						try{
							self.setting.events.onComplete.call(self);
						}catch(e){

						}

					},1000);
			   }
	}

	RumChart.prototype.draw=function(){
			   this._draw(false);
	}
	RumChart.prototype.reDraw=function(){
			   this._draw(true);
	}

	RumChart.prototype.getDataString=function(){
		var data = this.setting.data;
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
	RumChart.prototype.getUrl=function(){
		return this.opts.url;
	}
	RumChart.prototype.getChartType=function(){
		return this.opts.chartType;
	}
	RumChart.prototype._createApdex =function(){
		if(!this.opts.apdex){
			return;
		}
		var lines  = [0,0.7,0.85,0.94,1];
		var points = [];
		$.each(this.highChart.yAxis[0].ticks,function(k,v){
			if(!((k==0|| k==0.7 || k==0.85|| k==0.94||k==1 ))){
				v.gridLine.hide();
			}else{

			}
		});	
		var oAxisX=this.highChart.axes[0];
		var oAxisY=this.highChart.axes[1];
		for(var i=0;i<lines.length;i++){
			
			if(this.highChart.yAxis[0].ticks[lines[i]].gridLine.element.pathSegList instanceof Array){
				points.push({x:this.highChart.yAxis[0].ticks[lines[i]].gridLine.element.pathSegList[0].x,y:this.highChart.yAxis[0].ticks[lines[i]].gridLine.element.pathSegList[0].y});
			}
			/**else if(this.highChart.yAxis[0].ticks[lines[i]].gridLine.element.pathSegList.getItem){
				points.push({x:this.highChart.yAxis[0].ticks[lines[i]].gridLine.element.pathSegList.getItem(0).x,y:this.highChart.yAxis[0].ticks[lines[i]].gridLine.element.pathSegList.getItem(0).y});
			}**/
			else{
				points.push({x:oAxisX.left,y:oAxisY.top+(oAxisY.height-(oAxisY.height*lines[i]/(oAxisY.max-oAxisY.min)))});
			}

		}

		var colors = ["#f39e10","#e0da0c","#2e9fcb","#75a722"];
		for(var i=0;i<colors.length;i++){
			var start = points[i];
			var end	  = points[i+1];
			if(start&&end){
				var path1 = this.highChart.renderer.path(["M", start.x, start.y,"L", end.x, end.y])
					path1.attr({"stroke-width":10,stroke:colors[i]});
					path1.add();
			}
		}




	}
	RumChart.prototype.getExtattr=function(){
		var  extAttr = [];
			 extAttr.push({name:"showYRangeBar",value:this.opts.showYRangeBar});
			 extAttr.push({name:"addLegendHeight",value:this.opts.addLegendHeight});
		return $.toJSON(extAttr);
	}

    RumChart.prototype._onComplete = function(params){
        if(this.opts.onComplete){
            if($.isFunction(this.opts.onComplete)){
                this.setting.events.onComplete = this.opts.onComplete;
            }else if(typeof this.opts.onComplete == "string"){
                var f,sf;
                try{
                    sf = this.opts.onComplete;
                    if(params){
                        sf = this.opts.onComplete+"('"+params+"')";
                    }
                    f = eval(sf);

                }catch(e){
                    console.log(e);
                }
                if($.isFunction(f)){

                    this.setting.events.onComplete = f;
                }
            }
        }
    }
	function findTooltipObject(chart,seriesName,x,categoriy){
		var series ;
		if(chart.series){
			for(var i=0;i<chart.series.length;i++){
				if(chart.series[i].name == seriesName){
					series = chart.series[i];
					break;
				}
			}
		}else if(chart.getSelectseries){


		}


		if(!series){
			return null ;
		}
		var pindex = -1;
		for(var i=0;i<series.points.length;i++){
			if(   (series.points[i].categoriy  &&  series.points[i].categoriy==categoriy  ) || ( series.points[i].x && series.points[i].x==x)){
					pindex = i;
				break;
			}
		}
		if(pindex<0){
			return null;
		}

		return {series:series,data:series.data[pindex],point:series.points[pindex]};
	}






	function  showChartTooltip(chart,seriesName,x,categoriy){
		var obj = findTooltipObject(chart,seriesName,x,categoriy);
			if(!obj){
				return ;
			}
			obj.data.setState('hover');
			chart.tooltip.refresh(obj.point);
	}


	function hideChartTooltip(chart,seriesName,x,categoriy){
		var obj = findTooltipObject(chart,seriesName,x,categoriy);
			if(!obj){
				return ;
			}
			obj.data.setState();
			chart.tooltip.hide();
	}

	function connectUrl(url,param){
		if(url.indexOf("?")>0){
			url += "&"+param
		}else{
			url += "?"+param;
		}
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

	function toolTipFormatter(p){
		var point 	= p.point;
		if(!point){
		   return true;
		}
		var tooltip	= point.tooltip;
		if(!tooltip){
			return true;
		}
		var name =  p.series.chart.options.chart.type =="pie"?null:p.series.name;

		try{
			tooltip = $.parseJSON(tooltip);
			var t  = "<table>";
				if(name){
					t +=	"<tr><td colspan=\"2\" align=\"center\" >"+name+"</td></tr>"
				}


				t +=	"<tr><td colspan=\"2\">"+tooltip.title+"</td></tr>"
			if(tooltip.data&&tooltip.data.length>0){
			  for(var i=0;i<tooltip.data.length;i++){
				var title = tooltip.data[i].title;
				var value = tooltip.data[i].value;
				var unit = tooltip.data[i].unit;
					if(unit){
					  unit = "("+unit+")";
					}else{
						unit ="";
					}
				t +=   "<tr><td>"+title+":</td><td>"+value+unit+"</td></tr>"
			  }
			}
				t += "</table>";
			return t;
		}catch(e){
			if(typeof tooltip =="string"){
				return tooltip;
			}else{
				return true;
			}
		}
	}

	function emptyEqual(a1,a2){  
        if(a1 === null && a2 === null)  
            return 1;  
        else if(a1 === null || a2 === null)  
            return -1;  
        if(a1 === undefined && a2 === undefined)  
            return 1;  
        else if(a1 === undefined || a2 === undefined)  
            return -1;  
        if(a1 === '' && a2 === '')  
            return 1;  
        else if(a1 === '' || a2 === '')  
            return -1;  
        return 0  
    }  
    function isBothObject(a1,a2){  
        if(typeof a1 === 'object' && typeof a2 === 'object')  
            return 0;  
        else if(typeof a1 === 'object' || typeof a2 === 'object')  
            return -1  
        return 1;  
    }  
    function objequals(a1,a2){  
        var flag = 0;  
        var result = true;  
        flag = emptyEqual(a1,a2);  
        if(flag == 1)  
            return true;  
        else if(flag == -1)  
            return false;  
        flag = isBothObject(a1,a2);  
        if(flag == -1)  
            return false;  
        if(flag == 1){  
            if(a1 === a2)  
                return true;  
            else  
                return false;  
        }else{  
            for(var i in a1){  
                var oResult = arguments.callee(a1[i],a2[i])  
                if(!oResult){  
                    result = false;  
                    break;  
                }  
            }  
            for(var i in a2){  
                var oResult = arguments.callee(a2[i],a1[i])  
                if(!oResult){  
                    result = false;  
                    break;  
                }  
            }  
        }  
        return result;  
          
    }

//})(jQuery);
//return $;
}));

//});