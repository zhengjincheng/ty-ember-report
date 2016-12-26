import Ember from 'ember';
import RSVP from 'rsvp';
import dateUtil from '../utils/date-util';
import AuthenticatedRouteMixin from './authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin,{
	service: Ember.inject.service('menu-service'),
	appService: Ember.inject.service('app-service'),

	model(){
		 var menu=this.get('service').model(this.routeName);
		 var _this=this;
		 var apps=new RSVP.Promise(function(resolve, reject){
			 _this.get('appService').getApps(resolve, reject);
		 });
		 return RSVP.hash({
				menu: menu,
				apps:apps
			});
	},
	setupController: function(controller, model) {
		this._super(controller, model);
		controller.set('apps', model.apps);
		controller.set('isMin', model.menu.menu.isExpanded);
		controller.set('route', this);
		controller.set('isExpanded', false);
		controller.set('isInstall',false);
	},
	
	beforeModel(){
		this._super(...arguments);
	},
	
	afterModel(){
		console.log("dateUtil"+dateUtil());
	},
	actions:{
	  
		
	}
	
});
