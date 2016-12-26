/* jshint node: true */
var bundles=require("./bundles");

module.exports = function(environment) {
  var ENV = {
	bundles:bundles(environment),//lazy-load
    modulePrefix: 'super-rentals',
    environment: environment,
    rootURL: '/report-server/overview/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };
	ENV.i18n = {
	  defaultLocale: 'en'
	};
  if (environment === 'development') {
     ENV.APP.LOG_RESOLVER = false;
    // ENV.APP.LOG_ACTIVE_GENERATION = true; zjc
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
	ENV['ember-cli-mirage'] = {
		enabled: false
	}

  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
