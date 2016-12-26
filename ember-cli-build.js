/*jshint node:true*/
/* global require, module */
//var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var EmberApp = require("ember-cli-lazy-load/ember-app");
var bundles = require("./config/bundles")();

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
	  bundles: bundles

	
  });
//app.import('bower_components/d3/d3.js');
//app.import('bower_components/ic-ajax/dist/named-amd/main.js', {
//  exports: {
//    'ic-ajax': [
//      'default',
//      'defineFixture',
//      'lookupFixture',
//      'raw',
//      'request'
//    ]
//  }
//});
app.import('bower_components/raphael/raphael.js');
app.import('bower_components/jwplayer/jwplayer.js');
app.import('bower_components/jwplayer/jwplayer.html5.js');
app.import('bower_components/chosen/chosen.jquery.js');
//app.import('bower_components/highcharts/js/highcharts.src.js');
app.import('bower_components/highcharts/highcharts.js');
app.import('vendor/shims/moment.js');
app.import('vendor/utils/progressBar.js');
app.import('vendor/utils/jquery.TyChoiceDatePicker.js');
app.import('vendor/utils/jquery.rumchart.js');




  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
