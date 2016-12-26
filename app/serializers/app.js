import DS from 'ember-data';

export default DS.JSONSerializer.extend({
   normalizeFindRecordResponse(store, type, payload) {
	   console.log(type);
    return {
      data: {
        id: application.id,
        type: type.modelName,
		name:application.name
        //attributes: {
        //  name: payload.name,
        //  publicRepos: payload.public_repos
       // }
      }
    }
  },
  extractAttributes (modelClass, resourceHash){
	  var throughput;
	  var responseTimeTotal;
	  var apdex	;		  //Apdex
	  var errorRate;
	  var hasDataInLast24Hour=false;

	  if (typeof resourceHash.application.stat === 'undefined' || !resourceHash.application.stat ){	
		  }else{
			  if (typeof resourceHash.application.stat.throughput === 'undefined'){			 
			  }else{
				  throughput=resourceHash.application.stat.throughput;
				  hasDataInLast24Hour=resourceHash.application.stat.hasDataInLast24Hour;
			   }
			  if (typeof resourceHash.application.stat.responseTimeTotal === 'undefined'){}else{
				  responseTimeTotal=resourceHash.application.stat.responseTimeTotal;
				  apdex=resourceHash.data.apdex.value;
				  errorRate=resourceHash.data.errorPercent.value;
			  }
		  }	
	 return {
          name: resourceHash.application.name,
		  type: 'app',
		  throughput:throughput,
		  responseTimeTotal:responseTimeTotal,
		  apdex:apdex,
		  errorRate:errorRate,
		  hasDataInLast24Hour:hasDataInLast24Hour,
		  dataMini:resourceHash.dataMini,
		  language:resourceHash.application.agentLanguage.language
	 }
  },
  extractId (modelClass, resourceHash) {
	  	   //console.log(modelClass);
	  	   //console.log(resourceHash);
    return resourceHash.application.id;  
  }

});