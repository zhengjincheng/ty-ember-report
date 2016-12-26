import Ember from 'ember';

export default Ember.Component.extend({
	service: Ember.inject.service('menu-service'),
	isExpanded:false,
	init(){
		this._super(...arguments);
		this.set('isExpanded',this.get('service').getIsExpanded());
	},
	actions: {
		/*显示或者隐藏应用*/
		toggleBody() {
		  this.get('service').toggleExpanded();
		  this.set('isExpanded',this.get('service').getIsExpanded());
		  if  (!(typeof this.get('onExpanded')==='undefined')){
			  		  this.get('onExpanded')();

		  }
		}
	},
	didReceiveAttrs(){
		//console.log("menu "+this.get('service').getIsExpanded())

	},
	willRender(){
		
	}
});
