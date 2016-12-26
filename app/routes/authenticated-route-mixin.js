import Ember from 'ember';
import RSVP from 'rsvp';
const { inject: { service }, Mixin, assert, computed } = Ember;

const AuthenticatedRouteMixin =  Mixin.create({
	 security: Ember.inject.service('security-manager'),
	 beforeModel:function(transition)  {
		console.log("AuthenticatedRouteMixin beforeModel");
		var _security=this.get('security');
		if (_security.authenticated()){
			return ;
		}
		return  new RSVP.Promise(function(resolve, reject){
			$.ajax({ url: '/report-server/overview/user',  success: function(r){
					console.log(r);
					_security.setCurrentUser(r);
					 resolve("xx");
					//_this.replaceWith('overview-application')
				},error:function(r,err,ex){
					console.log("error" +r);
					console.log("status =" +r.status);
					//跳转至受保护的页面，待验证成功后，重新跳转回来
					window.location.href="/report-server/overview/to"; 
				},
				beforeSend: function(request) {
					 request.setRequestHeader("Access-Control-Allow-Origin", "*");
				}	
		  });
		 });
  }
});

export default AuthenticatedRouteMixin;
 
