import Ember from 'ember';

export default Ember.Service.extend({
	
	modifyApplication(appId,status,successFn,failFn){
		$.ajax({ url: `/report-server/overview/modifyApplication/${appId}?status=${status}`,  success: function(r){
					console.log(r);
					if (!(typeof successFn==='undefined')){
						successFn(r)
					}
					},error:function(r,err,ex){
						if(! (typeof successFn==='undefined')){
						failFn(r,err,ex)
						}
					}	
		  });
	},
	getAppsDef(resolve, reject){
		return this.getApps(resolve,reject);
	},
		//获取后台数据
	getApps(resolve, reject){
		var _this=this;
		$.ajax({ url: '/report-server/overview/newAppListPage2',  success: function(r){
					console.log(r);
					var list=[];
					$.each( r, function(i, item){
						list.push(_this.extractAttributes(item))//zzz
					})
					resolve(list);
					},error:function(r,err,ex){
					console.log("error")
					}	,
					beforeSend: function(request) {
					 request.setRequestHeader("Access-Control-Allow-Origin", "*");
					 request.setRequestHeader("Accept", "*/*");

					}	
		  });
	},
	extractAttributes (item){
	  var throughput=0;
	  var responseTimeTotal;
	  var apdex=0	;		  //Apdex
	  var errorRate=0;
	  var hasDataInLast24Hour=false;

	  if (typeof item.application.stat === 'undefined' || !item.application.stat ){	
		  }else{
			  if (typeof item.application.stat.throughput === 'undefined'){			 
			  }else{
				  throughput=item.application.stat.throughput;
				  
				  if (item.application.stat.hasDataInLast24Hour=== 'undefined'){
				  }else{ hasDataInLast24Hour=true;};
			   }
			  if (typeof item.application.stat.responseTimeTotal === 'undefined'){}else{
				  responseTimeTotal=item.application.stat.responseTimeTotal;
				  apdex=item.data.apdex.value;
				  errorRate=item.data.errorPercent.value;
			  }
		  }	
	 return {
		  id:item.application.id,
          name: item.application.name,
		  //type: 'app',
		  throughput:throughput,
		  responseTimeTotal:responseTimeTotal,
		  apdex:apdex,
		  errorRate:errorRate,
		  hasDataInLast24Hour:hasDataInLast24Hour,
		  dataMini:item.dataMini,
		  language:item.application.agentLanguage.language,
		  status:item.application.status
	 }
  }
});
