import Ember from 'ember';

export default Ember.Component.extend({
	id:'',
	didRender(){
		var s='#pb'+this.get('id');
		console.log("---didRender---- "+s)
	},
	didReceiveAttrs(){
		console.log("---didReceiveAttrs----");
	},
	didInsertElement(){
		console.log("---didInsertElement----")

		
	},
	didUpdateAttrs(){
		console.log("---didUpdateAttrs----")
	},
	willUpdate(){
		console.log("---willUpdate----")
	},
	willRender(){
		console.log("---willRender----")
	},
	didUpdate(){
		console.log("---didUpdate----")
	},
	willDestroyElement(){
		console.log("---willDestroyElement----")
	},
	willClearRender(){
		console.log("---willClearRender----")
	},
	didDestroyElement(){
		console.log("---didDestroyElement----")
	}
	
	
});
