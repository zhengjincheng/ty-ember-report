import Ember from 'ember';

export default Ember.Component.extend({
	 isWide: true,
	 actions: {
		toggleImageSize() {
			this.toggleProperty('isWide');
		}
	}
	
});
