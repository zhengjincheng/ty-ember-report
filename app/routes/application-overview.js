import Ember from 'ember';
import RSVP from 'rsvp';

import AuthenticatedRouteMixin from './authenticated-route-mixin';
import LazyRouteMixin from 'ember-cli-lazy-load/mixins/lazy-route';

export default Ember.Route.extend(LazyRouteMixin,{
	service: Ember.inject.service('menu-service'),
	appService: Ember.inject.service('app-service'),
	i18n: Ember.inject.service(),

	model(){
		 var menu=this.get('service').model(this.routeName);
		 var _this=this;
		 var apps=new RSVP.Promise(function(resolve, reject){
			 _this.get('appService').getAppsDef(resolve, reject);
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
	},
});
