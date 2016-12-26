import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Service.extend({
	isExpanded:true,//用于控制菜单最大化,最小化
	toggleExpanded() {
		  this.toggleProperty('isExpanded');
	},
	getIsExpanded(){
		return this.get('isExpanded');
	},
	model(routeName){
		var menu = [{ label: '概览',icon:'tyc-mainmenu-a tyc-mainmenu-overview', action:'overview-application' ,children :[{id: 'overview-application',label: '应用一览',icon:'tyc-sidebar-icon tyc-sidebar-icon-overview'},{id: 'overview-keyaction',label: '关键应用一览',icon:'tyc-sidebar-icon tyc-sidebar-icon-key-overview'}]},
		{ label: '应用',icon:'tyc-mainmenu-a tyc-mainmenu-use',action:'application-overview',children :[{id: 'application-overview',label: '情报汇总',icon:'tyc-sidebar-icon tyc-sidebar-icon-summary'},{id: 'application-view',label: '应用拓扑',icon:'tyc-sidebar-icon tyc-sidebar-icon-topology'}]},
		{ label: '关键应用过程' ,icon:'tyc-mainmenu-a tyc-mainmenu-key-use'},
		{ label: '设置',icon:'tyc-mainmenu-a tyc-mainmenu-setting'}];
		let name=routeName;
		var menu2=null;
		menu.isExpanded=this.get('isExpanded');
		$.each( menu, function(i, item){
			if (item.children!==undefined){
				$.each( item.children, function(j, child){
					 if (child.id==name){
						 child.active=true; 
						 child.activecss="current";
						 item.active=true;
						 item.activecss="current";
						 menu2=item.children;
					 }
				});
			}
		});
		return RSVP.hash({
		  menu: menu,
		  menu2: menu2
		});
	},
});
