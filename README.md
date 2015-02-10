# poem-manifests

Loads in a manifest that will set all of your visualization's components to a single graph object. This makes it really easy to have multiple levels or scenes and share code between them. It decouples your individual components from the logic of how your visualization loads in and works, greatly increasing the reusability of your implementation code.

Part of the [programming-poem](https://www.npmjs.com/browse/keyword/programming-poem) module series.

## This module's concepts

#### manifest

An object that contains properties for your visualization, and references to the components.

#### graph

A central scene object that collects all of your components. It gets passed into every component.

#### component

A reusable bit of code like a camera, player, bad guy, background, etc. It gets passed a graph object and properties.

####  properties

General configuration for components. This should be stuff like the position a camera starts, how fast a bad guy moves. What image to use as a texture for a background.

## Example

See the `./example` folder for an example setup.

## Usage

	var Poem = require('./poem'); //Your graph (or central object) for your visualization
	var manifests = require('./manifests'); //Your manifests object, example below
	
	var loader = require('poem-manifests')( manifests, {
		//Configuration
		getGraph : function( manifest, slug ) {
			return new Poem();
		}
	});
	
	loader.emitter.on("load", function( e ) {
		var poem = e.graph;
		document.title = e.manifest.title;
		poem.start();
		
		//All loaded components can be accessed by the graph object
		poem.camera.followPlayer( poem.player );
	});
	
	loader.load( "intro" );

## The Manifests

The typical folder structure would be something like this:

	./manifests
		./index.js
		./level1.js
		./level2.js
		./level3.js

#### `./manifests/index.js`

The base manifests object should be composed of key pair values where the key is the slug of your level/scene/view that you want to load in.

	module.exports = {
		level1 : require('./level1'),
		level2 : require('./level2'),
		level3 : require('./level3'),
		level4 : require('./level4')
	};

#### `./manifests/level1.js`

	module.exports = {
		
		// These properties do not automatically get set onto the graph object.
		// They only stay on the manifest object which gets passed to the "load" event.
		
		title : "Level 1 - My Amazing Visualization",
		menuOrder : 0,
		customConfig : {
			option1 : "value"
		},
		
		// Components are loaded onto the graph object
		
		components : {
			
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

The loader's "load" event passes the handler the graph object (poem). This object behaves something like this given the above example:

	poem.background.doSomething();
	poem.controls.doSomething();
	poem.info.doSomething();
	console.log( poem.winMessage );

## Configuration

	var loader = require('poem-manifests')( manifests, {
		getGraph : function( manifest, slug ) {	return new Poem(); },
		emitter : nodeEmitter,
		globalManifest : require('./globalManifest')
	});


#### `getGraph( manifest, slug )`

A function to generate the central graph object of your level. If not provided, a new blank object is used for your graph. The graph object is shared by all of your components. It typically should always create a new object.

#### `emitter`

A node.js EventEmitter. If one is set, it is used by the loop. Otherwise a new EventEmitter is created. This is useful to create a central emitter that collects common events.

#### `globalManifest`

A manifest that gets loaded for every level. Any properties on an individual level will overshadow ones on the global manifest. It's useful to declaratively configure your visualization. In pseudo-code the graph and manifests are processed like this:

	_.extend( graph, globalManifest, currentManifest );

## An example component

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
	
	Background.prototype = { ... };