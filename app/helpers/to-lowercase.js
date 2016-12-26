import Ember from 'ember';

export function toLowercase([value]) {
	var output = value.toLowerCase();
    return output.replace(".", "");
}

export default Ember.Helper.helper(toLowercase);