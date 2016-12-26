import Ember from 'ember';

export default Ember.Component.extend({
	id:'',
	didRender(){
		var s='#pb'+this.get('id');
	},
	didInsertElement(){
		console.log("---didInsertElement----")
		var s='#pb'+this.get('id');
		$(s).removeData("progressbar");

		$(s).rumOverviewBar();
		
		
	}
});
