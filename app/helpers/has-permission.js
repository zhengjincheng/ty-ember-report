import Ember from 'ember';
export default Ember.Helper.extend({
  service:Ember.inject.service('security-manager'),
  compute(params) {
    let service = this.get('service');
    return service.hasPermission(params[0])
  }
});
