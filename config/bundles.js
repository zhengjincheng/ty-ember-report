/* jshint node: true */

/**
 * Configuration for bundles
 * @returns {*}
 */
module.exports = function(environment) {

    return {
        index: {
            //Minisearch file patterns for the content of the bundle
            files: [
			
                "**/templates/application-overview.js",


            ],
        
             //The name of the routes if you are using the lazy-route mixin, no minisearch expressions are allowed here.
            routes: ["application-overview"]
        }
        //about: {
        //    files: [
        //        "**/templates/about.js",
        //        "**/controllers/about.js",
        //        "**/components/my-cat/**.js"
        //    ],
        //     //The dependencies for this bundle. They will loaded in the same batch as the actual bundle
        //    dependencies: ["index"],
        //    routes: ["about", "more routes for this bundle "]
        //}
    }

};
