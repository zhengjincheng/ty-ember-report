import Ember from 'ember';

export default Ember.Controller.extend({
	security: Ember.inject.service('security-manager'),
	service: Ember.inject.service('menu-service'),
	appService: Ember.inject.service('app-service'),
	route:'',
	data:{title:"确定要删除吗？",message:"删除xx数据后不能恢复",token:"1001"},

	isExpanded:false,//显示或者隐藏24小时无数据的应用
	isMin:true,
	isDesc:true,//当前排序方式 降序
	curField:'responseTimeTotal',//当前排序字段
	apps:[],//应用列表
	//visible_apps[];
	queryAppname:'',//app 查询条件
	appsum:Ember.computed(function(){
		return this.get('apps').length;
		}
	),
	isInstall:false,//是否在新建页面
	v_apps:Ember.computed('isExpanded','curField','isDesc','queryAppname','apps',function(){		
			var _this=this;
			var ToDoList =Ember.Object.extend({
				
				todosSorting: Ember.computed('curField','isDesc',function(){
					var orderstr='';
					if(_this.get('isDesc')){
						orderstr=_this.get('curField')+':desc';
					}else{
						orderstr=_this.get('curField');
					}
					return [orderstr];
				}),
				sorted: Ember.computed.sort('getHasData', 'todosSorting'),
				getHasData:Ember.computed.filter('todos', function(item, index, array) {
						return item.hasDataInLast24Hour && item.responseTimeTotal;
				}),
				getNoData:Ember.computed.filter('todos', function(item, index, array) {
						return !(item.hasDataInLast24Hour && item.responseTimeTotal) ;
				}),
				getVisible:Ember.computed.filter('getNoData', function(item, index, array) {
						if (_this.get('isExpanded')){
							return true;
						}else{
							return item.hasDataInLast24Hour;
						}
						
				}),
				union:Ember.computed.union('sorted','getVisible'),
				filter:Ember.computed.filter('union', function(chore, index, array) {
					
					if (chore.name.indexOf(_this.get('queryAppname'))>=0 || _this.get('queryAppname')===''){
						return true;
					}
			  })
			});
			var todoList = ToDoList.create({todos:this.get('content').apps});
			
			return todoList.get('filter');
		}),
	
	//计算排序时表头图标的箭头显示，一共三个状态 （不排序1，升序 2，降序3）
	responseTimeTotalstate:Ember.computed('curField', 'isDesc', function() {
			return this.getorderstate('responseTimeTotal')
		}),
	apdexstate:Ember.computed('curField', 'isDesc', function() {
			return this.getorderstate('apdex')
		}),
	errorRatestate:Ember.computed('curField', 'isDesc', function() {
			return this.getorderstate('errorRate')
		}),
	throughputstate:Ember.computed('curField', 'isDesc', function() {
			return this.getorderstate('throughput')
		}),
	getorderstate(field){ 
		if (this.get('curField')!=field){return 1}
		if (this.get('isDesc')==true)
			{return 3}
		else
			{return 2}
	},
	init(){
		this._super(...arguments);
		this.set('isMin',this.get('service').getIsExpanded());
	},
	actions: {
		installNew(){
			this.set('isInstall',true);
		},
		onBack(){
			this.set('isInstall',false);
		},
		/*显示或者隐藏无数据的应用*/
		toggleBody() {
		  this.toggleProperty('isExpanded');
		},
		/*sidebar 最小化，最大化时，回调该方法*/
		onExpanded(){
		   this.set('isMin',this.get('service').getIsExpanded());
		},
		toggleApp(item) {
		  if (item['isExpanded']==true){
			  Ember.set(item,'isExpanded',false);

			  $('#holderMore'+item.id).children().remove();
			  $('#holderMore'+item.id).removeData("progressbar");
		  }else{
			  Ember.set(item,'isExpanded',true);
			   $('#holderMore'+item.id).rumOverviewBar();

		  }
		  return false;
		},
		/*根据字段排序*/
		orderby(field){
			this.set('curField',field);
		    this.toggleProperty('isDesc');
			
		},
		/*根据名字过滤app列表*/
		filterbyName(){
			
		},
		//0 禁用,1启用,-1 删除
		modifyApplication(app,status){
			Ember.set(app,'token',status);
			var message='';
			if (status==0){
				message=`禁用${app.name}应用后，部署在该应用上的探针，将停止采集数据；但您仍可以查看历史数据`;
			}else if (status==1){
				message=`激活${app.name}应用的探针大概需要30分钟左右，激活成功后，您可以在报表中查看该应用的数据。`;
			}else if (status ==-1){
				message=`删除${app.name}动作不可逆，将删除该应用所有的历史数据和各种相关数据.您确认删除该应用吗?`;
			}
			this.set('data',{title:"提示",message:message,token:app});
			this.toggleProperty('isShowingModal');

		},
		
		onCancle(item){
			console.log(`onCancle ${item}`)
			this.toggleProperty('isShowingModal');
		},
		onOK(item){
			console.log(`onOK ${item}`)
			this.toggleProperty('isShowingModal');
			var status=item['token'];
			var _this=this.get('route');
			this.get('appService').modifyApplication(item.id,status,function(r){
				_this.refresh();
			},null);
			
		}
	}		
	
  
});
