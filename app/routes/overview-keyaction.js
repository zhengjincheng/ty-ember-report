import Ember from 'ember';
import LazyRouteMixin from 'ember-cli-lazy-load/mixins/lazy-route';

import AuthenticatedRouteMixin from './authenticated-route-mixin';
export default Ember.Route.extend(LazyRouteMixin,{
	model(){
		//return this.get('store').findAll('rentals');
	},
	 beforeModel: function(transition, queryParams){
      return this._super(transition,queryParams).then(()=>{
        // do the other beforeModel operations
      });
    }
	
});
