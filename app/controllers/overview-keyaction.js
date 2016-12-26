import Ember from 'ember';

export default Ember.Controller.extend({
  data:{title:"确定要删除吗？",message:"删除xx数据后不能恢复",token:"1001"},
  isShowingModal: false,
  color:'red',
  actions: {
    toggleModal() {
      this.toggleProperty('isShowingModal');
    },
	onCancle(item){
		console.log(`onCancle ${item}`)
		this.toggleProperty('isShowingModal');
	},
	onOK(item){
		console.log(`onOK ${item}`)
		this.toggleProperty('isShowingModal');
	}
  }
});
