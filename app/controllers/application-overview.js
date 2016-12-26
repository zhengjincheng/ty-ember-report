import Ember from 'ember';

export default Ember.Controller.extend({
/*----------common-------------*/
	service: Ember.inject.service('menu-service'),
	isMin:true,
/*----------common-------------*/

		
	

	actions: {
		/*----------common-------------*/
		/*sidebar 最小化，最大化时，回调该方法*/
		onExpanded(){
		   this.set('isMin',this.get('service').getIsExpanded());
		}
		/*----------common-------------*/

	}
});
