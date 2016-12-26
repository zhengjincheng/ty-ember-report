import Ember from 'ember';

export function ifTrue(params/*, hash*/) {
	var exps = [];
	var arg_len = params.length;
	if (arg_len<3){
		throw new Error('参数必须大于等于3' );
	}
		var len = arg_len-2;
		for(var j = 0;j<len;j++){
			exps.push(params[j]);
		}
		try{
			var str=exps.join(' ');
			var result = eval(str);
		}catch(e){
			console.log(str,'--Handlerbars Helper "ex" deal with wrong expression!');
		}
		if (result) {
			if (params[arg_len-2]==='true' ){
				return true;
			}
			if (params[arg_len-2]==='false' ){
				return false;
			}
			return params[arg_len-2];
		}else {
			if (params[arg_len-1]==='true' ){
				return true;
			}
			if (params[arg_len-1]==='false' ){
				return false;
			}
			return params[arg_len-1];
	}
}
/*
	let [arg1,r1,r2] = params;
	if (typeof arg1 === 'undefined' ||arg1==null ||arg1==false){
		return r2;//zjc
	}else{
		return r1;
	}
	
  return params;
}
*/

export default Ember.Helper.helper(ifTrue);
