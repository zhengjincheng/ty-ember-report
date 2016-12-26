import Ember from 'ember';

export function indexValue(params/*, hash*/) {
	var arg_len = params.length;
	if (arg_len<2){
		throw new Error('参数必须大于等于2' );
	}
	if (Ember.isEmpty(params[0])){
		throw new Error("第一参数不能为空，应为整数");
	}
	if (params[0]>(arg_len-1)){
		throw new Error("index 参数值超过取值范围");
	}
	var index=params[0];
	return params[index];
}

export default Ember.Helper.helper(indexValue);
