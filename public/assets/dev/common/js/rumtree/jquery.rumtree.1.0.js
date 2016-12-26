/**
   rumtree 1.9
*/

/**
* url 		地址
  onClick	事件
  forms		绑定表单
  autoRefresh 自动刷新
  asyncEnable
  asyncUrl
  autoParam
  enablePage 分页显示
*/
define(function(require, exports,modules){
	require("./css/rumtree.css");
	require("./jquery.ztree.core-3.5.js");
(function ($) {
	var width = 240;
	var defaults ={
		url			: null,
		onClick		: null,
		asyncEnable	: false,
		asyncUrl	: null,
		autoParam	: null,
		maxLevel	: -1,
		selectNode	: null, 
		callback	: null,
		showArrows	: true,
		enableClick : true,
		enablePage  : false,
		pageSize	: 20,
		collapseParent: true,
		isSelected  : true,
		onMouseoverCallBack:null,
		isPaging : false,
		baseonMoreCallBack : null
	};

	var methods = {
		init : function (options) {
			return  this.each(function(){
				var $this = $(this);
				var opts  = $.extend(true,{data:[]}, defaults, options);
				var rumTree	= new RumTree($this,opts);
					rumTree.init();
			});
		}
	};

	function RumTree(el,opts){
			this.$el 	 = el;
			this.opts	 = opts;
			this.ztree	 = null;
			this.setting = null;
	}

	RumTree.prototype.initOpts=function(){
			var $this = this.$el;
			var opts  = this.opts;
			if(!opts.url){
				opts.url = $this.attr("url")
			}
			if(!opts.forms){
				opts.forms = $this.attr("forms");
			}
			if(!opts.enableEdit){
				opts.enableEdit =("true"==$this.attr("enableEdit"));
			}
			if(!opts.autoRefresh){
				opts.autoRefresh=("true"==$this.attr("autoRefresh"));
			}
			if(!opts.onClick){
				var onClick = $this.attr("onClick");
				if(onClick){
				   if($.isFunction(onClick) ){
						opts.onClick = onClick;
				   }else if(typeof onClick =="string" ){
					 try{
						onClick = eval(onClick);
					 }catch(e){

					 }
						if($.isFunction(onClick)){
							opts.onClick = onClick;
						}
				   }
				}
			}


			if(!opts.asyncEnable){
				opts.asyncEnable = ( $this.attr("asyncEnable")=="true" );
			}
			if(!opts.asyncUrl){
				opts.asyncUrl =	$this.attr("asyncUrl")
			}
			if(!opts.autoParam){
				try{
					opts.autoParam  = eval($this.attr("autoParam"));
				}catch(e){
					//alert(e.message)
				}
			}
			//if(!opts.maxLevel){
				opts.maxLevel = $this.attr("maxLevel");
			//}
			opts.collapseParent = $this.attr("collapseParent");
			if(!opts.selectNode){
				opts.selectNode	=$this.attr("selectNode");
			}
			if(!opts.callback){
				var callback = $this.attr("callback");
				if(callback){
				   if($.isFunction(callback) ){
						opts.callback = callback;
				   }else if(typeof callback =="string" ){
					 try{
						callback = eval(callback);
					 }catch(e){

					 }
						if($.isFunction(callback)){
							opts.callback = callback;
						}
				   }
				}
			}
            if(!opts.onMouseoverCallBack){
				var onMouseoverCallBack = $this.attr("onMouseoverCallBack");
				if(onMouseoverCallBack){
				   if($.isFunction(onMouseoverCallBack) ){
						opts.onMouseoverCallBack = onMouseoverCallBack;
				   }else if(typeof onMouseoverCallBack =="string" ){
					 try{
						onMouseoverCallBack = eval(onMouseoverCallBack);
					 }catch(e){

					 }
						if($.isFunction(onMouseoverCallBack)){
							opts.onMouseoverCallBack = onMouseoverCallBack;
						}
				   }
				}
			}
			var showArrows = $this.attr("showArrows");
			if(showArrows){
				opts.showArrows = ("true"==showArrows);
			}
			var enableClick = $this.attr("enableClick");
			if(enableClick){
				opts.enableClick = ("true"==enableClick);
			}

			var enablePage = $this.attr("enablePage");
			if(enablePage){
				opts.enablePage = ("true"==enablePage);
			}

			var isPaging = $this.attr("isPaging");
			if(isPaging){
				opts.isPaging = ("true"==isPaging);
			}

			if(!opts.baseonMoreCallBack){
				var baseonMoreCallBack = $this.attr("baseonMoreCallBack");
				if(baseonMoreCallBack){
					if($.isFunction(baseonMoreCallBack)){
						opts.baseonMoreCallBack = baseonMoreCallBack;
					}else if(typeof baseonMoreCallBack =="string" ){
						try{
							baseonMoreCallBack = eval(baseonMoreCallBack);
						}catch(e){

						}
						if($.isFunction(baseonMoreCallBack)){
							opts.baseonMoreCallBack = baseonMoreCallBack;
						}
					}
				}
			}
	}

	RumTree.prototype.initParams=function(r){
		var self = this;
		//防止重绘时重复表单
		if(r){
			this.opts.data=[];
		}
		if(this.opts.forms){
			var fs 	 =  this.opts.forms.split(/\s+/);
			var $fs	 =	$(fs.join());
			if($fs.length>0){
				this.opts.data  = $.merge(this.opts.data,$fs.serializeArray());
				if(this.opts.autoRefresh&&!r){
					$fs.change(function(e){
						self.reInit();
					});
				}
			}
		}
	}


	RumTree.prototype.initSetting=function(){
			var self 	= this;
			this.setting =  $.extend(true,{}, setting);
			var $this = this.$el;
			var opts  = this.opts;
			this.setting.async  ={
					enable	 	: opts.asyncEnable,
					url    		: opts.asyncUrl,
					autoParam	: opts.autoParam,
					dataType	:"json"

			};
			this.setting.view.addDiyDom=function(treeId,treeNode){
					treeAddDiyDom(treeId,treeNode,$this,opts);
			}
			this.setting.callback.beforeClick=function(treeId, node){
					beforeClick(treeId, node,$this);
			};
			this.setting.callback.onClick=function(e, treeId, node){
					if(!opts.enableClick){
						return;
					}
					nodeOnClick(e, treeId, node,$this,opts,self);
			};
			this.setting.callback.beforeAsync=function(treeId, node){
					if(!node){
						return false;
					}
			};
			this.setting.callback.onAsyncSuccess=function(event, treeId, treeNode, msg){
					asyncSuccess(event, treeId, treeNode, msg,$this,opts);
			};
			this.setting.callback.onAsyncError=function(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown){
					asyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown,$this,opts);
			};
			this.setting.callback.onExpand = function(event, treeId, treeNode){
					treeOnExpand(event, treeId, treeNode,$this,opts);
			};
			this.setting.callback.onCollapse = function(event, treeId, treeNode){
					treeOnCollapse(event, treeId, treeNode,$this,opts);
			};
			this.setting.async.dataFilter=function(treeId, parentNode, responseData){
					return asyncDataFilter(treeId, parentNode, responseData,$this,opts);
			};
			this.setting.async.url = function(treeId, treeNode){
					 return asyncGetAsyncUrl(treeId, treeNode,$this,opts);
			};

	}

	RumTree.prototype._initTree=function(zNodes){
			var setting = this.setting;
			var $this 	= this.$el;
			var		standard = 0;
			if(zNodes&&zNodes.length>0){
					standard = zNodes[0].value||0;
			}
			$this.data("standard",standard);
			var 	zTree = $.fn.zTree.init($this, setting, zNodes);
			$this.data("zTree_Menu",zTree);
			$this.data("ztree",zTree);
			$this.data("rumTree",this);
			$this.data("tree",this);
			this.ztree = zTree;
	}

	RumTree.prototype._addNodes = function(zNodes){
		this.ztree.addNodes(null, zNodes)
	}
	RumTree.prototype.addNodesBaseonMore = function (isAdd, pageNo){
		this.initOpts();
		this.initParams(true);
		this.initBaseonMoreParams(pageNo);
		this.initSetting();
		if(this.opts.url){
			this.ajaxBaseonTree(isAdd);
		}
	}
	RumTree.prototype.initBaseonMoreParams = function(pageNo){
		if(this.opts.data && pageNo){
			if(pageNo.val()){
				this.opts.data  = $.merge(this.opts.data, pageNo.serializeArray());
			}
		}
	}

	RumTree.prototype.ajaxBaseonTree = function (isAdd){
		var setting = this.setting;
		var self  	= this;
		var $this 	= this.$el ;
		var opts  	= this.opts;
		$.ajax({
			url		:opts.url,
			type	:"post",
			dataType:"text",
			data	:opts.data,
			success :function(data, textStatus, jqXHR){
				var dataJson;
				try{
					dataJson = JSON.parse(data);
					data = eval(dataJson.list);
				}catch(e){
					//alert(e.message);
					data = [];
				}
				if(isAdd){
					self._addNodes(data);
				}else{
					self._initTree(data);

				}
				if(opts.baseonMoreCallBack){
					opts.baseonMoreCallBack.call(this, dataJson.isHas, isAdd);
				}

				if(opts.onMouseoverCallBack){
					var nodes=self.ztree.getNodes();
					var $treeNode=$this.find(">li");
					$treeNode.each(function(index, element) {
						var $this=$(this);
						var $div=$('<div class="arrow_left_hijack"></div>');
						$div.click(function(){
							opts.onMouseoverCallBack.call(self,nodes[index]);
						});
						$this.mouseenter(function(){
							var p=$(this).position();
							//var w=$(this).width();
							var pw=$(this).parent().parent().width();
							var w=$(this).parent().width();
							if(w = pw){
								$div.css({left:(w+p.left-30)+"px",top:p.top+"px"});
							}else{
								$div.css({left:(w+p.left-15)+"px",top:p.top+"px"});
							}
							$div.show();
						});
						$this.mouseleave(function(){
							$div.hide();
						});
						$this.append($div);
					});
				}
				if(opts.callback){
					opts.callback.call(this,this);
				}
			},
			error:function (XMLHttpRequest, textStatus, errorThrown){
				//alert(1);
			},
			complete:function(){
				if(self.opts.isSelected){
					var nodes = self.ztree.getNodes();
					for(var i=0;i<nodes.length;i++){
						if(nodes[i].id == opts.selectNode){
							var treeNode = self.ztree.getNodeByTId(nodes[i].tId);
							self._selectNode(treeNode);
							break;
						}
					}
				}
			}
		});
	}

	RumTree.prototype._ajaxInitTree = function (){
		var setting = this.setting;
		var self  	= this;
		var $this 	= this.$el ;
		var opts  	= this.opts;
        var current = $(".cur").attr("id");
		$.ajax({
			url		:opts.url,
			type	:"post",
			dataType:"text",
			data	:opts.data,
			success :function(data, textStatus, jqXHR){
				try{
					data = eval(data);
				}catch(e){
					//alert(e.message);
					data = [];
				}
				self._initTree(data);
//                if(current){
//                    $("#" + current).addClass("cur");
//                    $("#" + current).find(".arrows:first").show();
//                    $(".selectedNode").removeClass("selectedNode")
//                    $("#" + current+"_a").addClass("selectedNode").addClass("curSelectedNode");
//                    $("#"+current).trigger("click");
//                }
//				 if(opts.selectNode){
//				 	self.select(opts.selectNode);
//				 }
                if(opts.onMouseoverCallBack){
					var nodes=self.ztree.getNodes();
					var $treeNode=$this.find(">li");				
					$treeNode.each(function(index, element) {
                        var $this=$(this);
						var $div=$('<div class="arrow_left_hijack"></div>');
						$div.click(function(){
						   opts.onMouseoverCallBack.call(self,nodes[index]);	
						});
						$this.mouseenter(function(){
							var p=$(this).position();
							//var w=$(this).width();
							var pw=$(this).parent().parent().width();
							var w=$(this).parent().width();
							if(w = pw){
								$div.css({left:(w+p.left-30)+"px",top:p.top+"px"});
							}else{
								$div.css({left:(w+p.left-15)+"px",top:p.top+"px"});
							}
						    $div.show();
						});
						$this.mouseleave(function(){
						    $div.hide();
						});
						$this.append($div);
                    });
				}
				if(opts.callback){
					opts.callback.call(this,this);
				}
			},
			error:function (XMLHttpRequest, textStatus, errorThrown){
				//alert(1);
			},
			complete:function(){
				if(self.opts.isSelected){
					var nodes = self.ztree.getNodes();
					for(var i=0;i<nodes.length;i++){
						if(nodes[i].id == opts.selectNode){
							var treeNode = self.ztree.getNodeByTId(nodes[i].tId);
							self._selectNode(treeNode);
							break;
						}
					}
				}
			}
		});
	}

	RumTree.prototype._init = function (r){
			this.initOpts();
			this.initParams(r);
			this.initSetting();
			if(this.opts.url && this.opts.isPaging){
				this.ajaxBaseonTree(false);
			}else if(this.opts.url){
				this._ajaxInitTree();
			}else{
				//
			}
	}
	RumTree.prototype.init = function (){
			this._init(false);
	}

	RumTree.prototype.reInit = function (){
			this._init(true);
	}
	RumTree.prototype.resetSelect = function (isSelected){
			this.opts.isSelected = isSelected;
			var $cur = this.$el.find(".cur");
				if($cur.size()==0){
					return;
				}
				$cur.removeClass("cur");
				$cur.find(".selectedNode").removeClass("selectedNode");
				//$cur.find(".icon.on").removeClass("on");
				$cur.find(".arrows").hide();
	}

	RumTree.prototype._selectNode = function(node){
		if(this.opts.collapseParent && node.isParent){
			var ztree = this.$el.data("ztree");
			ztree.expandNode(node,null,null,null,true);
		}else{
			var $this = this.$el;
			if(node.level>=0){
				$this.find(".cur").removeClass("cur");

				var rootNode = getRootNode(node);
				$("#" + rootNode.tId ,$this).addClass("cur");


				$(".arrows",$this).hide();
				$("#" + node.tId,$this).find(".arrows:first").show();
				//$this.find(".icon").removeClass("on");
			}
			$(".selectedNode",$this).removeClass("selectedNode");
			$("#" + node.tId+"_a",$this).addClass("selectedNode");
		}
	}

	RumTree.prototype.select = function(key,value){

			var treeNode = this.ztree.getNodesByParam(key,value,null);
			if(treeNode&&treeNode.length>0){
			   treeNode = treeNode[0];
			   openAllParentNode(treeNode,this.ztree);
			   this.resetSelect();

			   this._selectNode(treeNode);
			   return true;
			}
			return false;
	}
	RumTree.prototype.selectByObject = function(param,doClick){
			if(!param||typeof param !="object"){
			   return;
			}
			var filter = function(node){
			    for(var p in param){
					if(!node.hasOwnProperty(p)||node[p]!=param[p]){
						return false;
					}
				}
				return true;
			}

			var treeNode = this.ztree.getNodesByFilter(filter,true,null);

			if(treeNode){

				  openAllParentNode(treeNode,this.ztree);

			   this.resetSelect();
			   this._selectNode(treeNode);
			   return true;
			}
			
			if(doClick){
				this._opts.onClick.call(this.$el,treeNode);
			}
			
			return false;
	}

	RumTree.prototype.openNode = function(key,value,toDo){
		var treeNode = this.ztree.getNodesByParam(key,value,null);
			if(treeNode&&treeNode.length>0){
			   treeNode = treeNode[0];
			   openAllParentNode(treeNode,this.ztree);
			   if(treeNode.open){
				  return;
			   }
			   //this.resetSelect();
			   var $node = $("#" + treeNode.tId,this.$el);
			   if($.isFunction(toDo)){
					$node.data("toDo",toDo);
					$node.find(".icon").trigger("click");
			   }
			}
	}
	RumTree.prototype.closeNode = function(pa,toDo,flag){
		var filter = function(node){
		    for(var p in pa){
				if(!node.hasOwnProperty(p)||node[p]!=pa[p]){
					return false;
				}
			}
			return true;
		}
		var treeNode = this.ztree.getNodesByFilter(filter,true,null);
		if(treeNode){
			if(treeNode.getParentNode()){
				closeParentNode(treeNode,this.ztree);
				var $cur = this.$el.find(".cur");
				if($cur.size()==0){
					return;
				}
				$cur.find(".arrows").hide();
			}else{
				this.resetSelect();
			}
			if(!treeNode.getParentNode()){
				toDo();
			}
		}
	}
	RumTree.prototype.findNodeByPa = function(pa){
		var filter = function(node){
		    for(var p in pa){
				if(!node.hasOwnProperty(p)||node[p]!=pa[p]){
					return false;
				}
			}
			return true;
		}
		var treeNode = this.ztree.getNodesByFilter(filter,true,null);
		return treeNode;
	}
	RumTree.prototype.openNodeByObject = function(param,toDo){
			if(!param||typeof param !="object"){
			   return;
			}
			var filter = function(node){
			    for(var p in param){
					if(!node.hasOwnProperty(p)||node[p]!=param[p]){
						return false;
					}
				}
				return true;
			}

			var treeNode = this.ztree.getNodesByFilter(filter,true,null);

			if(treeNode){
			  openAllParentNode(treeNode,this.ztree);
			   if(treeNode.open){
				  return;
			   }

			   var $node = $("#" + treeNode.tId,this.$el);
			   if($.isFunction(toDo)){
					$node.data("toDo",toDo);
					$node.find(".icon").trigger("click");
			   }
			}
	}

	var setting = {
			view: {
				showLine: 	    false,
				showIcon: 	    true,
				selectedMulti:  false,
				dblClickExpand: false
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				//beforeClick:   this.beforeClick,
				//onClick: 	   this.onClick
				onNodeCreated: zTreeOnNodeCreated
			}
	};

	function zTreeOnNodeCreated(event, treeId, treeNode) {

		var title=treeNode.name;
		if(title!=treeNode.alias){
			title=treeNode.name+"\n"+treeNode.alias;
		}
		$("#"+treeNode.tId+"_a").attr("title",title);
	}


	function beforeClick(treeId, node,$this) {
			return true;
	}
	function nodeOnClick(e, treeId, node,$this,opts,self) {
		var self = self;
		if(!$this){
		   $this = $(document);
		}
		var ztree = $this.data("ztree");
		var $target = $(e.target);
		//if(node.isParent&&$target.hasClass("icon")){
		if($target.hasClass("icon")){

			ztree.expandNode(node,null,null,null,true);

			// if(node.open){
					// $("#" + node.tId,$this).find(".icon:first").addClass("on");
				// }else{
					// $("#" + node.tId,$this).find(".icon:first").removeClass("on");
			// }
			e.preventDefault();
			e.stopPropagation();
		}else{
			self._selectNode(node);
			if(opts.onClick){
				opts.onClick.call($this,node);
			}
		}



	}

	function getRootNode(node){
		var parent = node.getParentNode();
		if(parent==null){
			return node;
		}else{
			return getRootNode(parent);
		}
	}
	function openAllParentNode(node,tree){
		var parent = node.getParentNode();
		if(parent==null){
			return ;
		}else{
			if(!parent.open){
				tree.expandNode(parent,true, true, true,true);
			}
			openAllParentNode(parent,tree);
		}
	}
	function closeParentNode(node,tree){
		var parent = node.getParentNode();
		if(parent==null){
			return ;
		}else{
			if(parent.open){
				tree.expandNode(parent,false, true, true,true);
			}
		}
	}

	function treeAddDiyDom(treeId,treeNode,$this,opts){

			 var $a	    = $("#" + treeNode.tId + "_a",$this);
			 var $span 	= $("#"+ treeNode.tId + "_span",$this);
				 $span.hide();
			 var unit		= treeNode.unit||"";
			 var value		= treeNode.value||"";
             var formatValue= treeNode.formatValue||"";
			 var name		= treeNode.name||"";
			 var uriId		= treeNode.uriId||"";
			 var hostId		= treeNode.hostId||"";
			 var actionId		= treeNode.actionId||"";
			 /*
			 var max 		= 28 - treeNode.level * 4 ;
			 if(max+(value+"").length>32-treeNode.level * 4){
				 max = max - (value+"").length;
			 }
			 if(name.length>max){
				name = name.substring(0,max)+"...";
			 }
			 */
			 var max		= 16 - treeNode.level * 2 - stringByteLength(value+""+unit);
				 //name		= compressString(name,max);


			 var percent	= value/$this.data("standard")*100;
			 if(isNaN(percent)|| percent<0 ){
				percent=0;
			 }
			 if(percent>100){
				percent=100;
			 }
			 var vu = "";
             if(!isNaN(formatValue) && formatValue.length > 0){
                 vu = formatValue;
                 if(unit.length>0){
                     vu +=''+unit+''
                 }

             } else if($.isNumeric(value)){
				vu = value;
				if(unit.length>0){
					vu +=''+unit+''
				}
			 }
/**
			 //alert(percent);
			 var $content = $('<div class="box"><p class="ground" style="width:'+percent+'%" ></p> <div class="value" >'+vu+'</div> <div style="position:absolute;height:100%">		<span class="icon" ></span><span class="text" style="height:100%;overflow:hidden;white-space:nowrap">'+name+'</span>   </div>       </div> <div class="arrows" ></div> ');
				 if(!opts.showArrows){
					$content.find(".icon").hide();
				 }
				 $a.append($content);
				 $a.find(".arrows").hide();

				 var boxWidth 	= width- treeNode.level*15-2-8;
				 $a.find(".box").width(boxWidth);

				 if(!$a.is(":visible")){
					$a.parents("ul:first").show();
				 }
				 var valueWidth	= $content.find(".value:first").width();

                if(opts.asyncEnable){
				   if(opts.maxLevel>0){
					  if(treeNode.level>=opts.maxLevel){
						$a.find(".icon").hide();
						treeNode.isParent=false;
					  }else{
						treeNode.isParent=true;
						treeNode.zAsync = false;
					  }
				   }else{
						if(treeNode.isParent){
							treeNode.zAsync = true;
						}else{
							treeNode.isParent=true;
							treeNode.zAsync = false;
						}
				   }
				 }else{
					if(!treeNode.isParent){
						$a.find(".icon").hide();
					}
				 }


				 var  textWidth   = boxWidth-valueWidth-12-10-6;
				 var  iconWidth  = 0;
				 var $icon = $a.find(".icon:first");
					 if($icon.is(":visible")){
						textWidth  = textWidth-14;
						iconWidth = 14
					 }
				 var $text = $content.find(".text:first");
				 var scrollWidth = $text.width();
					 $text.css({width:textWidth,"float":"left"});
**/
             if(opts.asyncEnable){
    			   if(opts.maxLevel>0&&treeNode.level>=opts.maxLevel){
    				 treeNode.isParent=false;
    			   }else{
    				 treeNode.isParent=true;
    			   }
    			 }
               var editHtml ="";
               var editInputHtml="";
               if(opts.enableEdit && !treeNode.isParent){
            	   editHtml =  '<div class="iconEdit" ><div>重命名<em></em></div></div>';
            	   if(actionId>0){
	              	 editInputHtml = '<span name="editSpan" class="treeEdit" style="display:none;height:100%;overflow:hidden;white-space:nowrap"><input class="iconEditTxt" type="text" actionId="'+actionId+'" name="newNodeName" value="'+name+'"   /></span>'
            	   }
//            	   if(uriId>0){
//            		   editInputHtml = '<span name="editSpan" class="treeEdit" style="display:none;height:100%;overflow:hidden;white-space:nowrap"><input type="text" hostId="'+hostId+'" uriId="'+uriId+'" name="newNodeName" value="'+name+'" onclick="stopBubble()" onblur="changeNodeName(this)" /></span>'
//            	   }
               }
  			 var $content = $('<div class="box">'+editHtml+' <p class="ground" style="width:'+percent+'%" ></p><div class="value" >'+vu+'</div> <div style="position:absolute;height:100%">		<span class="icon" ></span><span class="text" style="height:100%;overflow:hidden;white-space:nowrap">'+name+'</span> '+editInputHtml+'  </div>       </div> <div class="arrows" ></div> ');
  			 if(!opts.showArrows){
  				$content.find(".icon").hide();
  			 }
  			 $a.append($content);
		     $a.find(".iconEdit").on("click",function(){
				 nodeEdit(this);
				 return false;
			 });
			 $a.find(".iconEditTxt").on("blur",function(){
				 changeActionNodeName(this);
			 });
			 /*$a.find(".iconEditTxt").on("click",function(){
				 stopBubble();
			 });*/
  			 $a.find(".arrows").hide();
  			 $a.find(".box").bind("mouseover",function(){
  				 $(this).find(".iconEdit").show(0);
  			 });
  			 $a.find(".box").bind("mouseout",function(){
  				 $(this).find(".iconEdit").hide(0);
  			 });
  			 var boxWidth 	= width- treeNode.level*15-2-8;
  			 $a.find(".box").width(boxWidth);

  			 if(!$a.is(":visible")){
  				$a.parents("ul:first").show();
  			 }
  			 var valueWidth	= $content.find(".value:first").width();

              if(opts.asyncEnable){
  			   if(opts.maxLevel>0){
  				  if(treeNode.level>=opts.maxLevel){
  					$a.find(".icon").hide();
  					treeNode.isParent=false;
  				  }else{
  					treeNode.isParent=true;
  					treeNode.zAsync = false;
  				  }
  			   }else{
  					if(treeNode.isParent){
  						treeNode.zAsync = true;
  					}else{
  						treeNode.isParent=true;
  						treeNode.zAsync = false;
  					}
  			   }
  			 }else{
  				if(!treeNode.isParent){
  					$a.find(".icon").hide();
  				}
  			 }


  			 var  textWidth   = boxWidth-valueWidth-12-10-6;
  			 var  iconWidth  = 0;
  			 var $icon = $a.find(".icon:first");
  				 if($icon.is(":visible")){
  					textWidth  = textWidth-14;
  					iconWidth = 14
  				 }
  			 var $text = $content.find(".text:first");
  			 var scrollWidth = $text.width();
  				 $text.css({width:textWidth,"float":"left"});


				 //alert(scrollWidth);
				 //alert(1);
				 if(scrollWidth  + valueWidth +6 + 8 > boxWidth-iconWidth ){
					 $text.css({"width":textWidth/2});
						var $dd	=$('<span style="display:block;float:left">...</span>');	
							$text.after($dd);	
						var $text2 = $text.clone();
							$dd.after($text2);
							$text2.css({"margin-left":0});
							$text2.scrollLeft(scrollWidth-textWidth/2);
							//$text2.scrollLeft(20);
							//alert(scrollWidth-textWidth/2);
				 }else{
					$text.css({"width":"auto","overflow":"visible"})
				 }


				 if(treeNode.open){
						$a.find(".icon").addClass("on");
				 }


	}


	function asyncSuccess(event, treeId, treeNode, msg,$this,opts){
		//如果下一页数据为空，则所有数据都丢失，屏蔽此段代码
		/*if(!msg||msg.length<=0){
			treeNode.isParent = false;
			$("#" + treeNode.tId,$this).find(".icon").hide();
			$("#" + treeNode.tId,$this).find("ul").remove();
		 }*/
		 if(opts.enablePage&&!treeNode._noMore){
			var $more = $('<li sytle="cursor:pointer">'+message_source_i18n.more+'...</li>');
			$("#" + treeNode.tId+"_ul",$this).append($more);
				$more.click(function(){
					if(!treeNode._pageNo){
						treeNode._pageNo = 1;
					}
					treeNode._pageNo++
					$this.data("ztree").reAsyncChildNodes(treeNode);
					$more.remove();
				});
		 }

	}
	function asyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown,$this,opts){
		if(treeNode){
			$("#" + treeNode.tId,$this).find(".icon").hide();
			$("#" + treeNode.tId,$this).find("ul").remove();
		}
	}
	function asyncDataFilter(treeId, parentNode, responseData,$this,opts){
		var data = null;
		if($.isArray(responseData)){
			data = responseData;
		}else{
			data = responseData.data;
		}
		if(data.length == 0 || data.length <= opts.pageSize){ // 此处如果data.length > opts.pageSize，需要分页
			parentNode._noMore = true;
		}
		if(data.length > opts.pageSize){
			data.splice(opts.pageSize);
		}
		return data;
	}

	function asyncGetAsyncUrl(treeId, treeNode,$this,opts){
			if(!treeNode){
				return ;
			}
			var url = opts.asyncUrl;
			if(url.indexOf("?")==-1){
				url +="?";
			}
			if(opts.data){
				$.each(opts.data,function(index,value){
					url += "&"+value.name+"="+encodeURIComponent(value.value);
				});
			}
			if(treeNode&&!treeNode._pageNo){
				treeNode._pageNo = 1;
			}
			if(opts.enablePage){
				url +="&pageNo="+treeNode._pageNo;
				url +="&pageSize="+opts.pageSize;
			}
			return url;
	}


	function treeOnCollapse(event, treeId, treeNode,$this,opts){
			$("#" + treeNode.tId,$this).find(".icon:first").removeClass("on");
	}
	function treeOnExpand(event, treeId, treeNode,$this,opts){
			$("#" + treeNode.tId,$this).find(".icon:first").addClass("on");
			var toDo = $("#" + treeNode.tId,$this).data("toDo");
			if(toDo){
				toDo.call($this.data("tree"),$this.data("tree"));
				$("#" + treeNode.tId,$this).removeData("toDo")
			}

	}
	$.fn.rumTree = function () {
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
			$.error('Method ' + method + ' does not exist on jQuery.runTree');
		}
	};


	//中间截取字符串

	function  compressString(str,max){
		var blength = stringByteLength(str);
		if(blength<=max){
			return str;
		}else{
			var mid		= blength/2;
			var index1 = mid -(blength-max)/2;
			var index2 = mid +(blength-max)/2;
			var byteIndex1 = stringByteIndexOf(str,index1);
			var byteIndex2 = stringByteIndexOf(str,index2);
			return str.substring(0,byteIndex1)+"..."+str.substring(byteIndex2,str.length);
		}


	}

	function stringByteLength(str){
		if(!str){
			return 0;
		}
		var len = str.length;
		var reLen = 0;
		for (var i = 0; i < len; i++) {
			reLen += charByteLength(str.charCodeAt(i));
		}
		return reLen;
	}

	function stringByteIndexOf(str,index){
		if(!str){
			return -1;
		}
		var len = str.length;
		var reLen = 0;
		for (var i = 0; i < len; i++) {
			reLen += charByteLength(str.charCodeAt(i));
			if(reLen>=index){
				return i;
			}
		}

		return len;
	}

	function charByteLength(code){

		if(code==".".charCodeAt(0)){
			return 0.1;
		}else if(code=="/".charCodeAt(0)){
			return 0.2;
		}else if(code=="I".charCodeAt(0)){
			return 0.2;
		}else if(code=="W".charCodeAt(0)||code=="M".charCodeAt(0)){
			return 1;
		}else if( (code >="a".charCodeAt(0)&&code <="z".charCodeAt(0)) || (code >="0".charCodeAt(0)&&code <="z".charCodeAt(0))   ){
			return 0.6;
		}else if(code >="A".charCodeAt(0)&&code <="Z".charCodeAt(0)){
			return 0.8;
		}else{
			return 1;
		}
	}

	function stopBubble(e) {
		if (e && e.stopPropagation){
			e.stopPropagation();
		}
	}
	function nodeEdit(dom,e) {
		stopBubble(e);
		var $editSpan = $(dom).parent().find('span[name="editSpan"]');
		var $nodeSpan = $(".text",$editSpan.parent());
		$nodeSpan.hide();
		$editSpan.show();
		var oldName = $editSpan.find("input").val();
		$editSpan.find("input").focus().val(oldName);
	}
	function changeActionNodeName(dom, e) {
		stopBubble(e);
		var $editSpan = $(dom).parent();
		var $nodeSpan = $(".text",$editSpan.parent());
		var newName = $(dom).val();
		var oldName =  $nodeSpan[0].innerText;
		if(oldName==newName){
			$nodeSpan.show();
			$editSpan.hide();
			return
		}
		if(newName == ''){
			alert("名称为空时，恢复WebAction名称。");
		}
		if(newName.length > 32){
			alert("别名长度不能超过32位，请重新输入");
			$(dom).focus();
			return
		}
		if($nodeSpan.size()==2){
			$($nodeSpan[1]).prev().remove();
			$($nodeSpan[1]).remove();
		}
		$nodeSpan.width('auto');
		var actionId = $(dom).attr("actionId");
		updateActionUrlAlias(actionId, newName);
		$nodeSpan.text(newName).css({ "max-width": "155px","text-overflow":"ellipsis","overflow":"hidden"});
		$nodeSpan.show();
		$editSpan.hide();
	}

	function updateActionUrlAlias(actionId,newName){
		if(actionId <= 0){
			return;
		}

		var conf = {"actionId":actionId,"newName": newName};
		$.post(_ctx_+"/application/webAction/updateName",conf,function(result){
			var status = result.status;
			if(status == '-1'){
				alert("别名长度不能超过32位，请重新输入");
				return;
			}
			$("#tree").data("tree").reInit();
		} );
	}

	function changeNodeName(dom, e) {
		stopBubble(e);
		var newName = $(dom).val();
		if(newName == ''){
			alert("名称不能为空，请重新输入");
			$(dom).focus();
			return;
		}
		if(newName.length > 32){
			alert("别名长度不能超过32位，请重新输入");
			$(dom).focus();
			return
		}
		var $editSpan = $(dom).parent();
		var $nodeSpan = $(".text",$editSpan.parent());
		if($nodeSpan.size()==2){
			$($nodeSpan[1]).prev().remove();
			$($nodeSpan[1]).remove();
		}
		$nodeSpan.width('auto');
		var uriId = $(dom).attr("uriId");
		var hostId = $(dom).attr("hostId");
		updateUrlAlias(hostId,uriId, newName);
		$nodeSpan.text(newName).css({ "max-width": "155px","text-overflow":"ellipsis","overflow":"hidden"});
		$nodeSpan.show();
		$editSpan.hide();
	}

	function updateUrlAlias(hostId,uriId,newName){
		if(uriId <= 0){
			return;
		}
		if(hostId == null || hostId==""){
			hostId = 0;
		}
		var conf = {"hostId":hostId,"uriId": uriId,"newName": newName};
		$.post(_ctx_+"/application/external/updateName",conf,function(result){
			var status = result.status;
			if(status == '0'){
				alert("别名不能为空!");
				return;
			}
			if(status == '-1'){
				alert("别名长度不能超过32位，请重新输入");
				return;
			}
		} );
	}

})(jQuery);
});