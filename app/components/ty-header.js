import Ember from 'ember';
//import { raw as icAjaxRaw } from 'ic-ajax';
export default Ember.Component.extend({
	service: Ember.inject.service('-routing'),
	tyi18n: Ember.inject.service('ty-i18n-service'),
	i18n: Ember.inject.service(),
	isEnglish:Ember.computed('i18n.locale',function(){
		return this.get('i18n.locale')==='en';
	}),
	actions: {
		handletracnsition(routeName){
			this.get('service').transitionTo(routeName);
		},
		setlocal(){
			var local="";
			if ( this.get('i18n.locale')==='en'){
				this.set('i18n.locale', "zh-cn");
				local='cn'
			}else{
				local='en';
				this.set('i18n.locale', local);
			}
			var _this=this;
			this.get('tyi18n').changeLanguage(local,function(){
				//_this.get('service').get('router').refresh();
				
				//_this.get('service').transitionTo("application-overview");
			});
		}
	},
	didRender(){
		//$(".example").rumOverviewBar();

	}
});
