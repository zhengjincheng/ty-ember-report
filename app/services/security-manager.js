import Ember from 'ember';
import RSVP from 'rsvp';

/*
{
  "id" : 1759,
  "roles" : [ "manager" ],
  "name" : "sina",
  "permissions" : [ "idaas:idaas-me-app-network-error-disperse", "charts|mobile-application-crash-report-os-version-count"],
  "code" : "sina"
}
*/
export default Ember.Service.extend({
	
	user:'',
	init() {
		this._super(...arguments);
		var  _this=this;
		},
	setCurrentUser(user){
		this.set('user',user);
	},
	authenticated(){
		return !Ember.isEmpty(this.get('user'));
	},
	hasPermission(name){//123
	if (typeof this.get('user').permissions ==="undefined"){
			return false;
	 }
		var result=false;
		/*for (var child of this.get('user').permissions) {   
			if (child===name){
				result=true;
				break ;
			}  
		}	 
*/
		$.each( this.get('user').permissions, function(j, child){
			if (child===name){
				result=true;
				return false ;
			}
		});
		
		return result;
	},
	lacksPermission(name){
		//todo
		return true
	}
	
});
