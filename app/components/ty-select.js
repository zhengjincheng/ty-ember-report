import Ember from 'ember';

export default Ember.Component.extend({
	didInsertElement(){
		console.log("--ty-select-didInsertElement----");
		
	},didRender(){
	 console.log("--ty-select-didRender----");
	 $("#idChosen").chosen();
	}
});
