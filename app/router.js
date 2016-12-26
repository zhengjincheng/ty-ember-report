import Ember from 'ember';
import config from './config/environment';
const { inject: { service }, Mixin, assert, computed } = Ember;

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
  this.route('contact');
//  this.route('rentals', function() {
//    this.route('show', { path: '/:rental_id' });
//  });
//  this.route('overview',  function() {
//    this.route('applications');
//  });
  //概览-应用一览
  this.route('overview-application',{ path: 'application' });
  //概览-关键应用过程一览
  this.route('overview-keyaction',{ path: 'keyAction' });
  
  //应用-情报汇总
  this.route('application-overview',{ path: 'application/:id/overview' });
  this.route('application-overview',{ path: 'application/overview' });
  
  //应用-应用拓扑
  this.route('application-view',{ path: 'application/:id/view' });
  this.route('application-view',{ path: 'application/view' });
});

export default Router;

