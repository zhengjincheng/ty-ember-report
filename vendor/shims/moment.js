(function() {
  function vendorModule() {
    'use strict';
		function rumOverviewBar(){
			console.log("hello")
		}
    return { 'default': self['moment'] };
  }

  define('moment', [], vendorModule);
})();
