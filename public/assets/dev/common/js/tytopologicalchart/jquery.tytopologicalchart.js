define(function(require,exports,module){
    require("./tytopologicalchart.css");
    require("./jquery.mousewheel.js");
/*!
 * topologicalChart
 *
 * Licensed  Apache Licence 2.0
 *
 * Version : 1.0.0
 *
 * Author lwj  2015-7-30
 */
(function ($) {
    $.widget("ty.topologicalChart", {
        options: {
            data:[],
            scale:1,
            width:0,
            height:0,
            apR:34,//应用的内半径
            apoRW:5,//环的宽度
            aSignR:20,//标识圆的半径
            cR:25,//组件的半径
            arrowSize:10,//箭头的大小
            minScale:0.5,//最小缩放倍数
            maxScale:1,//最大缩放的倍数
            location:window._ctx_srp+"/common/js/tytopologicalchart/",//初始化绝对路径
            aImgs:{"php":{src:"img/php.svg"},//应用小图标
                   "java":{src:"img/java.svg"},
                   "node.js":{src:"img/Nodejs.svg"},
                   "python":{src:"img/Python.svg"},
                   "asp.net":{src:"img/net.svg"},
                   "ruby":{src:"img/Ruby.svg"}
                   },
            cImags:[{src:"img/Web.svg"},//组件图标
                    {src:"img/Other01.svg"},
                    {src:"img/memcached.svg"},
                    {src:"img/Redis.svg"},
                    {src:"img/MongoDB.svg"},
                    {name:"MySQL",src:"img/MySQL.svg"},//5
                    {name:"Oracle",src:"img/Oracle.svg"},
                    {name:"SQLServer",src:"img/MS SQL Server.svg"},
                    {name:"DB2",src:"img/DB2.svg"},
                    {name:"PostgreSQL",src:"img/ProgreSQL.svg"},
                    {name:"SQLite",src:"img/Other02.svg"},
                    {name:"Sybase",src:"img/Sybase.svg"},
                    {name:"Derby",src:"img/Other02.svg"}],
            statColor:[{color1:"#00a0e8",color2:"#1f84c7"},//圆环的主颜色color1代表浅色,color2代表深色
                       {color1:"#fbc737",color2:"#f39700"},
                       {color1:"#ec6a37",color2:"#db5228"},
                       {color1:"#bababa",color2:"#999999"}],
            statXXX:[{src:"img/Del_Blue.svg"},//叉号对应的图标
                     {src:"img/Del_yellow.svg"},
                     {src:"img/Del_Orange.svg"},
                     {src:"img/Del_Gray.svg"}],
            delCallback:null,//删除回调函数
            saveCallback:null,//保存回调函数当坐标改变保存当前节点
            clickCallback:null,//单击回调函数
            scaleCallback:null,//缩放回调函数
            viewBoxX:0,//初始化viewBox x,y
            viewBoxY:0,
            viewBoxCallback:null,//viewBox改变位置的回调函数
            showViewButton:true,//是否显示查看按钮
            ViewButtonCallBack:null,//查看按钮回调函数
            mouseWheel:true,//是否支持鼠标滑轮
            paperDarg:true,//是否支持画布拖拽
            elementDrag:true,//是否支持元素拖拽
            saveAutoLayoutPosition:null,//自动布局回调函数
            automaticDiscoveryCallBack:null,//自动发现回调函数
            enableDelete:true,//是否支持删除功能
            alarmStateLegend:true,//是否拥有警报状态图例
            lineWidth:1,
            legend:"server_chart_img1012.png"
        },
        _create:function(){
          var self=this;
            self._initOptions();
            if(!self.options.data.data[0].position){
                self.options.data.data[0].position={x:200,y:200};
            }
            var d=self.options.data.data;
            for(var i=0;i< d.length;i++){
                if(d[i].application){
                    self._setLastNodeAId(d[i].nodeId);
                }
            }
            self._setData(self.options.data);
			self.options.width=$(self.element).width();
			self.options.height=$(self.element).height();
			self.options.initWidth=$(self.element).width();
            self._setCenterPosition(self.options.viewBoxX+self.options.width/2,self.options.viewBoxY+self.options.height/2);
            var $el=$(self.element);
            $el.html("");
			var html='<div class="bar">'
                    +'<div class="plus"><span class="active"></span></div>'
                    +'<div class="box">'
                    +'<div class="drag"></div>'
                    +'<div class="back"></div>'
                    +'</div>'
                    +'<div class="minus"><span></span></div>'
                    +'</div>';

            $el.append(html);
            if(self.options.alarmStateLegend){
                 html='<div class="iconDiv1015">'
                     +'<span><em class="iconBlue"></em>'+message_source_i18n.topologyTipsNormal+'</span>'
                     +'<span><em class="iconYellow"></em>'+message_source_i18n.topologyTipsWarning+'</span>'
                     +'<span><em class="iconOrange"></em>'+message_source_i18n.topologyTipsBadWarn+'</span>'
                     +'<span><em class="iconGray"></em>'+message_source_i18n.topologyTipsNoData+'</span>'
                     +'<span><em class="iconKey"></em>'+message_source_i18n.topologyTipsEG+'</span>'
                     +'<span class="tuopu_layout_icon" style="cursor:pointer;"><em class="iconLayout"></em>'+message_source_i18n.topologyLayoutAuto+'</span>'
                     +'<span class="automaticDiscoveryCallBack" style="cursor:pointer;"><em class="iconFound"></em>'+message_source_i18n.topologyDiscover+'</span>'
                     +'</div>';
                     //自动布局message_source_i18n.topologyLayoutAuto
                     //图例弹出的图片self.options.location+message_source_i18n.topopogyLegend
            }else{
                html='<div class="iconDiv1015">'
                +'<span><em class="iconKey"></em>'+message_source_i18n.topologyTipsEG+'</span>'
                +'</div>';
            }

            $el.append(html);
            $el.find(".automaticDiscoveryCallBack").click(function(){
            	self.options.automaticDiscoveryCallBack&&self.options.automaticDiscoveryCallBack.call(self);
            });

            $el.find(".tuopu_layout_icon").click(function(){
               var sc= self._orderByCircle3();
                var minScale=self.options.minScale;
                var maxScale=self.options.maxScale;
                var disScale=maxScale-minScale;
                var s=sc-minScale;
                var top=(disScale-s)*(boxHeight-dragHeight)/disScale;
                self.changeScale(top,true);
                self.options.saveAutoLayoutPosition&&self.options.saveAutoLayoutPosition.call(self);
            });
            var html='<div class="sChartDiv02">'
                    +'<div class="sCloseButt">×</div>'
                    +'<div class="sChartDivCon">'
                    +'<img src="'+self.options.location+'img/'+self.options.legend+'" width="370" />'
                    +'</div>'
                    +'</div>';
            $el.append(html);
            var $iconKey=$el.find(".iconKey").parent().css({cursor:"pointer"});
            var $sCloseButt=$el.find(".sCloseButt");
            var $sChartDiv=$el.find(".sChartDiv02");
            $iconKey.click(function(){
                $sChartDiv.toggle();
            });
            $sCloseButt.click(function(){
                $sChartDiv.hide();
            });
            var $drag=$el.find(".drag");
            var dragHeight=$drag.height();
            var $box=$el.find(".box");
            var boxHeight=$box.height();
            var $back=$el.find(".back");
            var timer;
            var flag=true;
            //初始化默认缩放比例
            self._setScale(self.options.scale);
            $drag.mousedown(function(e){
                self.dragging = true;
                var oY=parseFloat($(this).css("top"));
                var iY= e.clientY;
                var me=this;
                var y=oY;
                $(document).bind({"mousemove":function(e){
                    if (self.dragging) {
                        y=oY+ e.clientY-iY;
                        self.changeScale(y);
                        return false;
                    }
                },"mouseup":function(){
                    self.dragging = false;
                    $(document).unbind("mousemove mouseup");

                    e.cancelBubble = true;
                }});
                return false;
            });

            //拖动滚动条改变缩放比例,top为滚动条的值
            self.changeScale=function(top,init){
                clearTimeout(timer);
                $drag=$el.find(".drag");
                if(top<0){
                    top=0;
                }
                if(top>(boxHeight-dragHeight)){
                    top=boxHeight-dragHeight;
                }
                if(top<0){
                    top=0;
                }
                if(top>(boxHeight-dragHeight)){
                    top=boxHeight-dragHeight;
                }
                $drag.css("top",top+"px");
                $back.css({height:boxHeight-top-10+"px"});
                if(top<=0){
                    $el.find(".plus span").removeClass("active");
                    $el.find(".minus span").addClass("active");
                }else if(top>=boxHeight-dragHeight){
                    $el.find(".minus span").removeClass("active");
                    $el.find(".plus span").addClass("active");
                }else{
                    $el.find(".plus span").addClass("active");
                    $el.find(".minus span").addClass("active");
                }
                var minScale=self.options.minScale;
                var maxScale=self.options.maxScale;
                var disScale=maxScale-minScale;
                var scale=minScale+((boxHeight-dragHeight-top)*disScale/(boxHeight-dragHeight));
                self._setScale(scale);
                if(!init) {
                    timer = setTimeout(function () {
                        self.options.scaleCallback && self.options.scaleCallback.call(self, scale);
                    }, 500);
                }
                 self._render();
            }
            $el.find(".plus").click(function(){
                self.changeScale(parseFloat($drag.css("top"))-15);
            });
            $el.find(".minus").click(function(){
                self.changeScale(parseFloat($drag.css("top"))+15);
            });
            $el.find(".box").click(function(e){
                var top=e.clientY+$(window).scrollTop()-$(this).offset().top;
                self.changeScale(top);

            });
            if(self.options.mouseWheel){
                $el.mousewheel(function(event, delta, deltaX, deltaY) {
                    self.changeScale(parseFloat($drag.css("top"))-15*deltaY);
                    event.preventDefault();
                });
            }

            $el.find("svg").remove();
            self.paper= Raphael($el[0],self.options.width,self.options.height);
            self.paper.setViewBox(-self.options.viewBoxX,-self.options.viewBoxY,self.options.width,self.options.height);
            if(self.options.scale===0){
                self.changeScale(100,true);
            }else{
                var minScale=self.options.minScale;
                var maxScale=self.options.maxScale;
                var disScale=maxScale-minScale;
                var s=self.options.scale-minScale;
                var top=(disScale-s)*(boxHeight-dragHeight)/disScale;
                self.changeScale(top,true);
            }

            var scale=self._getScale();
            if(self.options.paperDarg){
                $el.mousedown(function(e){
                    self.clientX=e.clientX;
                    self.dragging = true;
                    var me=this;
                    var oTarget= e.srcElement|| e.target;
                    if(oTarget.tagName.toLocaleLowerCase()!=="svg"){
                        return;
                    }
                    var ox= e.clientX;
                    var oy=e.clientY;
                    var x=self.options.viewBoxX;
                    var y=self.options.viewBoxY;
                    $(document).bind({"mousemove":function(e){
                        if (self.dragging) {
                            x=self.options.viewBoxX+e.clientX-ox;
                            y=self.options.viewBoxY+e.clientY-oy;
                            self.paper.setViewBox(-x,-y,self.options.width,self.options.height);
                        }

                    },"mouseup":function(){
                        self.options.viewBoxX=x;
                        self.options.viewBoxY=y;
                        self.options.viewBoxCallback&&self.options.viewBoxCallback.call(self,x,y);
                        self.dragging = false;
                        $(document).unbind("mousemove mouseup");
                        e.cancelBubble = true;
                    }});
                    return false;

                });
            }

            $(window).resize(function(){
                self.options.width=$(self.element).width();
                self.options.height=$(self.element).height();
                self._setCenterPosition(self.options.width/2,self.options.height/2);
                self.paper.setSize(self.options.width,self.options.height);
                self.paper.setViewBox(-self.options.viewBoxX,-self.options.viewBoxY,self.options.width,self.options.height);
                self._render();
            });
        },
        _initOptions:function(){
            this.options.data =	getValue(this.element,"data",this.options.data,"object");
            this.options.scale =getValue(this.element,"scale",this.options.scale,"number");
            this.options.delCallback=getValue(this.element,"delCallback",this.options.delCallback,"function");
            this.options.saveCallback=getValue(this.element,"saveCallback",this.options.saveCallback,"function");
            this.options.clickCallback=getValue(this.element,"clickCallback",this.options.clickCallback,"function");
            this.options.viewBoxCallback=getValue(this.element,"viewBoxCallback",this.options.viewBoxCallback,"function");
            this.options.scaleCallback=getValue(this.element,"scaleCallback",this.options.scaleCallback,"function");
            this.options.viewBoxX =getValue(this.element,"viewBoxX",this.options.viewBoxX,"number");
            this.options.viewBoxY =getValue(this.element,"viewBoxY",this.options.viewBoxY,"number");
            this.options.showViewButton =getValue(this.element,"showViewButton",this.options.showViewButton,"boolean");
            this.options.mouseWheel =getValue(this.element,"mouseWheel",this.options.mouseWheel,"boolean");
            this.options.paperDarg =getValue(this.element,"paperDarg",this.options.paperDarg,"boolean");
            this.options.elementDrag =getValue(this.element,"elementDrag",this.options.elementDrag,"boolean");
            this.options.mouseWheel =getValue(this.element,"mouseWheel",this.options.mouseWheel,"boolean");
            this.options.ViewButtonCallBack =getValue(this.element,"ViewButtonCallBack",this.options.ViewButtonCallBack,"function");
            this.options.saveAutoLayoutPosition =getValue(this.element,"saveAutoLayoutPosition",this.options.saveAutoLayoutPosition,"function");
            this.options.automaticDiscoveryCallBack =getValue(this.element,"automaticDiscoveryCallBack",this.options.automaticDiscoveryCallBack,"function");
            this.options.enableDelete =getValue(this.element,"enableDelete",this.options.enableDelete,"boolean");
            this.options.alarmStateLegend =getValue(this.element,"alarmStateLegend",this.options.alarmStateLegend,"boolean");
            this.options.lineWidth =getValue(this.element,"lineWidth",this.options.lineWidth,"number");
            this.options.legend = getValue(this.element,"legend",this.options.legend,"string");

        },
        /**
         * 自动发现
         * @param d 所有节点数据信息
         * @private
         */
        _AutomaticDiscovery:function(d){
            var self=this;
            self._setData(d);
            var sc= self._orderByCircle3();
            var minScale=self.options.minScale;
            var maxScale=self.options.maxScale;
            var disScale=maxScale-minScale;
            var s=sc-minScale;
            var $el=$(self.element);
            var boxHeight=$el.find(".box").height();
            var dragHeight=$el.find(".drag").height();
            var top=(disScale-s)*(boxHeight-dragHeight)/disScale;
            self.changeScale(top,true);
            self.options.saveAutoLayoutPosition&&self.options.saveAutoLayoutPosition.call(self);

        },
        _getViewBoxXY:function(){
            var self=this;
            return {x:self.options.viewBoxX,y:self.options.viewBoxY};
        },
        _orderByCircle3:function(){
            var self=this;
            var scale=self._getScale();
            var data=self._getData();
            var winW=self.options.width;
            var winH=self.options.height;
            var list=data.data;
            var tempList=[];
            function tryPosition(scale,winH){
                tempList=[];
                $.extend(true,tempList,list);
                for(var i=0;i<tempList.length;i++){
                    if(tempList[i].component){
                        tempList.splice(i,1);
                        i--;
                    }
                }
                var arr=[];
                for(var i=0;i<tempList.length;i++){
                    var tempArr=[];
                    tempArr.push(tempList[i]);
                    arr.push(tempArr);
                }
                //父找子元素
                function getArrByLine2(arr,index){
                    var flag=false;
                    if(arr.length<=1){
                        return arr;
                    }
                    var tempArr=[];
                    $.extend(true,tempArr,arr[index]);

                    for(var i=0;i<index;i++){
                        var nodes=arr[i];
                        for(var j=0;j<nodes.length;j++){
                            var callNodes=nodes[j].callNodes;
                            if(!callNodes){
                                continue;
                            }
                            for(var k=0;k<callNodes.length;k++){
                                for(var l=0;l<tempArr.length;l++){
                                    if(callNodes[k].nodeId==tempArr[l].nodeId){
                                        arr[i]=arr[i].concat(tempArr);
                                        arr.splice(index,1);
                                        return getArrByLine2(arr,index-1);
                                    }
                                }
                            }
                        }
                    }
                    if(index>1){
                        return getArrByLine2(arr,index-1);
                    }

                    return arr;
                }
                //子找父元素
                function getArrByLine3(arr,index){
                    var flag=false;
                    if(arr.length<=1||index==arr.length-1){
                        return arr;
                    }
                    var tempArr=[];
                    $.extend(true,tempArr,arr[index]);
                    for(var i=index+1;i<arr.length;i++){
                        var nodes=arr[i];
                        for(var j=0;j<nodes.length;j++){
                            var callNodes=nodes[j].callNodes;
                            if(!callNodes){
                                continue;
                            }
                            for(var k=0;k<callNodes.length;k++){
                                for(var l=0;l<tempArr.length;l++){
                                    if(callNodes[k].nodeId==tempArr[l].nodeId){
                                        arr[index]=arr[i].concat(tempArr);
                                        arr.splice(i,1);
                                        return getArrByLine3(arr,index);
                                    }
                                }
                            }
                        }
                    }
                    if(index<arr.length){
                        return getArrByLine3(arr,index+1);
                    }
                    return arr;
                }
                if(arr.length>1){
                    getArrByLine2(arr,arr.length-1);
                }
                if(arr.length>1){
                    getArrByLine3(arr,0);
                }
                arr.sort(function(a,b){
                    return a.length- b.length;
                });
                var rowHeight=210*scale;
                var componentR=350*scale;
                var colTop=0.5*componentR;
                var colLeft=1.2*componentR;
                var rowWidth=540*scale;
                var currentColWidth=colLeft;
                var currnetRowHeight=colTop;
                var acreage=0;
                /**************开始分配坐标*****************************************/
                for(var i=0;i<arr.length;i++){
                    if(arr[i].length==1){
                        var componentNodes=[];
                        var callNodes=arr[i][0].callNodes;
                        var aP={x:0,y:0};//应用的坐标
                        if(!callNodes){
                            callNodes=[];
                        }
                        for(var j=0;j<callNodes.length;j++){
                            for(var g=0;g<list.length;g++){
                                if(list[g].component&&callNodes[j].nodeId==list[g].nodeId){
                                    componentNodes.push(g);
                                }
                            }
                        }
                        if(componentNodes.length>1){
                            acreage+=(rowHeight+componentR)*rowWidth;
                            if(currnetRowHeight+rowHeight+componentR>winH){
                                currentColWidth+=rowWidth;
                                currnetRowHeight=colTop;
                            }

                        }else{
                            acreage+=rowHeight*rowWidth;
                            if(currnetRowHeight+rowHeight>winH){
                                currentColWidth+=rowWidth;
                                currnetRowHeight=colTop;
                            }
                        }
                        for(var j=0;j<list.length;j++){
                            if(list[j].nodeId==arr[i][0].nodeId){
                                aP={x:currentColWidth,y:currnetRowHeight};
                                list[j].position=self._getScaleBeforePosition(currentColWidth,currnetRowHeight);
                                break;
                            }
                        }
                        if(componentNodes.length>1){
                            var angel=135;
                            angel-=componentNodes.length*10;
                            for(var k=0;k<componentNodes.length;k++){
                                var rad=Raphael.rad(k*20+angel);
                                var r;
                                if(k%2==1){
                                    r=componentR;
                                }else{
                                    r=9*componentR/13;
                                }
                                var x=aP.x+Math.cos(rad)*r;
                                var y=aP.y+Math.sin(rad)*r;
                                list[componentNodes[k]].position=self._getScaleBeforePosition(x,y);
                            }
                        }else if(componentNodes.length==1){
                            var angel=182;
                            var rad=Raphael.rad(angel);
                            var r=7*componentR/11;
                            var x=aP.x+Math.cos(rad)*r;
                            var y=aP.y+Math.sin(rad)*r;
                            list[componentNodes[0]].position=self._getScaleBeforePosition(x,y);
                        }
                        if(componentNodes.length>1){
                            currnetRowHeight+=rowHeight+componentR;
                        }else{
                            currnetRowHeight+=rowHeight;
                        }

                    }
                }
                for(var i=0;i<arr.length;i++){
                    if(arr[i].length==1){
                        arr.splice(i,1);
                        i--;
                    }
                }

                /******************对一个应用的数据坐标处理完毕***********************************/
                for(var i=0;i<arr.length;i++){
                    if(arr[i].length==2){
                        var nodes1=arr[i][0];
                        var componentNodes1=[];
                        var componentNodes2=[];
                        componentNodes1.push(nodes1.nodeId);
                        var callNodes=nodes1.callNodes;
                        if(!callNodes){
                            callNodes=[];
                        }
                        for(var j=0;j<callNodes.length;j++){
                            for(var k=0;k<list.length;k++){
                                if(list[k].component&&list[k].nodeId==callNodes[j].nodeId){
                                    componentNodes1.push(k);
                                }
                            }
                        }
                        var nodes2=arr[i][1];
                        componentNodes2.push(nodes2.nodeId);
                        callNodes=nodes2.callNodes;
                        if(!callNodes){
                            callNodes=[];
                        }
                        for(var j=0;j<callNodes.length;j++){
                            for(var k=0;k<list.length;k++){
                                if(list[k].component&&list[k].nodeId==callNodes[j].nodeId){
                                    componentNodes2.push(k);
                                }
                            }
                        }

                        if(componentNodes1.length>2&&componentNodes2.length>2){
                            acreage+=rowWidth*2*(rowHeight+componentR);
                            if(currnetRowHeight+2*(rowHeight+componentR)>winH){
                                currentColWidth+=rowWidth+50*scale;
                                currnetRowHeight=colTop;
                            }
                        }else if((componentNodes1.length<3&&componentNodes2.length>2)||(componentNodes1.length>2&&componentNodes2.length<3)) {
                            acreage+=rowWidth*(2*rowHeight+componentR+50*scale);
                            if(currnetRowHeight+2*rowHeight+componentR+50*scale>winH){
                                currentColWidth+=rowWidth+50*scale;
                                currnetRowHeight=colTop+50*scale;
                            }
                        }else{
                            acreage+=rowWidth*2*rowHeight;
                            if(currnetRowHeight+2*rowHeight>winH){
                                currentColWidth+=rowWidth+50*scale;
                                currnetRowHeight=colTop+50*scale;
                            }
                        }
                        var aP={x:0,y:0};//应用的坐标
                        for(var k=0;k<list.length;k++){
                            if(list[k].nodeId==componentNodes1[0]){
                                aP={x:currentColWidth,y:currnetRowHeight}
                                list[k].position=self._getScaleBeforePosition(currentColWidth,currnetRowHeight);
                                break;
                            }
                        }
                        if(componentNodes1.length>2){
                            var angel=70;
                            angel-=(componentNodes1.length-1)*10;
                            for(var k=1;k<componentNodes1.length;k++){
                                var rad=Raphael.rad((k-1)*20+angel);
                                var r;
                                if(k%2==1){
                                    r=componentR;
                                }else{
                                    r=9*componentR/13;
                                }
                                var x=aP.x+Math.cos(rad)*r;
                                var y=aP.y+Math.sin(rad)*r;
                                list[componentNodes1[k]].position=self._getScaleBeforePosition(x,y);
                            }
                        }else if(componentNodes1.length==2){
                            var angel=172;
                            var rad=Raphael.rad(angel);
                            var r=9*componentR/11;
                            var x=aP.x+Math.cos(rad)*r;
                            var y=aP.y+Math.sin(rad)*r;
                            list[componentNodes1[1]].position=self._getScaleBeforePosition(x,y);
                        }
                        if(componentNodes1.length>2){
                            currnetRowHeight+=rowHeight+componentR;
                        }else{
                            currnetRowHeight+=rowHeight;
                        }
                        for(var k=0;k<list.length;k++){
                            if(list[k].nodeId==componentNodes2[0]){
                                aP={x:currentColWidth,y:currnetRowHeight}
                                list[k].position=self._getScaleBeforePosition(currentColWidth,currnetRowHeight);
                                break;
                            }

                        }
                        if(componentNodes2.length>2){
                            var angel=70;

                            angel-=(componentNodes2.length-1)*10;
                            for(var k=1;k<componentNodes2.length;k++){
                                var rad=Raphael.rad((k-1)*20+angel);
                                var r;
                                if(k%2==1){
                                    r=componentR;
                                }else{
                                    r=9*componentR/13;
                                }
                                var x=aP.x+Math.cos(rad)*r;
                                var y=aP.y+Math.sin(rad)*r;
                                list[componentNodes2[k]].position=self._getScaleBeforePosition(x,y);
                            }
                        }else if(componentNodes2.length==2){
                            var angel=172;
                            var rad=Raphael.rad(angel);
                            var r=9*componentR/11;
                            var x=aP.x+Math.cos(rad)*r;
                            var y=aP.y+Math.sin(rad)*r;
                            list[componentNodes2[1]].position=self._getScaleBeforePosition(x,y);
                        }
                        if(componentNodes2.length>2){
                            currnetRowHeight+=rowHeight+componentR;
                        }else{
                            currnetRowHeight+=rowHeight;
                        }


                    }
                }
                for(var i=0;i<arr.length;i++){
                    if(arr[i].length==2){
                        arr.splice(i,1);
                        i--;
                    }
                }
                /******************两个应用的数据坐标处理完毕***********************************/
                var applicationR=self.apR;
                //var sideLength=280*scale+2*applicationR;
                var sideLength=450*scale;
                var isPolygonR=false;
                for(var i=0;i<arr.length;i++){
                    if(arr[i].length>2){
                        var nodes=arr[i];
                        var sideCount=nodes.length;
                        var rad=Raphael.rad(180/sideCount);
                        var polygonR=sideLength/(2*Math.sin(rad));
                        var avAngel=360/sideCount;
                        if(currnetRowHeight+2*polygonR+50*scale>winH){
                            if(isPolygonR){
                                currentColWidth+=1.3*polygonR;
                            }else{
                                isPolygonR=true;
                                currentColWidth+=rowWidth;
                            }
                            currnetRowHeight=colTop+50*scale;

                        }
                        acreage+=Math.pow(4*polygonR,2);
                        var centerX=currentColWidth+polygonR;
                        var centerY=currnetRowHeight+polygonR+50*scale;
                        var aComponent=[];
                        for(var j=0;j<nodes.length;j++){
                            for(var k=0;k<list.length;k++){
                                if(nodes[j].nodeId==list[k].nodeId){
                                    var rad=Raphael.rad(avAngel*j);
                                    var r;
                                    r=polygonR-30*scale;
                                    var x=centerX+Math.cos(rad)*r;
                                    var y=centerY+Math.sin(rad)*r;
                                    var ar=[];
                                    ar.push(x);
                                    ar.push(y);
                                    list[k].position=self._getScaleBeforePosition(x,y);
                                    var callNodes=list[k].callNodes;
                                    if(!callNodes){
                                        callNodes=[];
                                    }
                                    for(var g=0;g<callNodes.length;g++){
                                        for(var l=0;l<list.length;l++){
                                            if(list[l].component&&callNodes[g].nodeId==list[l].nodeId){
                                                ar.push(l);
                                            }
                                        }
                                    }
                                    aComponent.push(ar);
                                }
                            }
                        }
                        for(var j=0;j<aComponent.length;j++){
                            var components=aComponent[j];
                            if(components.length>2){
                                var angle = Raphael.angle(centerX,centerY,components[0], components[1]);
                                var bAngle=angle-12*(components.length-2);
                                for(var k=2;k<components.length;k++){
                                    var rad=Raphael.rad(bAngle+24*(k-2));
                                    var x=components[0]-Math.cos(rad)*(250*scale);
                                    var y=components[1]-Math.sin(rad)*(250*scale);
                                    list[components[k]].position=self._getScaleBeforePosition(x,y);
                                }
                            }

                        }
                        currnetRowHeight+=2*polygonR+500*scale;
                    }
                }
                return {acreage:acreage};
            }
            var winRatio=winW/winH;
            var minWinHeight;
            var minWinWidth;
            var acreage;
            var gotoFlag=true;//是否继续调整坐标
            var vx=0;
            var vy=0;
            self.paper.setViewBox(0,0,winW,winH);
            self.options.viewBoxX=0;
            self.options.viewBoxY=0;
            while(gotoFlag){
                self._setScale(scale);
                acreage=tryPosition(scale,winH).acreage;
                if(acreage<winH*winW*1.3){
                    minWinHeight=Math.sqrt(acreage/winRatio);
                    if(minWinHeight>0.9*winH){
                        minWinHeight=0.9*winH
                    }
                    tryPosition(scale,minWinHeight);
                    data.data=list;
                    self._setData(data);
                    self._render();
                    var minX=winW;
                    var minY=winH;
                    var MaxX=0;
                    var MaxY=0;
                    self.paper.forEach(function(el){
                        var pos=el._getBBox();
                        if(pos.x!=0){
                            if(pos.x<minX){
                                minX=pos.x;
                            }
                            if(pos.y<minY){
                                minY=pos.y;
                            }
                            if(pos.x+pos.width>MaxX){
                                MaxX=pos.x+pos.width;
                            }
                            if(pos.y+pos.height>MaxY){
                                MaxY=pos.y+pos.height;
                            }
                        }
                    });
                    if(minX>0&&minY>0&&(MaxX-minX<winW*0.9)&&(MaxY-minY<winH*0.9)){
                        vx=-minX+(winW-(MaxX-minX))/2;
                        vy=-minY+(winH-(MaxY-minY))/2;
                        self.options.viewBoxX=vx;
                        self.options.viewBoxY=vy;
                        self.paper.setViewBox(-vx,-vy,winW,winH);
                        return scale;
                    }
                }
                if(scale<self.options.minScale){
                    gotoFlag=false;
                    scale=self.options.minScale;
                    self._setScale(scale);
                    tryPosition(scale,winH);
                    break;
                }
                if(gotoFlag){
                    scale-=0.05;
                }
            }
            return scale;
        },
        _getCenterPosition:function(){
            return this.centerPosition;
        },
        //中心坐标为原始坐标，并非缩放后的坐标
        _setCenterPosition:function(x,y){
            this.centerPosition={x:x,y:y};
        },
        //碰撞检测圆到圆
        _collisionCtoC:function(x1,y1,r1,x2,y2,r2){
           var dis=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
            if(dis>=r1+r2){
                return false;//没碰到
            }else{
                return true;//碰到了
            }
        },
        //碰撞检测长方形到圆
        _collisionRtoC:function(x1,y1,w1,h1,x2,y2,r2){
            if (x1 >= x2 && x1 >= x2 + r2) {
                return false;
            } else if (x1 <= x2 && x1 + w1+r2 <= x2) {
                return false;
            } else if (y1 >= y2 && y1 >= y2 + r2) {
                return false;
            } else if (y1 <= y2 && y1 + h1+r2 <= y2) {
                return false;
            } else{
                return true;
            }
        },
        //碰撞检测长方形到长方形
        _collisionRtoR:function(x1,y1,w1,h1,x2,y2,w2,h2){
            if (x1 >= x2 && x1 >= x2 + w2) {
                return false;
            } else if (x1 <= x2 && x1 + w1 <= x2) {
                return false;
            } else if (y1 >= y2 && y1 >= y2 + h2) {
                return false;
            } else if (y1 <= y2 && y1 + h1 <= y2) {
                return false;
            } else{
                return true;
            }
        },
        //校验文字是否重合
        _CheckTextCoincidence:function(x,y,width,height){
            var self=this;
            var texts=self.texts;
            for(var i=0;i<texts.length;i++){
                var pos=texts[i]._getBBox();
                if(self._collisionRtoR(x,y,width,height,pos.x,pos.y,pos.width,pos.height)){
                    return true;
                }
            }
            return false;
        },
        //校验图标是否重合
        _CheckImgCoincidence:function(obj){
            var self=this;
            var scale=self._getScale();
            var cR=self.cR;
            var circles=[];
            if(obj.aCircle&&obj.aCircle.length>0){
                if(obj.application){
                    self.paper.forEach(function(el){
                        if(el[0].tagName=="circle"&&el!==obj.aCircle[0]&&el!==obj.aCircle[1]&&el!==obj.aCircle[2]){
                            circles.push(el);
                        }

                    });
                }else{
                    self.paper.forEach(function(el){
                        if(el[0].tagName=="circle"&&el!==obj.aCircle[0]){
                            circles.push(el);
                        }
                    });
                }
            }else{
                self.paper.forEach(function(el){
                    if(el[0].tagName=="circle"){
                        circles.push(el);
                    }
                });
            }
            if(obj.aCircle&&obj.aCircle.length>0){
                for(var i=0;i<obj.aCircle.length;i++){
                    for(var j=0;j<circles.length;j++){
                        if(self._collisionCtoC(obj.aCircle[i].attr("cx"),obj.aCircle[i].attr("cy"),obj.aCircle[i].attr("r"),circles[j].attr("cx"),circles[j].attr("cy"),circles[j].attr("r"))){
                            return true;
                        }
                    }
                }
            }else{
               if(obj.application){
                   for(var j=0;j<circles.length;j++){
                       if(self._collisionCtoC(obj.x,obj.y,50*scale,circles[j].attr("cx"),circles[j].attr("cy"),circles[j].attr("r"))){
                           return true;
                       }
                   }
               }else{
                   for(var j=0;j<circles.length;j++){
                       if(self._collisionCtoC(obj.x,obj.y,cR,circles[j].attr("cx"),circles[j].attr("cy"),circles[j].attr("r"))){
                           return true;
                       }
                   }
               }
            }
            return false;

        },

        //校验文字和图片是否重合,传递进来的是文字的相关信息
        _CheckTextAndImgCoincidence:function(x,y,width,height){
            var self=this;
            var circles=[];
            self.paper.forEach(function(el){
                if(el[0].tagName=="circle"){
                    circles.push(el);
                }
            });
            for(var j=0;j<circles.length;j++){
                if(self._collisionRtoC(x,y,width,height,circles[j].attr("cx"),circles[j].attr("cy"),circles[j].attr("r"))){
                    return true;
                }
            }
        },
        //校验图片和文字是否重合,传递进来的是图片的相关信息,这用传递过来的认为是圆，应用和组件抽象成圆
        _CheckImgAndTextCoincidence:function(x,y,r){
            var self=this;
            var texts=self.texts;
            for(var i=0;i<texts.length;i++){
                var pos=texts[i]._getBBox();
                if(self._collisionRtoC(pos.x,pos.y,pos.width,pos.height,x,y,r)){
                    return true;
                }
            }
            return false;
        },
      /**
        * param 坐标参数为没有缩放的原始坐标
        * return 坐标为缩放后的坐标
        * */
        _getScaleAfterPosition:function(x,y){
            var self=this;
            var scale=self._getScale();
            var p=self._getCenterPosition();
            var cx= p.x;
            var cy= p.y;
            return {x:x-(cx-x)*(scale-1),y:y-(cy-y)*(scale-1)};
        },
        /* *
         * param 坐标参数为缩放后的坐标
         * return 坐标为缩放前的坐标
         * */
        _getScaleBeforePosition:function(x,y){
            var self=this;
            var scale=self._getScale();
            var p=self._getCenterPosition();
            var cx= p.x;
            var cy= p.y;
            return {x:(x-cx+cx*scale)/scale,y:(y-cy+cy*scale)/scale};
        },
        //设置最后一个应用NodeId
        _setLastNodeAId:function(id){
            this.lastNodeAId=id;
        },
        _getLastNodeAId:function(){
            var self=this;
            var lId;
            var d=self._getData().data;
            for(var i=0;i< d.length;i++){
                if(d[i].nodeId==self.lastNodeAId){
                    return self.lastNodeAId;
                }
                lId=d[i].nodeId;
            }
            self._setLastNodeAId(lId);
            return lId;
        },
        _getData:function(){
            return this.data;
        },
        _setData:function(d){
            this.data=d;
        },
        _updateData:function(obj){
            var self=this;
            var data=self._getData();
            var d=data.data;
            for(var i=0;i< d.length;i++){
                if(d[i].nodeId==obj.nodeId){
                    d[i]=obj;
                    break;
                }
            }
            data.data=d;
            self._setData(data);
        },
        _getRandom:function(n,m){
           return parseInt(n+Math.random()*(m-n));
        },
        _getRandomPosition:function(x1,y1,x2,y2,r,obj){
            var j=0;
            var self=this;
            var list=self._getData().data;
            var x=0;
            var y=0;
            var scale=self._getScale();
            while(j<20){
               x=self._getRandom(x1,x2);
               y=self._getRandom(y1,y2);

               var flag=true;
               for(var i=0;i<list.length;i++){
                   var node=list[i];
                   if(node.application){
                       var xx=node.position.x;
                       var yy=node.position.y;
                       var len=Math.sqrt((yy-y)*(yy-y)+(xx-x)*(xx-x));
                       if(len<3*r){
                           flag=false;
                           break;
                       }
                   }else{
                       var xx=node.position.x+self.options.Cw/2;
                       var yy=node.position.y+self.options.Ch/2;
                       var len=Math.sqrt((yy-y)*(yy-y)+(xx-x)*(xx-x));
                       if(len<3*r){
                           flag=false;
                           break;
                       }
                   }
               }
               if(flag){
                   j++;
                   if(obj.application){

                   }else{
                       var labelW=44*self._getStrLen(obj.component.serviceProtocolType)*scale;
                       var labelH=62*scale;
                       var labelX=x+self.Cw/2-labelW/2;
                       var labelY=y+self.Ch+10*scale;
                       self.paper.forEach(function(el){

                           if(el[0].tagName=="text"){

                               var pos=el._getBBox();
                               if(self._collisionRtoR(labelX,labelY,labelW,labelH,pos.x,pos.y,pos.width,pos.height)){
                                   flag=false;
                                   return false;
                               }
                               if(self._collisionRtoR(x,y,self.Cw+30*scale,self.Ch+30*scale,pos.x,pos.y,pos.width,pos.height)){
                                   flag=false;
                                   return false;
                               }
                           }

                       });
                   }
               }


               if(flag){
                   return {x:x,y:y};
               }
            }
            return {x:x,y:y};

        },
        _computePosition:function(obj){
           var self=this;
           var cR=self.cR;
           var apR=self.apR;
           var scale=self._getScale();
           var x=200;
           var y=200;
           if(!obj){
                return null;
            }
            var node=self._exitsNode(obj);
            if(node){
                return {x:node.position.x,y:node.position.y,exit:true};
            }
            node=self._getDataById(self._getLastNodeAId());
            node=self._getScaleAfterPosition(node.position.x,node.position.y);
            var R=self.apR*4;
            var incrementR=2*apR;
            var flag=true;
            var ap=obj.application;
            var aBottomText="";//应用下边文字
            var aRightText="";//应用右边文字
            if(ap){
                if(ap.name){
                    aBottomText=ap.name;
                }
                if(ap.metrics){
                    var rpm=ap.metrics.rpm;
                    var errorRate=ap.metrics.errorRate;
                    var apdex=ap.metrics.apdex;
                    var responseTime=ap.metrics.responseTime;
                    var str="";
                    if(rpm&&rpm.inLine){
                        str+=rpm.value+""+rpm.unit;
                    }
                    if(responseTime&&responseTime.inLine){
                        if(str!==""){
                            str+="  /  "
                        }
                        str+=responseTime.value+""+responseTime.unit;
                    }
                    if(apdex&&apdex.inLine){
                        if(str!==""){
                            str+="  /  "
                        }
                        str+=apdex.sign+""+apdex.value+""+apdex.unit;
                    }

                    if(errorRate&&errorRate.inLine){
                        if(str!==""){
                            str+="  /  "+errorRate.value+""+errorRate.unit;
                        }else{
                            str+=errorRate.value+""+errorRate.unit;
                        }
                    }
                    aRightText=str;
                }
            }
            self.texts=[];
            self.paper.forEach(function(el){
                if(el[0].tagName=="text"){
                    self.texts.push(el);
                }
            });
            while(R<14*apR&&flag){
                for(var i=0;i<360;i+=30){
                    var rad=Raphael.rad(i);
                    x=node.x-Math.cos(rad)*R;
                    y=node.y-Math.sin(rad)*R;
                    var o={};
                    o.x=x;
                    o.y=y;
                    if(obj.application){
                        o.application=true;
                    }else{
                        o.application=false;
                    }
                    o.nodeId=obj.nodeId;
                    if(!self._CheckImgCoincidence(o)){
                        if(obj.application){
                            if(!self._CheckImgAndTextCoincidence(o.x,o.y,50*scale)){
                                if(!self._CheckImgAndTextCoincidence(o.x,o.y,apR)){

                                }
                                var $div1=$("<span>"+aBottomText+"</span>");
                                $div1.css({"fontSize":"16px","visibility":"hidden","position":"absolute"});
                                var $div2=$("<span>"+aRightText+"</span>");
                                $div2.css({"fontSize":"14px","visibility":"hidden","position":"absolute"});
                                $("body").append($div1);
                                $("body").append($div2);
                                var labelW1=$div1.width();
                                var labelH1=$div1.height();
                                var labelW2=$div2.width();
                                var labelH2=$div2.height();
                                $div1.remove();
                                $div2.remove();
                                var labelX1=o.x-(labelW1/2);
                                var labelY1= o.y+apR+20*scale;
                                var labelX2=o.x-(labelW2/2);
                                var labelY2= o.y+apR+50*scale;
                                if((!self._CheckTextCoincidence(labelX1,labelY1,labelW1,labelH1))&&(!self._CheckTextCoincidence(labelX2,labelY2,labelW2,labelH2))){
                                    if((!self._CheckTextAndImgCoincidence(labelX1,labelY1,labelW1,labelH1))&&(!self._CheckTextAndImgCoincidence(labelX2,labelY2,labelW2,labelH2))){
                                        flag=false;
                                        break;
                                    }
                                }
                            }
                        }else{
                            if(!self._CheckImgAndTextCoincidence(o.x,o.y,cR)){
                                var $div=$("<span>"+obj.component.serviceProtocolType+"</span>");
                                $div.css({"fontSize":"14px","visibility":"hidden","position":"absolute"});
                                $("body").append($div);
                                var labelW=$div.width();
                                var labelH=$div.height();
                                $div.remove();
                                var labelX=o.x-(labelW/2);
                                var labelY= o.y+cR+20*scale;
                                if(!self._CheckTextCoincidence(labelX,labelY,labelW,labelH)){
                                    if(!self._CheckTextAndImgCoincidence(labelX,labelY,labelW,labelH)){
                                        flag=false;
                                        break;
                                    }
                                }

                            }
                        }



                    }
                }
                R+=incrementR;

            }

            return self._getScaleBeforePosition(x,y);
        },
        //计算字符串长度
        _getStrLen:function(str){
            if(!str){
                str="";
            }
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255 || str.charCodeAt(i) < 0) len += 2; else len ++;
            }
            return len;
        },

       _saveData:function(obj){
           var self=this;
           if(!obj){
               return;
           }
           var data=self._getData();
           var list=data.data;
           for(var i=0;i<list.length;i++){
               if(list[i].nodeId==obj.nodeId){
                   list[i]=obj;
                   break;
               }
               if(i==(list.length-1)){
                   list.push(obj);
                   break;
               }
           }
           if(list.length==0){
               list.push(obj);
           }
           if(obj.application){
               self._setLastNodeAId(obj.nodeId);
           }
           if(obj.component){
               for(var i=0;i<list.length;i++){
                   if(list[i].application&&list[i].id==obj.id){
                       var callNodes=list[i].callNodes;
                       if(!callNodes){
                           callNodes=[]
                       }
                       for(var k=0;k<callNodes.length;k++){
                           var c=callNodes[k];
                           if(c.id==0){
                               var o=obj.component;
                               if(o&&o.serviceType==c.serviceType&&o.hostId==c.hostId&&o.serviceProtocolType==c.serviceProtocolType){
                                   list[i]["callNodes"][k].nodeId=obj.nodeId;
                               }
                           }
                       }
                       break;
                   }
               }
           }else{
               //刷新父应用id
               for(var i=0;i<list.length;i++){
                   if(list[i].application){
                       var callNodes=list[i].callNodes;
                       if(!callNodes){
                           callNodes=[];
                       }
                       for(var k=0;k<callNodes.length;k++){
                           if(list[i]["callNodes"][k]&&callNodes[k].id==obj.id){
                               list[i]["callNodes"][k].nodeId=obj.nodeId;
                           }

                       }
                   }
               }
               for(var i=0;i<list.length;i++){
                   if(list[i].application&&list[i].nodeId==obj.nodeId){//获取新添加的node
                       var callNode=list[i].callNodes;
                       if(!callNode){
                           callNode=[];
                       }
                       for(var j=0;j<callNode.length;j++){
                           for(var k=0;k<list.length;k++){
                               if(list[k].nodeId!=obj.nodeId){
                                   if(list[k].application){
                                       if(callNode[j].id==list[k].id){
                                           list[i]["callNodes"][j].nodeId=list[k].nodeId;
                                       }
                                   }else{
                                       var o=list[k];
                                       var c=callNodes[j];
                                           if(o.serviceType==c.serviceType&&o.hostId==c.hostId&&o.serviceProtocolType==c.serviceProtocolType){
                                           list[i]["callNodes"][j].nodeId=list[k].nodeId;
                                       }
                                   }
                               }

                           }
                       }
                       break;
                   }
               }

           }
           data.data=list;
           self._setData(data);
           self._render();
       },
        _delData:function(id){
            var self=this;
            if(!id){
                return;
            }
            var data=self._getData();
            var list=data.data;
            var node=self._getDataById(id);
            if(node.component){
                for(var i=0;i<list.length;i++){
                    if(id==list[i].nodeId){
                        list.splice(i,1);
                        break;
                    }
                }
            }else{
                var callNodes=node.callNodes;
                if(!callNodes){
                    callNodes=[];
                }
                for(var i=0;i<callNodes.length;i++){
                    for(var k=0;k<list.length;k++){
                      if(list[k]&&callNodes[i].nodeId==list[k].nodeId){
                          if(list[k].component){
                             list.splice(k,1);
                             k--;
                          }
                      }
                    }
                }
                for(var i=0;i<list.length;i++){
                    if(id==list[i].nodeId){
                        list.splice(i,1);
                        break;
                    }
                }
            }
            data.data=list;
            self._setData(data);
            self._render();
        },
        _getParentsDataById:function(id){
            var d=this._getData().data;
            var arr=[];
            for(var i=0;i< d.length;i++){
                var ch=d[i].callNodes;
                if(ch&&ch.length>0){
                    for(var j=0;j<ch.length;j++){
                        if(id==ch[j].nodeId){
                            arr.push(d[i]);
                        }
                    }
                }
            }
            return arr;
        },
        //通过nodeId获取元素
        _getDataById:function(id){
            var d=this._getData().data;
            var node=null;
            for(var i=0;i< d.length;i++){
                if(d[i].nodeId==id){
                    node=d[i];
                    break;
                }

            }
            return node;
        },
        //判断页面是否存在该元素,如果存在就返回该元素
        _exitsNode:function(obj){
            var d=this._getData().data;
            var node=null;
            if(obj.application){
                for(var i=0;i< d.length;i++){
                    if(d[i].id==obj.id){
                        node=d[i];
                        break;
                    }
                }
            }else{
                var o=obj.component;
                for(var i=0;i< d.length;i++){
                    if(d[i].component){
                        var c=d[i].component
                        if(d[i].id==obj.id&&o.serviceType==c.serviceType&&o.hostId==c.hostId&&o.serviceProtocolType==c.serviceProtocolType){
                            node=d[i];
                            break;
                        }
                    }

                }

            }

            return node;
        },
        _getScale:function(){
            return this.scale;
        },
        _setScale:function(s){
            this.apR=this.options.apR*s;
            this.apoRW=this.options.apoRW*s;
            this.aSignR=this.options.aSignR*s;
            this.Cw=this.options.Cw*s;
            this.Ch=this.options.Ch*s;
            this.cR=this.options.cR*s;
            this.arrowSize=this.options.arrowSize*s;
            this.scale=s;
        },
        //用来存储元素信息
        _setElementlist:function(list){
            this.elList=list;
        },
        _getElementlist:function(){
            return this.elList;
        },
        _saveOrUpdateElement:function(obj){
            var list=this._getElementlist();
            if(!list||list.length==0){
                list=[];
                list[0]=obj;
                this._setElementlist(list);
                return;
            }
            for(var i=0;i<list.length;i++){
                if(list[i].id==obj.id){
                    list[i]=obj;
                    this._setElementlist(list);
                    return;
                }
            }
            list.push(obj);
            this._setElementlist(list);
        },

        _getElById:function(id){
            var list=this._getElementlist();
            if(!list||list.length==0){
                return null;
            }
            for(var i=0;i<list.length;i++){
                if(list[i].id==id){
                    return list[i].value;
                }
            }
            return null;

        },
        //获取应用外半径
        _getApoR:function(){
           var scale=this._getScale();
           return this.apR+12*scale+this.options.apoRW;
        },
        /**
         * 通过nodeid获取数据
         * @param id
         * @returns {*}
         * @private
         */
        _getObjById:function(id){
            var d=this._getData().data;
            for(var i=0;i< d.length;i++){
                if(id==d[i].nodeId){
                    return d[i];
                }
            }
            return null;
        },
        _render:function(){
            var self=this;
            var el=self.element;
            var d=self.data.data;
            self._setElementlist([]);
            if(typeof d==="undefined"){
                d=[];
            }
            self.paper.clear();
            for(var i=0;i<d.length;i++){
                var obj=d[i];
                if(obj.application){
                    self._createApplication(self.paper,obj);
                }
                if(obj.component){
                    self._createComponent(self.paper,obj)
                }
            }

        },
        //创建组件
        _createComponent:function(paper,obj){

            var self=this;
            var scale=self._getScale();
            var el=self.element;
            var pos=self._getScaleAfterPosition(obj.position.x,obj.position.y);
            var x=pos.x;
            var y=pos.y;
            var cR=self.cR;
            var colorStat=0;
            var cR=self.cR;
            var html="";
            var $toolTip=null;
            var timer;
            var timer1;
            var xxx;
            var ap=self._getParentsDataById(obj.nodeId)[0]!=null?self._getParentsDataById(obj.nodeId)[0]["application"]:{stat:0};
            if(ap.stat==0||ap.stat){
                colorStat=ap.stat;
            }
            //var circle=paper.circle(x,y,cR).attr({"stroke":"none",fill:self.options.statColor[colorStat]["color1"]});
            //暂时都采用蓝色即self.options.statColor[0]
            var circle=paper.circle(x,y,cR).attr({"stroke":"none",fill:self.options.statColor[0]["color1"]});
            var index=0;
            var c=obj.component;
            var label1= c.serviceProtocolType;
            if(c.serviceType==1){
                label1=c.host;
            }else if(c.serviceType==2){
                if(c.serviceProtocolType.toLowerCase()=="mysql"){
                    index=5;
                }else if(c.serviceProtocolType.toLowerCase()=="oracle"){
                    index=6;
                }else if(c.serviceProtocolType.toLowerCase()=="sqlserver"){
                    index=7;
                }else if(c.serviceProtocolType.toLowerCase()=="db2"){
                    index=8;
                }else if(c.serviceProtocolType.toLowerCase()=="postgresql"){
                    index=9;
                }else if(c.serviceProtocolType.toLowerCase()=="sqlite"){
                    index=10;
                }else if(c.serviceProtocolType.toLowerCase()=="sybase"){
                    index=11;
                }else if(c.serviceProtocolType.toLowerCase()=="derby"){
                    index=12;
                }else{
                    index=1;
                }

            }else if(c.serviceType==3){
                if(c.serviceProtocolType.toLowerCase()=="memcached"){
                    index=2;
                }
                if(c.serviceProtocolType.toLowerCase()=="redis"){
                    index=3;
                }
                if(c.serviceProtocolType.toLowerCase()=="mongodb"){
                    index=4;
                }
            }
            var img=paper.image(self.options.location+self.options.cImags[index].src, x-15*scale, y-15*scale,30*scale,30*scale).attr({'cursor': "pointer"});
            if(self._getData().startTooltip){
                var compontTooltip=self._getData().compontTooltip[obj.nodeId];
                if(typeof(compontTooltip) === "undefined"){
                    compontTooltip={
                        "serviceName" : "",//服务名称
                        "serviceType" : "",//类型
                        "responseTime" : "",
                        "duration": "",//耗时
                        "unit" : "",//单位
                        "count" : ""//调用次数
                    }
                }
                html='<div class="sPosBox1215" style="top:400px;left:800px;">'
                +'<div class="titDiv">'
                +'<div class="float_left">'+message_source_i18n.topologyServiceSuspensionWindow+'</div>'
                +'</div>'
                +'<div class="sPosTableDiv">'
                +'<table cellpadding="0" cellspacing="0" width="400" class="tableBottBor">'
                +'<tr>'
                +'<td><div class="div01 div012">'+compontTooltip.serviceName+'</div></td>'
                +'<td>'
                +'<div class="div01 div012">'+compontTooltip.serviceType+'</div>'
                +'</td>'
                +'</tr>'
                +'<tr>'
                +'<td>'
                +'<div class="div01">'+message_source_i18n.topologyServiceName+'</div>'
                +'</td>'
                +'<td><div class="div01">'+message_source_i18n.topologyType+'</div></td>'
                +'</tr>'
                +'</table>'
                +'<table cellpadding="0" cellspacing="0" width="400" class="sPosTable01">'
                +'<tr>'
                +'<td width="100" style="text-align:left;">'
                +'<div class="div02">'+compontTooltip.duration+compontTooltip.unit+'</div>'
                +'<div class="div03">'+message_source_i18n.topologyTimeConsuming+'</div>'
                +'</td>'
                +'<td>'
                +'<div class="div02">'+compontTooltip.count+'</div>'
                +'<div class="div03">'+message_source_i18n.topologyCallNumber+'</div>'
                +'</td>'
                +'</tr>'
                +'</table>'
                +'</div>'
                +'</div>';
            }
            function Dragger(){
                this.xx = circle.attr("cx");
                this.yy = circle.attr("cy");
                circle.toFront();
                img.toFront();
				l1.toFront();
                xxx&&xxx.toFront();
            }
            function move(dx, dy){
                var cx=this.xx + dx;
                var cy=this.yy + dy;
                var attr = {cx:cx, cy:cy};
                circle.attr(attr);
                img.attr({x:cx-15*scale,y:cy-15*scale});
                var bPos=self._getScaleBeforePosition(cx,cy);
                obj.position.x=bPos.x;
                obj.position.y=bPos.y;
                self._updateData(obj);
                var list=self._getParentsDataById(obj.nodeId);
                for(var i=0;i<list.length;i++){
                    var el=self._getElById(list[i].nodeId);
                    el.data("arrowSetChild").remove();
                    el.data("arrowSetChild",self._renderArrow(paper,list[i]));
                }
				l1.attr({x:cx,y:cy+cR+20*scale});
                l1.toFront();
                if(xxx){
                   xxx.toFront();
                    var xrad1=Raphael.rad(160);
                    var xx1=cx+cR*Math.sin(xrad1);
                    var xy1=cy+cR*Math.cos(xrad1);
                    var xr=18*scale;
                    xxx.attr({x:xx1+20*scale,y:xy1});
                }
                $toolTip&&$toolTip.remove();
                $toolTip=null;
            }
            function up(){
                var o={};
                o.x=this.attr("x");
                o.y=this.attr("y");
                o.application=false;
                o.nodeId=obj.nodeId;
                o.aCircle=[circle];
                var me=this;
                if(self._CheckImgCoincidence(o)){
                    move.call(me,0,0);
                }else{
                    self.options.saveCallback&&self.options.saveCallback.call(self,obj);
                }
                if(!$toolTip&&self._getData().startTooltip){
                    $toolTip=$(html);
                    $(el).find(".sPosBox1215").remove();
                    $(el).append($toolTip);
                    var selfX=paper._viewBox?paper._viewBox["0"]:0;
                    var selfY=paper._viewBox?paper._viewBox["1"]:0;
                    var tW=$toolTip.width();
                    var tH=$toolTip.height();
                    var cx=circle.attr("cx");
                    var cy=circle.attr("cy");
                    var r=self.cR;
                    var tx=cx-selfX-r;
                    var ty=cy-selfY+r+10*scale;
                    if(tx+tW>self.options.width-10){
                        tx=cx-selfX-tW+r;
                    }
                    if(ty+tH>self.options.height-20){
                        ty=cy-selfY-tH-r-10*scale;
                    }
                    $toolTip.css({left:tx+"px",top:ty+"px"});
                    $toolTip.hover(function(){
                        clearTimeout(timer1);
                    },function(){
                        timer1=setTimeout(function(){
                            if($toolTip){
                                $toolTip.remove();
                                $toolTip=null;
                            }
                        },500);
                    });
                }

            }
			var l1=paper.text(x,y+cR+20*scale,label1).attr({"font-size":14*scale+"px"});

            var dragSet=paper.set();//创建拖拽集合
            dragSet.push(circle);
            dragSet.push(img);
            dragSet.attr({"cursor":"pointer"});
            if(self.options.elementDrag){
                dragSet.drag(move, Dragger, up);
            }

            dragSet.mouseover(function(){
                    clearTimeout(timer);
                    clearTimeout(timer1);
                    if(!xxx&&self.options.enableDelete){
                        var xrad1=Raphael.rad(160);
                        var xx1=circle.attr("cx")+cR*Math.sin(xrad1);
                        var xy1=circle.attr("cy")+cR*Math.cos(xrad1);
                        var xr=18*scale;
                        xxx=paper.image(self.options.location+"img/Del.svg",xx1+20*scale,xy1,xr,xr).attr({cursor:"pointer"});
                        xxx.click(function(){
                            clearTimeout(timer);
                            xxx.remove();
                            self.options.delCallback&&self.options.delCallback.call(self,obj.nodeId);
                        }).mouseover(function(){
                            clearTimeout(timer);
                        }).mouseout(function(){
                            timer=setTimeout(function(){
                                xxx.remove();
                                xxx=null;
                            },500);
                        });
                    }

                    if(!$toolTip&&self._getData().startTooltip){
                        $(el).find(".sPosBox,.sPosBox1215").remove();
                        $toolTip=$(html);
                        $(el).find(".sPosBox1215").remove();
                        $(el).append($toolTip);
                        var cx=circle.attr("cx");
                        var cy=circle.attr("cy");
                        var selfX=paper._viewBox?paper._viewBox["0"]:0;
                        var selfY=paper._viewBox?paper._viewBox["1"]:0;
                        var tW=$toolTip.width();
                        var tH=$toolTip.height();
                        var r=self.cR;
                        var tx=cx-selfX-r;
                        var ty=cy-selfY+r+10*scale;
                        if(tx+tW>self.options.width-10){
                            tx=cx-selfX-tW+r;
                        }
                        if(ty+tH>self.options.height-20){
                            ty=cy-selfY-tH-r-10*scale;
                        }
                        $toolTip.css({left:tx+"px",top:ty+"px"});
                        $toolTip.hover(function(){
                            clearTimeout(timer1);
                        },function(){
                            timer1=setTimeout(function(){
                                if($toolTip){
                                    $toolTip.remove();
                                    $toolTip=null;
                                }
                            },500);
                        });
                    }

                }).mouseout(function(){
                    if(self.options.enableDelete){
                        timer=setTimeout(function(){
                            xxx&&xxx.remove();
                            xxx=null;
                        },500);
                    }
                    if(self._getData().startTooltip){
                        timer1=setTimeout(function(){
                            $toolTip&&$toolTip.remove();
                            $toolTip=null;
                        },500);
                    }
                });
                self._saveOrUpdateElement({id:obj.nodeId,value:img,type:2});


        },
        /**
         * 创建应用标签如果onlyMove为true那么就只是移动标签并非新建标签
         * @param paper
         * @param x
         * @param y
         * @param imgSrc
         * @param onlyMove
         * @param oImg
         * @returns {{}}
         * @private
         */
        _createSign:function(paper,x,y,imgSrc,onlyMove,oImg){
            if(onlyMove){
                var self=this;
                var pos=self._getScaleAfterPosition(x,y);
                var x=pos.x;
                var y=pos.y;
                var aSignR=self.aSignR;
                var scale=self._getScale();
                var r=self.apR+10;
                var rad1=Raphael.rad(-45);
                var rad2=Raphael.rad(45);
                var w=aSignR*Math.cos(rad2)+1*scale;
                var x2=x-w;
                var y2=y-w;
                oImg.attr({x:x2,y:y2});
            }else{
                var oSign={};
                var self=this;
                var pos=self._getScaleAfterPosition(x,y);
                var x=pos.x;
                var y=pos.y;
                var aSignR=self.aSignR;
                var scale=self._getScale();
                var r=self.apR+10;
                var rad1=Raphael.rad(-45);
                var rad2=Raphael.rad(45);
                var w=aSignR*Math.cos(rad2)+1*scale;
                var x2=x-w;
                var y2=y-w;
                var img=paper.image(imgSrc, x2, y2, 2*w, 2*w).toFront();
                oSign.img=img;
                return oSign;
            }

        },
        /**
         * 创建应用
         * @param paper
         * @param obj
         * @private
         */
        _createApplication:function(paper,obj){

            var self=this;
            var el=self.element;
            var label11="";
            var label12="";
            var labell3="";
            var labell4="";
            var labell5="";
            var deg=0;
            var signSrc="";
            var ap=obj.application;
            var colorStat=0;
            if(ap&&ap.metrics){
                var callService=ap.metrics.callService;
                var callerService=ap.metrics.callerService;
                var responseTime=ap.metrics.responseTime;
                var rpm=ap.metrics.rpm;
                var errorRate=ap.metrics.errorRate;
                var apdex=ap.metrics.apdex;
                if(callService&&callService.inLine){
                    label11=callService.value+""+callService.unit;
                }
                if(callerService&&callerService.inLine){
                    label12=callerService.value+""+callerService.unit;
                }
                if(ap.name){
                    labell3=ap.name;
                    if(self.data.startApplication){
                    	if(self.data.startApplication==obj.id){
                    		labell3+= message_source_i18n.topologyStart;
                    	}
                    }
                }
                var str="";
                if(rpm&&rpm.inLine){
                    str+=rpm.value+""+rpm.unit;
                }
                if(responseTime&&responseTime.inLine){
                    if(str!==""){
                        str+="  /  "
                    }
                    str+=responseTime.value+""+responseTime.unit;
                }
                if(apdex&&apdex.inLine){
                    if(str!==""){
                        str+="  /  "
                    }
                    str+=apdex.sign+""+apdex.value+""+apdex.unit;
                }
                labell4=str;
                if(errorRate&&errorRate.inLine){
                    if(str!==""){
                        labell5="  /  "+errorRate.value+""+errorRate.unit;
                    }else{
                        labell5=errorRate.value+""+errorRate.unit;
                    }
                    if(errorRate.value>0&&errorRate.value<=2){
                        deg=2*360/100;
                    }else{
                        deg=errorRate.value*360/100;
                    }

                }
                if(ap.language){
                    signSrc=self.options.location+self.options.aImgs[ap.language.toLowerCase()].src;
                }
                if(ap.stat==0||ap.stat){
                    colorStat=ap.stat;
                }
                var toolTipRpm="0";//吞吐量
                var toolTipResponseTime="0";//响应时间
                var toolTipApdex="0";//apdex
                var toolTipErrorRate="0";//平均错误率
                var toolTipCallService="0";//使用服务数量
                var toolTipCallerService="0";//调用服务数量
                if(rpm&&rpm.inLine){
                    toolTipRpm=rpm.value;
                }
                if(responseTime&&responseTime.inLine){
                    toolTipResponseTime=responseTime.value;
                }
                if(apdex&&apdex.inLine){
                    toolTipApdex=apdex.value+'T:'+obj.application.apdexT+'ms';
                }
                if(errorRate&&errorRate.inLine){
                    toolTipErrorRate=errorRate.value;
                }
                if(callService&&callService.inLine){
                    toolTipCallService=callService.value;
                }
                if(callerService&&callerService.inLine){
                    toolTipCallerService=callerService.value;
                }

            }
            var scale=self._getScale();
            var apR=self.apR;
            var apoRW=self.apoRW;
            var pos=self._getScaleAfterPosition(obj.position.x,obj.position.y);
            var x=pos.x;
            var y=pos.y;
            var c1 = paper.circle(x, y, apR).attr({fill:"white",'cursor': "pointer","stroke-width":6*scale,'stroke':self.options.statColor[colorStat]["color1"]});
            var cc1=self._createCircle(paper,x,y,self.options.statColor[colorStat]["color2"],deg,apR,apoRW);
			var dragLabelSet=paper.set();//创建拖拽集合
            function Dragger(){
                this.xx = c1.attr("cx");
                this.yy = c1.attr("cy");
                c1.toFront();
                cc1.toFront();
				//oSign.circle.toFront();
				oSign.img.toFront();
                topCircle.toFront();
                bottomeCircle.toFront();
				l1.toFront();
			    l2.toFront();
			    l3.toFront();
			    l4.toFront();
                //l5.toFront();
                //line.toFront();
                xxx&&xxx.toFront();
                c1.data("selftoself").toFront();
                this.time=new Date().getTime();
                if($toolTip){
                    clearTimeout(timer2);
                    $toolTip.remove();
                    $toolTip=null;
                }
            }
            function move(dx, dy){
                if($toolTip){
                    clearTimeout(timer2);
                    $toolTip.remove();
                    $toolTip=null;
                }
                var cx=this.xx + dx;
                var cy=this.yy + dy;
                var attr = {cx:cx, cy:cy};
                c1.attr(attr);
                cc1.remove();
                cc1=self._createCircle(paper,cx,cy,self.options.statColor[colorStat]["color2"],deg,apR,apoRW);
                c1.toFront();
                cc1.toFront();
                //oSign.circle.toFront();
                oSign.img.toFront();
                topCircle.toFront();
                bottomeCircle.toFront();
                l1.toFront();
                l2.toFront();
                l3.toFront();
                l4.toFront();
                //l5.toFront();
                //line.toFront();
                xxx&&xxx.toFront();
                if(c1.data("arrowSetChild")){
                    c1.data("arrowSetChild").remove();
                }
                //obj.position.x=cx/scale;
               // obj.position.y=cy/scale;
                var bPos=self._getScaleBeforePosition(cx,cy);
                obj.position.x=bPos.x;
                obj.position.y=bPos.y;
                self._updateData(obj);
                c1.data("arrowSetChild",self._renderArrow(paper,obj));
                var list=self._getParentsDataById(obj.nodeId);
                for(var i=0;i<list.length;i++){
                    var el=self._getElById(list[i].nodeId);
                    el.data("arrowSetChild").remove();
                    el.data("arrowSetChild",self._renderArrow(paper,list[i]));
                }
				self._createSign(paper,obj.position.x,obj.position.y,signSrc,true,oSign.img);
				l1.attr({x:cx,y:cy-apR});
			    l2.attr({x:cx,y:cy+apR});
			    l3.attr({x:cx,y:cy+apR+20*scale});
                topCircle.attr({cx:cx,cy:cy-apR});
                bottomeCircle.attr({cx:cx,cy:cy+apR});
			    l4.attr({x:cx,y:cy+apR+50*scale});
               // var l4P=l4._getBBox();
               // l5.attr({x:l4P.x+4*scale+l4P.width,y:cy-(self._getApoR()-45*scale)/2});
				if(xxx){
                    var xrad1=Raphael.rad(125);
                    var xx1=cx+apR*Math.sin(xrad1);
                    var xy1=cy+apR*Math.cos(xrad1);
                    var xr=18*scale;
                    xxx.attr({x:xx1-(xr/2),y:xy1-(xr/2)});
                    xxx.toFront();
                }
                //line.attr({x:cx-(self.apR-10*scale),y:cy-1*scale});
                c1.data("selftoself").remove();
                c1.data("selftoself",self._createSelfToSelfArrow(paper,cx,cy,obj));
            }
            function up(){
                var o={};
                o.x=c1.attr("cx");
                o.y=c1.attr("cy");
                o.application=true;
                o.nodeId=obj.nodeId;
                o.aCircle=[c1,topCircle,bottomeCircle];
                var me=this;
                if((new Date().getTime())-this.time>160){
                    if(self._CheckImgCoincidence(o)){
                        move.call(me,0,0);
                    }
                    self.options.saveCallback&&self.options.saveCallback.call(self,obj);
                }else{
                    self._setLastNodeAId(obj.nodeId);
                    self.options.clickCallback&&self.options.clickCallback.call(self,obj);
                }
                clearTimeout(timer2);
                if(!$toolTip){
                    $(el).find(".sPosBox,.sPosBox1215").remove();
                    $toolTip=$(html);
                    $toolTip.find(".showSome").click(function(){
                        $toolTip.find(".showSome").hide();
                        $toolTip.find(".all").hide();
                        $toolTip.find(".showAll").show();

                    });
                    $toolTip.find(".showAll").click(function(){
                        $toolTip.find(".showAll").hide();
                        $toolTip.find(".showSome").show();
                        $toolTip.find(".all").show();
                        var allHeight=$toolTip.find(".all").height()*$toolTip.find(".all").size();//剩下部分的高度
                        var t=parseInt($toolTip.css("top"));
                        var h=$toolTip.height();
                        if(t+allHeight+h>self.options.height){
                            var newT=self.options.height-allHeight-h;
                            newT=newT<20?20:newT;
                            $toolTip.css({top:newT+"px"});
                        }
                    });
                    if(self.options.ViewButtonCallBack){
                        $toolTip.find(".sSeeButt").click(function(){
                            self.options.ViewButtonCallBack(obj.id);
                        });
                    }
                    $(el).append($toolTip);
                    var cx=c1.attr("cx");
                    var cy=c1.attr("cy");
                    var selfX=paper._viewBox?paper._viewBox["0"]:0;
                    var selfY=paper._viewBox?paper._viewBox["1"]:0;
                    var tW=$toolTip.width();
                    var tH=$toolTip.height();
                    var r=self.cR;
                    var tx=cx-selfX-r;
                    var ty=cy-selfY+r+20*scale;
                    if(tx+tW>self.options.width){
                        tx=cx-selfX-tW+r;
                    }
                    if(ty+tH>self.options.height){
                        ty=cy-selfY-tH-r-30*scale;
                    }
                    $toolTip.css({left:tx+"px",top:ty+"px"});
                    $toolTip.hover(function(){
                        clearTimeout(timer2);
                    },function(){
                        timer2=setTimeout(function(){
                            if($toolTip){
                                $toolTip.remove();
                                $toolTip=null;
                            }
                        },500);
                    });
                }
            }
            var oSign=self._createSign(paper,obj.position.x,obj.position.y,signSrc);
            //c1.drag(move, Dragger, up);
			dragLabelSet.push(c1);
            c1.data("arrowSetChild",self._renderArrow(paper,obj));
            var topCircle=paper.circle(x,y-apR,10*scale).attr({"fill":self.options.statColor[colorStat]["color1"],"stroke":"none","stroke-width":"0"});
            var bottomeCircle=paper.circle(x,y+apR,10*scale).attr({"fill":self.options.statColor[colorStat]["color1"],"stroke":"none","stroke-width":"0"});
            //var l1=paper.text(x,y-apR,label11).attr({"font-size":16*scale+"px","fill":"#ffffff"});
            var l1=paper.text(x,y-apR,label11).attr({"font-size":14*scale+"px","fill":"#ffffff"});
			var l2=paper.text(x,y+apR,label12).attr({"font-size":14*scale+"px","fill":"#ffffff"});
			var l3=paper.text(x,y+apR+20*scale,labell3).attr({"font-size":14*scale+"px",fill:"#000000"});
            var l4=paper.text(x,y+apR+50*scale,labell4+""+labell5).attr({"font-size":12*scale+"px",fill:"#000000"});
           // var l4P=l4._getBBox();
           // var l5=paper.text(l4P.x+l4P.width+4*scale,y+apR+50*scale,labell5).attr({"font-size":12*scale+"px",'text-anchor': 'start',"fill":"#a373ad"});
           // var line=paper.rect(x-(self.apR-10*scale),y-1*scale,2*(self.apR-10*scale),2*scale).attr({"fill":"#e5e5e5","stroke":"none"});
            c1.data("selftoself",self._createSelfToSelfArrow(paper,x,y,obj));
			dragLabelSet.push(l1);
			dragLabelSet.push(l2);
            dragLabelSet.push(topCircle);
            dragLabelSet.push(bottomeCircle);
            dragLabelSet.push(oSign.img);
			dragLabelSet.attr({"cursor":"pointer"});
			var timer;
            var timer2;
			var xxx;
            if(!xxx&&self._getData().coreApplicationId!==obj.id){
                var xrad1=Raphael.rad(125);
                var xx1=c1.attr("cx")+apR*Math.sin(xrad1);
                var xy1=c1.attr("cy")+apR*Math.cos(xrad1);
                var xr=18*scale;
                if(self.options.enableDelete){
                    xxx=paper.image(self.options.location+self.options.statXXX[colorStat]["src"],xx1-(xr/2),xy1-(xr/2),xr,xr).attr({cursor:"pointer"});
                    xxx.click(function(){
                        self.options.delCallback&&self.options.delCallback.call(self,obj.nodeId);
                    });
                }
            }
            var $toolTip;
                self.toolTipState=["sPosBoxBlue","sPosBoxYellow","sPosBoxOrange","sPosBoxGray"];//tooltip的颜色面板选择
            var html;
            if(self._getData().startTooltip){
                if(self._getData().coreApplicationId==obj.id){
                    var startTooltip=self._getData().startTooltip;
                    html='<div class="sPosBox1215" style="top:500px;left:300px;">'
                    +'<div class="titDiv">'
                    +'<div class="float_left">'+startTooltip.applicationName+'</div>'
                    +'</div>'
                    +'<div class="sPosTableDiv">'
                    +'<table cellpadding="0" cellspacing="0" width="400" class="sPosTable02 tableBottBor">'
                    +'<tr>'
                    +'<td><div class="div01 div012 ellipsis_198" title="'+startTooltip.webAction+'">'+startTooltip.webAction+'</div></td>'
                    +'<td><div class="div01 div012 ellipsis_202" title="'+startTooltip.instance+'">'+startTooltip.instance+'</div></td>'
                    +'</tr>'
                    +'<tr>'
                    +'<td><div class="div01">'+message_source_i18n.topologyApplicationProcess+'</div></td>'
                    +'<td><div class="div01">'+message_source_i18n.topologyInstance+'</div></td>'
                    +'</tr>'
                    +'</table>'
                    +'<table cellpadding="0" cellspacing="0" width="400" class="sPosTable01">'
                    +'<tr>'
                    +'<td width="40">'
                    +'<div class="div02">'+startTooltip.responseTime+startTooltip.unit+'</div>'
                    +'<div class="div03">'+message_source_i18n.topologyTimeConsuming+'</div>'
                    +'</td>'
                    +'<td>'
                    +'<div class="div02">'+startTooltip.callServer+'</div>'
                    +'<div class="div03">'+message_source_i18n.topologyCallServiceNumber+'</div>'
                    +'</td>'
                    +'<td>'
                    +'<div class="div02">'+startTooltip.transcation+'</div>'
                    +'<div class="div03">'+message_source_i18n.topologyCrossApplicationNumber+'</div>'
                    +'</td>'
                    +'<td>'
                    +'<div class="div02">'+startTooltip.traceCount+'</div>'
                    +'<div class="div03">'+message_source_i18n.topologyCorrelationTrackingNumber+'</div>'
                    +'</td>'
                    +'</tr>'
                    +'</table>'
                    +'</div>'
                    +'</div>';
                }else{
                    var calleeTooltip=self._getData().calleeTooltip[obj.nodeId];
                    if(typeof(calleeTooltip)=== "undefined"){
                        calleeTooltip={
                            "responseTime":"",
                            "duration": "",
                            "calleeCount":"",
                            "componentCount":"",
                            "drillUrl":"",
                            "links":[]
                        };
                    }
                    html='<div class="sPosBox1215" style="top:250px;left:20px;">'
                    +'<div class="titDiv titDiv02">'
                    +'<div class="float_left">'+calleeTooltip.applicationName+'</div>'
                    +'<div class="float_right"><a href="'+window._ctx_+calleeTooltip.drillUrl+'" target="_blank">'+message_source_i18n.topologyEGView+'&gt;</a></div>'
                    +'</div>'
                    +'<div class="sPosTableDiv">'
                    +'<table cellpadding="0" cellspacing="0" width="300" class="sPosTable01">'
                    +'<tr>'
                    +'<td width="40">'
                    +'<div class="div02">'+calleeTooltip.duration+calleeTooltip.unit+'</div>'
                    +'<div class="div03">'+message_source_i18n.topologyTimeConsuming+'</div>'
                    +'</td>'
                    +'<td>'
                    +'<div class="div02">'+calleeTooltip.calleeCount+'</div>'
                    +'<div class="div03">'+message_source_i18n.topologyCallNumber+'</div>'
                    +'</td>'
                    +'<td>'
                    +'<div class="div02">'+calleeTooltip.componentCount+'</div>'
                    +'<div class="div03">'+message_source_i18n.topologyCallServiceNumber+'</div>'
                    +'</td>'
                    +'</tr>'
                    +'</table>'
                    +'<table cellpadding="0" cellspacing="0" width="430" class="tableTopBor" >'
                    +'<tr>'
                    +'<th>'+message_source_i18n.topologyApplicationProcess+'</th>'
                    +'<th>'+message_source_i18n.topologyInstance+'</th>'
                    +'<th class="tdTime">'+message_source_i18n.response_time+'</th>'
                    +'<th></th>'
                    +'</tr>';
                for(var i=0;i<calleeTooltip.links.length&&i<4;i++){
                    html+='<tr>'
                    +'<td><div class="div01 ellipsis_114" title="'+calleeTooltip.links[i].webAction+'">'+calleeTooltip.links[i].webAction+'</div></td>'
                    +'<td>'
                    +'<div class="div01 ellipsis_215" title="'+calleeTooltip.links[i].instances+'">'+calleeTooltip.links[i].instances+'</div>'
                    +'</td>'
                    +'<td class="tdTime">'
                    +'<div class="div01">'+calleeTooltip.links[i].responseTime+calleeTooltip.links[i].unit+'</div>'
                    +'</td>';
                    if(calleeTooltip.links[i].drillUrl){
                        html+='<td><a href="'+window._ctx_+calleeTooltip.links[i].drillUrl+'" target="_blank" class="aBtn"></a></td>'
                    }
                    html+='</tr>';
                }
                    for(var i=4;i<calleeTooltip.links.length;i++){
                        html+='<tr class="all" style="display: none;">'
                        +'<td><div class="div01 ellipsis_114" title="'+calleeTooltip.links[i].webAction+'">'+calleeTooltip.links[i].webAction+'</div></td>'
                        +'<td>'
                        +'<div class="div01 ellipsis_215" title="'+calleeTooltip.links[i].instances+'">'+calleeTooltip.links[i].instances+'</div>'
                        +'</td>'
                        +'<td class="tdTime">'
                        +'<div class="div01">'+calleeTooltip.links[i].responseTime+calleeTooltip.links[i].unit+'</div>'
                        +'</td>';
                        if(calleeTooltip.links[i].drillUrl){
                            html+='<td><a href="'+window._ctx_+calleeTooltip.links[i].drillUrl+'" target="_blank" class="aBtn"></a></td>'
                        }
                        html+='</tr>';
                    }
                html+='</table>'
                    +'</div>';
                if(calleeTooltip.links.length>4){
                    html+='<div class="sPosBtnDiv showAll"><span>显示全部</span></div>';
                    html+='<div class="sPosBtnDiv showSome" style="display:none;"><span>收缩</span></div>';
                }
                html+='</div>';
                }

            }else{
               html='<div class="sPosBox '+self.toolTipState[colorStat]+'">'
                                   +'<div class="titDiv">'
                                   +'<div class="float_left">'+labell3+'</div>';
                           if(self.options.showViewButton){
                               if(self.options.ViewButtonCallBack){
                                   html+='<a class="sSeeButt float_right" href="javascript:;">'+message_source_i18n.topologyEGView+'&gt;</a>';
                               }else{
                                   html+='<a class="sSeeButt float_right" href="'+window._ctx_+'/application/'+obj.id+'/overview">'+message_source_i18n.topologyEGView+'&gt;</a>';
                               }

                           }
                           html+='</div>'
                               +'<table cellpadding="0" cellspacing="0" width="100%">'
                               +'<tr>'
                               +'<td rowspan="2"><div class="tabDiv"><span>'+toolTipCallService+'</span><br />'+message_source_i18n.topologyEGCallService+'</div></td>'
                               +'<td class="tdAlignR">'+message_source_i18n.topologyEGThroughtOut+'</td>'
                               +'<td class="tdAlignL">'+toolTipRpm+'rpm</td>'
                               +'</tr>'
                               +'<tr>'
                               +'<td class="tdAlignR">'+message_source_i18n.topologyEGResponseTime+'</td>'
                               +'<td class="tdAlignL">'+toolTipResponseTime+'s</td>'
                               +'</tr>'
                               +'<tr>'
                               +'<td rowspan="2"><div class="tabDiv"><span>'+toolTipCallerService+'</span><br />'+message_source_i18n.topologyEGCallerService+'</div></td>'
                               +'<td class="tdAlignR">Apdex</td>'
                               +'<td class="tdAlignL">'+toolTipApdex+'</td>'
                               +'</tr>'
                               +'<tr>'
                               +'<td class="tdAlignR">'+message_source_i18n.topologyEGErrorRate+'</td>'
                               +'<td class="tdAlignL">'+toolTipErrorRate+'%</td>'
                               +'</tr>'
                               +'</table>'
                               +'</div>';
            }
			dragLabelSet.mouseover(function(){
                    clearTimeout(timer2);
                    if(!$toolTip){
                        $(el).find(".sPosBox,.sPosBox1215").remove();
                        $toolTip=$(html);
                        $toolTip.find(".showSome").click(function(){
                            $toolTip.find(".showSome").hide();
                            $toolTip.find(".all").hide();
                            $toolTip.find(".showAll").show();
                        });
                        $toolTip.find(".showAll").click(function(){
                            $toolTip.find(".showAll").hide();
                            $toolTip.find(".showSome").show();
                            $toolTip.find(".all").show();
                            var allHeight=$toolTip.find(".all").height()*$toolTip.find(".all").size();//剩下部分的高度
                            var t=parseInt($toolTip.css("top"));
                            var h=$toolTip.height();
                            if(t+allHeight+h>self.options.height){
                                var newT=self.options.height-allHeight-h;
                                newT=newT<20?20:newT;
                                $toolTip.css({top:newT+"px"});
                            }
                        });
                        if(self.options.ViewButtonCallBack){
                            $toolTip.find(".sSeeButt").click(function(){
                                self.options.ViewButtonCallBack(obj.id);
                            });
                        }
                        $(el).append($toolTip);
                        var cx=c1.attr("cx");
                        var cy=c1.attr("cy");
                        var selfX=paper._viewBox?paper._viewBox["0"]:0;
                        var selfY=paper._viewBox?paper._viewBox["1"]:0;
                        var tW=$toolTip.width();
                        var tH=$toolTip.height();
                        var r=self.cR;
                        var tx=cx-selfX-r;
                        var ty=cy-selfY+r+20*scale;
                        if(tx+tW>self.options.width){
                            tx=cx-selfX-tW+r;
                        }
                        if(ty+tH>self.options.height){
                            ty=cy-selfY-tH-r-30*scale;
                        }
                        $toolTip.css({left:tx+"px",top:ty+"px"});
                        $toolTip.hover(function(){
                            clearTimeout(timer2);
                        },function(){
                            timer2=setTimeout(function(){
                                if($toolTip){
                                    $toolTip.remove();
                                    $toolTip=null;
                                }
                            },500);
                        });

                    }

				}).mouseout(function(){
                    timer2=setTimeout(function(){
                        if($toolTip){
                            $toolTip.remove();
                            $toolTip=null;
                        }
                    },500);

				});
            if(self.options.elementDrag){
                dragLabelSet.drag(move, Dragger, up);
            }
            self._saveOrUpdateElement({id:obj.nodeId,value:c1,type:1});
        },
        /**
         * 重置箭头
         * @param paper
         * @param obj
         * @returns {*}
         * @private
         */
        _renderArrow:function(paper,obj){

            var self=this;
            var scale=self._getScale();
            var el=self.element;
            var hasChildrenToself=false;//拥有A调用B，B也调用A的情况
            var r=self.apR+5;
            var arrowSet=paper.set();
            var callNodes=obj.callNodes;
            var parentNodes=self._getParentsDataById(obj.nodeId);
            if(callNodes&&callNodes.length>0){
                for(var j=0;j<callNodes.length;j++){
                    var oNode=callNodes[j];
                    if(oNode.nodeId==obj.nodeId){
                        continue;
                    }
                    var callObj=self._getObjById(oNode.nodeId);
                    if(!callObj){
                        continue;
                    }
                    var p,arrow,isCArrow=false;//isCArrow如果是关联组件的线就是虚线
                    if(callObj.application){
                        p=self._getArrowPositionFromAToA(obj.position,callObj.position);
                    }else if(callObj.component){
                        p=self._getArrowPositionFromAToC(obj.position,callObj.position);
                        isCArrow=true;
                    }
                    var angle=0;
                     for(var k=0;k<parentNodes.length;k++){
                        if(oNode&&parentNodes[k].nodeId==oNode.nodeId){
                            angle = Raphael.angle(obj.position.x, obj.position.y, callObj.position.x, callObj.position.y);//得到两点之间的角度
                            var rad1=Raphael.rad(angle+5);
                            var rad2=Raphael.rad(angle-5);
                            var pos1=self._getScaleAfterPosition(obj.position.x,obj.position.y);
                            var pos2=self._getScaleAfterPosition(callObj.position.x, callObj.position.y);
                            p.x1=pos1.x-Math.cos(rad1)*r;
                            p.y1=pos1.y-Math.sin(rad1)*r;
                            p.x2=pos2.x+Math.cos(rad2)*r;
                            p.y2=pos2.y+Math.sin(rad2)*r;
                            hasChildrenToself=true;
                            break;

                        }
                    }
                    var cX=(p.x1+ p.x2)/2;
                    var cY=(p.y1+ p.y2)/2;
                    //arrow=self._createArrow(paper, p.x1, p.y1, p.x2, p.y2,isCArrow);
                    //改为实线
                    arrow=self._createArrow(paper, p.x1, p.y1, p.x2, p.y2);
                    var metrics=oNode.metrics;
                    var l1=""//吞吐率，响应时间
                    var l2=""//调用类型
                    if(oNode.callType){
                        l2=oNode.callType;
                    }
                    if(metrics&&metrics.length>0){
                        var rpm="";
                        var responseTime="";
                        for(var i=0;i<metrics.length;i++){
                            l1+=" "+metrics[i].value+metrics[i].unit;
                        }
                    }
                    var y1=cY;
                    var y2=cY;
                    if(l1!==""&&l2!==""){
                        y1=cY-10*scale;
                        y2=cY+10*scale;
                    }
                    /**if(hasChildrenToself&&((angle>=240&&angle<=300)||(angle>=60&&angle<=120))){
                        console.log(angle);
                        if(cY>p.y1){
                            y1=cY-15*scale;
                        }else{
                            y1=cY+15*scale;
                        }
                    }**/
                    if(hasChildrenToself){
                        if(cY>p.y1){
                            y1=cY-15*scale;
                            cX=cX+15*scale;
                        }else{
                            y1=cY+15*scale;
                            cX=cX-15*scale;
                        }
                    }
                    if(scale>0.8){
                        var label=paper.text(cX,y1,l1).attr({"font-size":scale*12+"px"});
                        var label2=paper.text(cX,y2,l2).attr({"font-size":scale*12+"px"});
                        arrowSet.push(label);
                        arrowSet.push(label2);
                    }
                    if(self._getData().startTooltip){
                        var linksTooltip=self._getData().linksTooltip[obj.nodeId+"_"+oNode.nodeId];
                        if(typeof(linksTooltip)=== "undefined"){
                            linksTooltip={
                                links:[]
                            };
                        }
                        (function(arrow,linksTooltip){
                        	if(linksTooltip.links.length<=0){
                        		return;
                        	}
                            var $toolTip=null;
                            var timer;
                            var html="";
                            html='<div class="sPosBox1215" style="top:100px;left:500px;">'
                            +'<div class="titDiv">'
                            +'<div class="float_left">'+message_source_i18n.topologyApplicationCallConnectionSuspensionWindow+'</div>'
                            +'</div>'
                            +'<div class="sPosTableDiv">'
                            +'<table cellpadding="0" cellspacing="0" width="400" >'
                            +'<tr>'
                            +'<th>URL</th>'
                            +'<th>'+message_source_i18n.topologyAgreement+'</th>'
                            +'<th class="tdTime">'+message_source_i18n.response_time+'</th>'
                            +'<th></th>'
                            +'</tr>';
                            for(var i=0;i<linksTooltip.links.length&&i<4;i++){
                                html+='<tr>'
                                +'<td><div class="div01 ellipsis_238" title="'+linksTooltip.links[i].url+'">'+linksTooltip.links[i].url+'</div></td>'
                                +'<td>'
                                +'<div class="div01">'+linksTooltip.links[i].type+'</div>'
                                +'</td>'
                                +'<td class="tdTime">'
                                +'<div class="div01">'+linksTooltip.links[i].responseTime+linksTooltip.links[i].unit+'</div>'
                                +'</td>';
                                if(linksTooltip.links[i].drillUrl){
                                    html+='<td><a href="'+window._ctx_+linksTooltip.links[i].drillUrl+'" target="_blank" class="aBtn"></a></td>'
                                }
                                html+='</tr>';
                            }
                            for(var i=4;i<linksTooltip.links.length;i++){
                                html+='<tr class="all" style="display:none;">'
                                +'<td><div class="div01 ellipsis_238" title="'+linksTooltip.links[i].url+'">'+linksTooltip.links[i].url+'</div></td>'
                                +'<td>'
                                +'<div class="div01">'+linksTooltip.links[i].type+'</div>'
                                +'</td>'
                                +'<td class="tdTime">'
                                +'<div class="div01">'+linksTooltip.links[i].responseTime+linksTooltip.links[i].unit+'</div>'
                                +'</td>';
                                if(linksTooltip.links[i].drillUrl){
                                    html+='<td><a href="'+window._ctx_+linksTooltip.links[i].drillUrl+'" target="_blank" class="aBtn"></a></td>'
                                }
                                html+='</tr>';
                            }
                        html+='</table>'
                            +'</div>';
                        if(linksTooltip.links.length>4){
                            html+='<div class="sPosBtnDiv showAll"><span>显示全部</span></div>';
                            html+='<div class="sPosBtnDiv showSome" style="display:none;"><span>收缩</span></div>';
                        }
                        html+='</div>';
                            arrow.attr({cursor:"pointer"}).mouseover(function(e){
                                clearTimeout(timer);
                                if($toolTip){
                                    return;
                                }
                                $(el).find(".sPosBox,.sPosBox1215").remove();
                                $toolTip=$(html);
                                $(el).append($toolTip);
                                var l=$(window).scrollLeft()+e.clientX-$(el).offset().left;
                                var t=$(window).scrollTop()+e.clientY-$(el).offset().top;
                                var tW=$toolTip.width();
                                var tH=$toolTip.height();

                                if(l+tW+20>self.options.width){
                                    l-=tW;
                                }
                                if(t+tH+20>self.options.height){
                                    t-=tH;
                                }
                                $toolTip.css({left:l+"px",top:t+"px"});
                                $toolTip.hover(function(){
                                    clearTimeout(timer);
                                },function(){
                                    timer=setTimeout(function(){
                                        $toolTip.remove();
                                        $toolTip=null;
                                    },500);
                                });
                                $toolTip.find(".showSome").click(function(){
                                    $toolTip.find(".showSome").hide();
                                    $toolTip.find(".all").hide();
                                    $toolTip.find(".showAll").show();
                                });
                                $toolTip.find(".showAll").click(function(){
                                    $toolTip.find(".showAll").hide();
                                    $toolTip.find(".showSome").show();
                                    $toolTip.find(".all").show();
                                    var allHeight=$toolTip.find(".all").height()*$toolTip.find(".all").size();//剩下部分的高度
                                    var t=parseInt($toolTip.css("top"));
                                    var h=$toolTip.height();
                                    if(t+allHeight+h>self.options.height){
                                        var newT=self.options.height-allHeight-h;
                                        newT=newT<20?20:newT;
                                        $toolTip.css({top:newT+"px"});
                                    }
                                });


                            }).mouseout(function(){
                                timer=setTimeout(function(){
                                    $toolTip.remove();
                                    $toolTip=null;
                                },500);

                            });
                        })(arrow,linksTooltip);
                    }
                    arrowSet.push(arrow);
                }
            }
            arrowSet.toBack();
            return arrowSet;
        },
        /**
         * 创建自己链接自己的箭头
         * @param paper
         * @param x
         * @param y
         * @param obj
         * @returns {*}
         * @private
         */
        _createSelfToSelfArrow:function(paper,x,y,obj){
            var set=paper.set();
            var self=this;
            var flag=true;
            var node;
            var label="";
            if(obj.callNodes&&obj.callNodes.length){
                var c=obj.callNodes;
                for(var i=0;i< c.length;i++){
                    if(c[i].nodeId==obj.nodeId){
                        flag=false;
                        node=c[i];
                        break;
                    }
                }
            }
            if(flag){
                return set;
            }
            var metrics=node.metrics;
            if(metrics&&metrics.length>0){
                for(var i=0;i<metrics.length;i++){
                    label+=" "+metrics[i].value+metrics[i].unit;
                }
            }
            var arrowSize=self.arrowSize;
            var scale=self._getScale();
            var rad1=Raphael.rad(105);
            var rad2=Raphael.rad(60);
            var r=(self.apR+5*scale);
            var x1 = x + r * Math.cos(rad1);
            var y1 = y - r * Math.sin(rad1);
            var x2 = x + r * Math.cos(rad2);
            var y2 = y - r * Math.sin(rad2);
            var a45 = Raphael.rad(380-150);//角度转换成弧度
            var a45m = Raphael.rad(380-60);
            var x2a = x2 + Math.cos(a45) * arrowSize;
            var y2a = y2 + Math.sin(a45) * arrowSize;
            var x2b = x2 + Math.cos(a45m) * arrowSize;
            var y2b = y2 + Math.sin(a45m) * arrowSize;//,"Z",x2, y2 "fill":"#8f8f8f"
            var result1 = ["M", x1, y1, "A", 1,1,0,1,1,x2,y2];
            var result2 = ["M", x2, y2, "L", x2b, y2b,"L", x2a, y2a,"Z",x2, y2];
            set.push(paper.path(result1).attr({"stroke-width":1,"stroke":"#8f8f8f"}));
            set.push(paper.path(result2).attr({"fill":"#c9c9c9","stroke-width":1,"stroke":"#c9c9c9"}));
            if(scale>0.8){
                set.push(paper.text((x1+x2)/2,(y1+y2)/2-20*scale,label).attr({"font-size":12*scale+"px"}));
            }
            set.toFront();
            return set;
        },
        /**
         * 创建环形
         * @param paper
         * @param x
         * @param y
         * @param color
         * @param reg
         * @param r
         * @param rWidth
         * @returns {*}
         * @private
         */
        _createCircle:function(paper,x,y,color,reg,r,rWidth){
            paper.customAttributes.arc = function(x,y,value, total, R) {
                var alpha = 360 / total * value,
                    a = (90 - alpha) * Math.PI / 180,
                    path;
                if (total ==-value) {
                    path = [
                        ["M", x, y - R],
                        ["A", R, R, 0, 1, 1, x-0.001,y - R],
                        ["Z"]
                    ];
                } else {
                    var rad1=Raphael.rad((reg/2));
                    var rad2=Raphael.rad(-(reg/2));
                    var x1=x-Math.cos(rad1)*R;
                    var y1=y-Math.sin(rad1)*R;
                    var x2=x-Math.cos(rad2)*R;
                    var y2=y-Math.sin(rad2)*R;
                    path = [
                        ["M", x1, y1],
                        ["A", R, R, 0, +(alpha%360 <= -180), 0, x2, y2]
                    ];
                }
                return {
                    path: path
                };
            };
            return paper.path().attr({
                arc: [x,y,-reg, 360, r],
                'stroke-width': rWidth,
                'stroke': color
            });
        },
        /**
         * 箭头，从应用到组件
         * @param p1
         * @param p2
         * @returns
         * @private
         */
        _getArrowPositionFromAToC:function(p1,p2){
            var self=this;
            var scale=self._getScale();
            var r1=self.apR+5;
            var r2=self.cR;
            var angle = Raphael.angle(p1.x, p1.y, p2.x, p2.y);
            var rad=Raphael.rad(angle);
            var pos1=self._getScaleAfterPosition(p1.x,p1.y);
            var pos2=self._getScaleAfterPosition(p2.x,p2.y);
            var x1=pos1.x-Math.cos(rad)*r1;
            var y1=pos1.y-Math.sin(rad)*r1;
            var x2=pos2.x+Math.cos(rad)*r2;
            var y2=pos2.y+Math.sin(rad)*r2;
            return {x1:x1,y1:y1,x2:x2,y2:y2};
        },
        /**
         * 箭头，从应用到应用
         * @param p1
         * @param p2
         * @returns
         * @private
         */
        _getArrowPositionFromAToA:function(p1,p2){
            var self=this;
            var scale=self._getScale();
            var r=self.apR+5;
            var angle = Raphael.angle(p1.x, p1.y, p2.x, p2.y);
            var rad=Raphael.rad(angle);
            var pos1=self._getScaleAfterPosition(p1.x,p1.y);
            var pos2=self._getScaleAfterPosition(p2.x,p2.y);
            var x1=pos1.x-Math.cos(rad)*r;
            var y1=pos1.y-Math.sin(rad)*r;
            var x2=pos2.x+Math.cos(rad)*r;
            var y2=pos2.y+Math.sin(rad)*r;
            return {x1:x1,y1:y1,x2:x2,y2:y2};
        },
        /**
         *
         * @param paper
         * @param x1
         * @param y1
         * @param x2
         * @param y2
         * @param dashline 是否是虚线箭头
         * @returns {箭头相关信息}
         * @private
         */
        _createArrow:function(paper,x1,y1,x2,y2,dashline){
            var self=this;
            var set=paper.set();
            var line;
            var arrowSize=self.arrowSize;
            var angle = Raphael.angle(x1, y1, x2, y2);//得到两点之间的角度
            var a45 = Raphael.rad(angle - 45);//角度转换成弧度
            var a45m = Raphael.rad(angle + 45);
            var x2a = x2 + Math.cos(a45) * arrowSize;
            var y2a = y2 + Math.sin(a45) * arrowSize;
            var x2b = x2 + Math.cos(a45m) * arrowSize;
            var y2b = y2 + Math.sin(a45m) * arrowSize;
            var result1 = ["M", x1, y1, "L", x2, y2, "M", x2, y2];
            var result2 = ["M", x2, y2, "L", x2b, y2b,"L", x2a, y2a,"Z",x2, y2];
            if(dashline){
                line=paper.path(result1).attr({"fill":"#c9c9c9","stroke-width":self.options.lineWidth,"stroke":"#c9c9c9","stroke-dasharray":"--"});
            }else{
                line=paper.path(result1).attr({"fill":"#c9c9c9","stroke-width":self.options.lineWidth,"stroke":"#c9c9c9"});
            }
            set.push(paper.path(result2).attr({"fill":"#c9c9c9","stroke-width":self.options.lineWidth,"stroke":"#c9c9c9"}));
            set.push(line);
            return set;
        },
        _destroy:function(){
            alert(123);
            var self=this;
            $(self.element).html("");

        }


    });
    function getValue($el,name,defaultValue,type){
        if(!type){
            type = "string";
        }
        var value = $el.attr(name);
        if(!value){
            return defaultValue;
        }else{
            if(type=="string"){
                return value;
            }else if(type=="boolean"){
                if(value=="true"){
                    return true;
                }else{
                    return false;
                }
            }else if(type=="function"){
                if($.isFunction(value)){
                    return value;
                }else{
                    var v;
                    try{
                        v = eval(value)
                    }catch(e){}
                    if($.isFunction(v)){
                        return v;
                    }else{
                        return defaultValue;
                    }
                }
            }else if(type=="object"){
                var v;
                try{
                    v = eval(value)
                }catch(e){}
                if(v){
                    return v;
                }else{
                    return defaultValue;
                }
            }else if(type=="number"){
                var v;
                try{
                    v = parseFloat(value);
                }catch(e){}
                if(v){
                    return v;
                }else{
                    return defaultValue;
                }
            }

        }
        return defaultValue;
    }
})(jQuery);
    return $;
});