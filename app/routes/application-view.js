import Ember from 'ember';
import RSVP from 'rsvp';

import AuthenticatedRouteMixin from './authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin,{
	
	service: Ember.inject.service('menu-service'),
	model(){
		var menu=this.get('service').model(this.routeName);
		return menu;
	}
});
