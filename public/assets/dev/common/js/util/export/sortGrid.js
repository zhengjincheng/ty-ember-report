define(function(require, exports,module){
	ty.sortGrid=function(data,sortInt){
		var sortFieldList = [];
		$.extend(true,sortFieldList,ORDER_FIELD);
		var desc = ((sortInt & 32)>0)?1:-1;
		var fieldIndex = (sortInt % 32)-1;
		var field = sortFieldList.splice(fieldIndex,1);
		sortFieldList.unshift(field);
		
		data.sort(function(a,b){
			var o1 = a.bean;
			var o2 = b.bean;
			
			for(var i=0;i<sortFieldList.length;i++){
				var field = sortFieldList[i];
				var n1 = 0,n2 =0;
				n1 = o1[field];
				n2 = o2[field];
				
				if(i==0){
					if(n1>n2){
						return -desc;
					}else if(n1<n2){
						return desc;
					}
				}else{
					if(n1>n2){
						return -1;
					}else if(n1<n2){
						return 1;
					}
				}
				
			}
			return 0;
		});
		
	}
	return $;
});
