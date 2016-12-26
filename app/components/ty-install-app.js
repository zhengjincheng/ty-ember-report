import Ember from 'ember';

export default Ember.Component.extend({
	currStep:'step1',
	isStepOne:Ember.computed('currStep',function(){
			return (this.get('currStep')==='step1');
	}),
	isStepTow:Ember.computed('currStep',function(){
			return (this.get('currStep')==='step2');
	}),
	isStepThree:Ember.computed('currStep',function(){
			return (this.get('currStep')==='step3');
	}),
	actions:{
		setStep(step){
			this.set('currStep',step);
		},
		back(){
			if (!(this.get('onback')==="undefined")){
				this.get('onback')();
				this.set('currStep','step1');
			}
		}
		
	},
	didInsertElement(){
		this.$().css("position","absolute");
		this.$().css("left","1300px");
		this.$().animate({left: '0px'}, 400);
		var jplayer = jwplayer("install_video").setup({
				    file: "http://7xnonp.media1.z0.glb.clouddn.com/8Server%20Java%20Agent%20Linux%20auto.mp4",
				    image: "${ctx}/assets/images/floatright_img01.png",
				    autostart: "false",
				    bufferlength: '20',
				   	width: 266,//视频宽
				    height: 150,//视频高
					aspectratio:"16:9",
					events:{
						onPlay: function () {_hmt.push(['_trackEvent', "听云Server-安装引导页-视频", "播放"]);},
						onPause: function () { _hmt.push(['_trackEvent', "听云Server-安装引导页-视频", "暂停"]);},
						onComplete: function () { _hmt.push(['_trackEvent', "听云Server-安装引导页-视频", "播放完毕"]);},
					}
				});
		
		
	  },
	didRender() {
		//console.log("---this.$().fadeIn(slow)----")
	}
	 
});
