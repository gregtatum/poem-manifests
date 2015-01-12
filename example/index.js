var manifests = require('./manifests'); //Your manifests object

var loader = require('../lib')( manifests, {
	getGraph : function() {
		return {
			source: "customGraphObject"
		};
	}
});

loader.emitter.on("load", function( e ) {
	console.log('EMITTER: loading level')
	console.log(e);
});

loader.emitter.on("unload", function( e ) {
	console.log('EMITTER: unloading level')
});

loader.load( "level1" );