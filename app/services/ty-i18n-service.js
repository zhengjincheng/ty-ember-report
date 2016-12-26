import Ember from 'ember';

export default Ember.Service.extend({
	changeLanguage(localName,successFn,failFn){
		$.ajax({ url: `/report-server/i18n/changeLanguage?language=${localName}&a=6133`,  success: function(r){
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
	}
});
