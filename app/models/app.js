import DS from 'ember-data';

export default DS.Model.extend({
	  //id: DS.attr(),
	  type: DS.attr(),
	  name: DS.attr(),
	  throughput:DS.attr(),//吞吐率
      responseTimeTotal:DS.attr('number') ,                   //响应时间
	  apdex:DS.attr(),			  //Apdex
	  errorRate:DS.attr(),			  //错误率
	  dataStatus:DS.attr(),
	  hasDataInLast24Hour:DS.attr('boolean'),//zjc
	  dataMini:DS.attr(),
	  language:DS.attr() //语
	  
	
});
