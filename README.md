# poem-manifests

Loads in a manifest that will set all of your visualization's components to a single graph object. This makes it really easy to have multiple levels or scenes and share code between them. It decouples your individual components from the logic of how your visualization loads in and works, greatly increasing the reusability of your implementation code.

## Usage

	var Poem = require('./poem'); //Your graph (or central object) for your visualization
	var manifests = require('./manifests'); //Your manifests object, example below
	
	var loader = require('poem-manifests')( manifests, {
		getGraph : function() {
			return new Poem();
		}
	});
	
	loader.emitter.on("load", function( e ) {
		var poem = e.graph;
		document.title = e.manifest.title;
		poem.start();
	});
	
	loader.load( "intro" );

## The Manifests

The typical folder structure would be something like this:

	./manifests
		./index.js
		./level1.js
		./level2.js
		./level3.js

#### `index.js`

The base manifests object should be composed of key pair values where the key is the slug of your level/scene/view that you want to load in.

	module.exports = {
		level1 : require('./level1'),
		level2 : require('./level2'),
		level3 : require('./level3'),
		level4 : require('./level4')
	};

#### `level1.js`

	module.exports = {
		
		// Custom properties that do not automatically get set to the graph
		title : "Level 1 - My Amazing Visualization",
		menuOrder : 0,
		customConfig : {
			option1 : "value"
		},
		
		// Properties automatically loaded onto the graph
		objects : {
			
			// Pseudo-code: graph.background = suppliedFunction( graph, properties );
			background : {
				function: require("../js/background"),
				properties: {
					color : 0xBADA55
				}
			},
			
			// Pseudo-code: graph.controls = new construct( graph, properties );
			controls : {
				construct: require("../js/components/cameras/Controls"),
				properties: {
					minDistance : 500,
					maxDistance : 1000,
					zoomSpeed : 0.1,
					autoRotate : true,
					autoRotateSpeed : 0.2
				}
			},
			
			// Pseudo-code: graph.controls = object;
			info : {
				object: require("../js/components/Info")
			},
			
			// Pseudo-code: graph.controls = object;
			winMessage : "You win at life."
		}
	};

The loader's "load" event passes the callback the graph object (poem) that behaves something like this from the above example:

	
	poem.background.doSomething();
	poem.controls.doSomething();
	poem.info.doSomething();
	console.log( poem.winMessage );
	

#### An example component

Each component gets passed the graph object and the properties. The component is called at the moment it is loaded.

	function Background( graph, properties ) {
		
		this.config = _.extend({
			parallaxSpeed : 5,
			color : 0xfacade
		}, properties);
		
		this.texture = createTexture( config.color );
		
		graph.emitter.on( 'update', this.update.bind(this) );
		graph.emitter.on( 'unload', this.destroyTexture.bind(this) );
		graph.stage.add( this.texture );
		
	}
	
	Background.prototype { ... }