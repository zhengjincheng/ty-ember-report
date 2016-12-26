(function($){
	var _MID_ = 1;
	$.fn.rumselect = function(options){
		 if(arguments.length==1&&typeof arguments[0] == "object"){
			 	return this.each(function(){
					var $this = $(this);
					var opts = $.extend({},$.fn.rumselect.defaults,options);
					if(!$this.data("RumSelect")){				
						if(!opts.name){
							opts.name = $this.attr("selectName");
						}					
						if(!opts.classz){
							opts.classz = $this.attr("selectClass");
						}
						if(!opts.id){
							opts.id = $this.attr("selectId");
						}
						if(!opts.formId){
						  opts.formId		= $this.attr("formId");	
					    }
					    if(!opts.forms){
						  opts.forms = $this.attr("forms");  	
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
					    if(!opts.url){
							opts.url = $this.attr("url");
						}
						opts.autoRefresh = ("true"==$this.attr("autoRefresh"));

						//不管图表是否隐藏都重新刷新
						opts.mandatoryRefresh = ("true"==$this.attr("mandatoryRefresh"));

						$this.data("RumSelect",new RumSelect($this,opts));
					
					
					}
				});
	        }else if(typeof arguments[0] == "string"){
	            var method = arguments[0];
	            var p =  arguments[1]||{}
	            return this.each(function(){
	                var $this = $(this);
	                var rumselect =  $this.data("RumSelect");
	                if(rumselect[method]){
	                    rumselect[method].call(rumselect,arguments[1]||{});
	                }
	            });
	        }
		
		
	}
	
	$.fn.rumselect.defaults = {
		name  :null,
		classz:null,
		params:null,
		formId:null,
		autoRefresh:false,
		mandatoryRefresh:false,
		setting : {
				data	:[]
			},
		url   :null,	
		width :	 460,
		leftWidth:200,
		rightWidth:200,
		height:220,
		_leftTreeSeting:{
			view: {
				showLine: 	    false,
				showIcon: 	    false,
				selectedMulti:  false,
				dblClickExpand: false
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			check:{
				enable	:true,
				chkStyle:"checkbox" 
			},
			edit:{
				enable	:false,
				showRemoveBtn: false,
				showRenameBtn: false
			},
			callback: {
				
			}
		},
		_rightTreeSeting:{
			view: {
				showLine: 	    false,
				showIcon: 	    false,
				selectedMulti:  false,
				dblClickExpand: false
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			check:{
				enable	:true,
				chkStyle:"checkbox" 
			},
			edit:{
				enable: false,
				showRemoveBtn: false,
				showRenameBtn: false
			},
			callback: {
				
			}
		}
	}
	
	var RumSelect = function($el,opts){
		this._$el  			= $el;
		this._opts 			= opts;
		this._leftTree		= null;
		this._rightTree 	= null;
		this._initWidth();
		this._initHtml();
		this._initScroll();
		this._draw();
		this._initSearch();
		this._initButton();	
		this._uncommit      ={};
	};
	
	$.extend(RumSelect.prototype,{
		_gId:function(){
			return  "rumselect_"+(_MID_++);
		},
		_initWidth:function(){
			this._opts.leftWidth = (this._opts.width-60)/2
			this._opts.rightWidth = (this._opts.width-60)/2
		},
		_initHtml:function(){
			var html = '<div class="rumselect-box">\
					<select id="'+this._opts.id+'" name="'+this._opts.name+'" class="'+this._opts.classz+'" multiple="multiple" style="display:none" ></select>\
					<div class="rumselect-content" >\
					  <div class="rumselect-left-container">\
						<div class="rumselect-left-search-text-container" >\
							<span  class="rumselect-left-search-image"></span>\
							<input class="rumselect-left-search-text" type="text" >\
							<span  class="rumselect-left-search-close"></span>\
						</div>\
						<div class="rumselect-left-search-container" style="display:none" >\
							<ul class="rumselect-left-search" ></ul>\
						</div>\
						<div class="rumselect-left-select-container" >\
							<ul id="'+this._gId()+'_rumselect_left" class="rumselect-left-select rumselect" ></ul>\
						</div>\
					 </div>\
					 <div class="rumselect-center-container">\
							<div class="rumselect-center-button-box">\
								<div class="rumselect-to-right-button"></div>\
								<div class="rumselect-to-left-button"></div>\
							</div>\
					 </div>\
					 <div class="rumselect-right-container" >\
						<ul id="'+this._gId()+'_rumselect_right" class="rumselect-right-select rumselect" ></ul>\
					 </div>\
					</div>\
					<div class="rumselect-buttom" >\
						<span class="rumselect-buttom-left"><span class="rumselect-buttom-left-img" ></span>'+message_source_i18n.select_style+'</span>\
						<span class="rumselect-buttom-right"><span class="rumselect-buttom-right-img"></span>'+message_source_i18n.delete_all+'</span>\
					</div>\
				  </div>';
				  
			this._$el.append(html);
			$(".rumselect-box" 	  ,this._$el).width(this._opts.width).height(this._opts.height);
			$(".rumselect-content",this._$el).height($(".rumselect-box",this._$el).innerHeight()-$(".rumselect-buttom",this._$el).outerHeight());
			$(".rumselect-left-container" ,this._$el).css({"width":this._opts.leftWidth,height:"100%"});
			$(".rumselect-right-container",this._$el).css({"width":this._opts.rightWidth,height:"100%"});
			$(".rumselect-center-container",this._$el).css("height","100%");
			var $centerButtonBox  = $(".rumselect-center-button-box",this._$el);
				$centerButtonBox.css("margin-top",this._opts.height/2-26);
			this._$htmlselect			= $("select:first",this._$el);
			this._$leftSearch 			= $(".rumselect-left-search" 	  	   ,this._$el);
			this._$leftSelect 			= $(".rumselect-left-select" 	  	   ,this._$el);
			this._$leftSearchText		= $(".rumselect-left-search-text" 	   ,this._$el);
			this._$leftSearchText.css({width:this._opts.leftWidth-24-30});
			
			this._$leftSearchContainer	= $(".rumselect-left-search-container" ,this._$el);
			this._$leftSelectContainer  = $(".rumselect-left-select-container" ,this._$el);
			this._$rightSelectContainer	= $(".rumselect-right-container"	   ,this._$el);
			this._$leftSearchClose		= $(".rumselect-left-search-close"	   ,this._$el);
			this._$leftButton			= $(".rumselect-buttom-left"		   ,this._$el);
			this._$rightButton			= $(".rumselect-buttom-right"		   ,this._$el);
			this._$toRightButton		= $(".rumselect-to-right-button"	   ,this._$el);
			this._$toLeftButton			= $(".rumselect-to-left-button"	   	   ,this._$el);
			
			this._$leftSearchContainer.height($(".rumselect-content",this._$el).innerHeight()-$(".rumselect-left-search-text-container",this._$el).outerHeight()-10);
			this._$leftSelectContainer.height($(".rumselect-content",this._$el).innerHeight()-$(".rumselect-left-search-text-container",this._$el).outerHeight()-10);
			
			//alert(this._$leftSelectContainer.width()+" "+this._$leftSelectContainer.height());
		},
		//初始化url
		_initUrl:function(){
			if(!this._opts.url&&this._opts.formId){
				this._opts.url = $("#"+this._opts.formId).attr("action");
			}
		},
	
		//初始化参数
		_initParams:function(r){
			var self = this;
			this._opts.setting.data=[];

			if(this._opts.params){
				this._opts.setting.data = serializeArrayObject(this.opts.params);
			}
			if(this._opts.formId){
				var dataForm = $("#"+this.opts.formId).serializeArray();
				if(dataForm&&dataForm.length>0){
				   this._opts.setting.data  = $.merge(this._opts.setting.data,dataForm);
				}
				if(this._opts.autoRefresh&&!r){
					$("#"+this._opts.formId).find(":input").change(function(){
						//不管图标是否隐藏都刷新
						if(self._opts.mandatoryRefresh){
							self._reDraw();
						}else{
							if(self._$el.is(":visible")){
								self._reDraw();
							}
						}
					});
				}
			}
			if(this._opts.forms){
				var fs 	 =  this._opts.forms.split(/\s+/);
				var $fs	 =	$(fs.join());
				if(fs.length>0){
					this._opts.setting.data  = $.merge(this._opts.setting.data,$fs.serializeArray());
					if(this._opts.autoRefresh&&!r){
						$fs.change(function(e){
							if(self._opts.mandatoryRefresh){
								self._reDraw();
							}else{
								if(self._$el.is(":visible")){
									self._reDraw();
								}
							}
						});
					}
				}
			}
		},
		_draw:function(){
			this._initTree(false);
		},
		_reDraw:function(){
			this._initTree(true);
		},
		_initScroll:function(){
			var self = this;
			this._$leftSearchContainer.jgScrollbar({
			  wheelSpeed: 20,
			  wheelPropagation: false,
			  scrollXPanddingLeft:80,
			  dragEnable:false
			});
			this._$leftSelectContainer.jgScrollbar({
			  wheelSpeed: 20,
			  wheelPropagation: false,
			  scrollXPanddingLeft:80,
			  dragEnable:false
			});
			this._$rightSelectContainer.jgScrollbar({
			  wheelSpeed: 20,
			  wheelPropagation: false,
			  scrollXPanddingLeft:80,
			  dragEnable:false
			});
		},
		_initTree:function(r){
			this._initUrl();
			this._initParams(r);	
			var self = this;
			var leftTreeSetting = $.extend({},this._opts._leftTreeSeting,{
				callback:{
					onDblClick:function(event, treeId, treeNode){
						if(!treeNode||treeNode.isParent){
							return;
						}
						self._takeLeftNodeToRight(treeNode.tId);
					},
					beforeDrop:function(treeId, treeNodes){
						self._takeLeftSelectNodeToRight()
						return false;
					},
					beforeDrag:function(treeId, treeNodes){
						return true;
					}
				}
				
			});
			var $lelfTree = $(".rumselect-left-select",this._$el);
				$lelfTree.css("width","96%");
			var $rightTree = $(".rumselect-right-select",this._$el);
				$rightTree.css("width","96%");			
			if(this._opts.url){
					$.post(this._opts.url,this._opts.setting.data||{},function(nodeText){
						var nodes = eval("("+nodeText+")");
						self._leftTree  = $.fn.zTree.init($lelfTree, leftTreeSetting, nodes);
						self._$leftSelectContainer.jgScrollbar("update");
					},"text");
			}else{
				self._leftTree  = $.fn.zTree.init($lelfTree, leftTreeSetting);
				self._$leftSelectContainer.jgScrollbar("update");
			}
			var rightTreeSetting = $.extend({},this._opts._rightTreeSeting,{
				callback:{
					onDblClick:function(event, treeId, treeNode){
						if(!treeNode){
							return;
						}
						var oldTid = treeNode.oldtId;
						self._takeRightNodeToLeft(treeNode.tId,oldTid);
					},
					beforeDrop:function(treeId, treeNodes){
						$.each(treeNodes,function(k,v){
								self._takeLeftNodeToRight(v.tId);
						});
						return false;
					},
					beforeDrag:function(treeId, treeNodes){
						return true;
					}
				}
			});
			this._rightTree = $.fn.zTree.init($rightTree, rightTreeSetting);
		},
		_initSearch:function(){
			var self = this;
			this._$leftSearchText = $(".rumselect-left-search-text",this._$el);
			this._$leftSearchText.on("keyup",function(){
				var name = $.trim(self._$leftSearchText.val());
				if(!name||name==""){
					self._$leftSearchContainer.hide();
					self._$leftSelectContainer.show();
					self._$leftSearchClose.hide();
				}else{
					self._$leftSearchClose.show();
					var nodes = self._leftTree.getNodesByFilter(function(node){
						if(node.name&&node.name.indexOf(name)>-1&&!node.isParent){
							return true;
						}
						return false;
					},false);
					var html = "";
					$.each(nodes,function(k,v){
						html +='<li tid="'+v.tId+'" >'+v.name+'</li>'
					});
					self._$leftSearch.empty().append(html);
					self._$leftSearchContainer.show();
					self._$leftSelectContainer.hide();
					self._$leftSearchContainer.jgScrollbar("update");
				}
				return  true;
			});
			self._$leftSearch.on("dblclick","li",function(){
				var val = $(this).attr("tid");
				$(this).remove();
				self._takeLeftNodeToRight(val);
			});
			this._$leftSearchClose.on("click",function(){
				self._$leftSearchText.val("").trigger("keyup");
			});
		},
		_initButton:function(){
			var self = this;
			this._$leftButton.on("click",function(){
				var $this = $(this);
				if($this.data("ck")){
					$this.data("ck",false)
					$this.find(".rumselect-buttom-left-img").removeClass("check");
					self._leftTree.checkAllNodes(false);
				}else{
					$this.data("ck",true)
					$this.find(".rumselect-buttom-left-img").addClass("check");
					self._leftTree.checkAllNodes(true);
				}
			});
			this._$toRightButton.on("click",function(){
				self._takeLeftSelectNodeToRight();
			});
			this._$toLeftButton.on("click",function(){
				self._takeRightSelectNodeToLeft();
			});
			this._$rightButton.on("click",function(){
				self._takeAllRightNodeToLeft();
			});
		},
		_takeLeftNodeToRight:function(tid){
			var treeNode = this._leftTree.getNodeByTId(tid);
			if(!treeNode){
				return;
			}
			this._leftTree.hideNode(treeNode);
            var $option = $('<option value="'+treeNode.value+'" selected >'+treeNode.name+'</option>');
			this._$htmlselect.append($option);
            var node  = { oldtId:treeNode.tId, name:treeNode.name };
			    node   =  this._rightTree.addNodes(null,node);
            var value = tid;
            if(!this._uncommit["k"+value]){
                this._uncommit["k"+value] ={p:"right",leftTid:tid,rightTid:node[0].tId};
            }else if(this._uncommit["k"+value].p=="left"){
                delete this._uncommit["k"+value];
            }


            this._$leftSelectContainer.jgScrollbar("update");
			this._$rightSelectContainer.jgScrollbar("update");
		},
		_takeLeftSelectNodeToRight:function(){
			var self = this;
			var nodes = self._leftTree.getCheckedNodes(true);
			$.each(nodes,function(k,v){
					if(!v.isParent){
						self._takeLeftNodeToRight(v.tId);
					}
			});
			this._$leftSelectContainer.jgScrollbar("update");
			this._$rightSelectContainer.jgScrollbar("update");
		},
		_takeRightSelectNodeToLeft:function(){
			var self = this;
			var nodes = self._rightTree.getCheckedNodes(true);
			$.each(nodes,function(k,v){
					//if(!v.isParent){
						self._takeRightNodeToLeft(v.tId,v.oldtId);
					//}
			});
			this._$leftSelectContainer.jgScrollbar("update");
			this._$rightSelectContainer.jgScrollbar("update");
		},
		_takeAllRightNodeToLeft:function(){
			var self = this;
			var nodes = self._rightTree.transformToArray(self._rightTree.getNodes());
			$.each(nodes,function(k,v){
				if(v){
					self._takeRightNodeToLeft(v.tId,v.oldtId);
				}
			});
			this._$leftSelectContainer.jgScrollbar("update");
			this._$rightSelectContainer.jgScrollbar("update");
		},
		_takeRightNodeToLeft:function(tid,oldTid){
				var treeNode = this._rightTree.getNodeByTId(tid);
				if(!treeNode){
					return;
				}
				this._rightTree.removeNode(treeNode);
				var leftNode = this._leftTree.getNodeByTId(oldTid);
				if(leftNode){
					this._leftTree.showNode(leftNode);
					this._leftTree.checkNode(leftNode,false);
				}
				this._$htmlselect.find('option[value="'+leftNode.value+'"]').remove();
	
	            var value =oldTid;
	            if(!this._uncommit["k"+value]){
	                this._uncommit["k"+value] ={p:"left",rightTid:tid,leftTid:oldTid};
	            }else if(this._uncommit["k"+value].p=="right"){
	                delete this._uncommit["k"+value];
	            }
	
				this._$leftSelectContainer.jgScrollbar("update");
				this._$rightSelectContainer.jgScrollbar("update");
		},
		commit:function(){
            this._uncommit ={};
        },
        rollback:function(){ 
            var self = this;
            var name;
            for(name in this._uncommit){
                var node = this._uncommit[name];
                if(node.p=="left"){
                    this._takeLeftNodeToRight(node.leftTid);
                }else if(node.p=="right"){
                    this._takeRightNodeToLeft(node.rightTid,node.leftTid);
                }
            } 
            this._uncommit ={};
        }
		
	});

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