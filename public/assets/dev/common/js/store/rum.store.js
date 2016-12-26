define(function(require, exports,modules){
	require("./store.js");
	(function(win){
		$.extend(store,{
			setFunction:function(key,fn,params){
				var  o      =  {};
					 o._fn  = fn.toString();
				if($.isArray(params)){
					 o.params = params;
				}else{
					o.params =[];
				}
				this.set(key,o);
			},
			call:function(key,remove){
				var  o 		= this.get(key);
				if(!o){
					return;
				}
				if(typeof remove == "undefined"){
					remove = true; 
				}
				try{
					  o.fn = new Function("return "+o._fn)();  
					  o.fn.apply(win,o.params);
				}catch(e){
						alert(e); 
				}
				if(remove){
					this.remove(key);
				}	  
			}
		});
	})(window);
	return $;
});