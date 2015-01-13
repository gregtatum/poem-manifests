var manifests = require('../example/manifests');
var configureLoader = require('../lib');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var globalManifest = require('../example/manifests/global');

describe('poem-manifests', function() {
	
	beforeEach(function() {
		
		var graph = {
			source: "customGraphObject"
		};
		
		this.loader = configureLoader( manifests, {
			getGraph : function() {	return graph; },
			globalManifest : globalManifest
		});
		
		this.graph = graph;
		

	});
	
	describe('public interface', function() {
		
		it('contains an emitter', function() {
			
			var emitter = new EventEmitter();
			
			expect( _.isObject(this.loader.emitter) ).toEqual( true );
			expect( _.isObject(this.loader.emitter.on) ).toEqual( true );
			expect( _.isObject(this.loader.emitter.once) ).toEqual( true );
			expect( _.isObject(this.loader.emitter.emit) ).toEqual( true );
			expect( _.isObject(this.loader.emitter.addListener) ).toEqual( true );
			expect( _.isObject(this.loader.emitter.removeListener) ).toEqual( true );
			
		});
		
		it('can be configured with an emitter', function() {
			
			var emitter = new EventEmitter();
			
			var loader = configureLoader( manifests, {
				emitter : emitter
			});
			
			expect( loader.emitter ).toBe( emitter );
			expect( this.loader.emitter ).not.toBe( emitter );
			
		});
		
		it('contains a load method', function() {
			expect( _.isFunction( this.loader.load ) ).toEqual( true );
		});
		
		it('the load method returns true or false if a level is found or not', function() {
			
			expect( this.loader.load('level1') ).toEqual( true );
			expect( this.loader.load('fakeLevel') ).toEqual( false );
			
		});
	});

	describe("load event", function() {
		
		beforeEach( function( done ) {
			
			this.loader.emitter.on('load', function( e ) {
				
				this.loadedSlug = e.slug;
				this.loadedManifest = e.manifest;
				this.loadedGraph = e.graph;
				this.loadedGlobalManifest = e.globalManifest;
				
				done();
				
			}.bind(this));
			
			this.loader.load( 'level1' );
			
		});
		
		describe("event properties", function() {

			it("provides the manifest", function() {
			
				expect( this.loadedManifest ).toBe( manifests.level1 );
			
			});
		
			it("provides the slug", function() {
			
				expect( this.loadedSlug ).toBe( "level1" );
			
			});
		
			it("provides the graph", function() {
			
				expect( this.loadedGraph ).toBe( this.graph );
			
			});
			
		});
		
		describe("component initiation", function() {
			
			it("correctly processes a function key", function() {
				expect( _.isObject( this.loadedGraph.camera ) ).toEqual( true );
			});
			
			it("passes in the properties on a function key", function() {
				expect( this.loadedGraph.camera.position[0] ).toEqual( 0 );
				expect( this.loadedGraph.camera.position[2] ).toEqual( -50 );
			});
			
			it("correctly processes a construct key", function() {
				expect( _.isObject( this.loadedGraph.background ) ).toEqual( true );
			});

			it("passes in the properties on a construct key", function() {
				expect( this.loadedGraph.background.color ).toEqual( 0xb4da55 );
				expect( this.loadedGraph.background.speed ).toEqual( 1 );
			});
			
			it("correctly processes an object key", function() {
				expect( _.isObject( this.loadedGraph.info ) ).toEqual( true );
			});
			
			it("correctly processes a non-object key", function() {
				expect( _.isString( this.loadedGraph.winMessage ) ).toEqual( true );
			});
			
		});
		
		describe("global manifest initiation", function() {
			
			it("loads the global manifest", function() {
				expect( _.isObject( this.loadedGraph.mouse ) ).toEqual( true );
			});
			
			it("is overshadowed by level manifests", function() {
				expect( this.loadedGraph.overshadow.position[0] ).toEqual( 0 );
				expect( this.loadedGraph.overshadow.position[2] ).toEqual( -50 );
			});
			
		});
		
	});	
	
	describe("unload event", function() {
		
		beforeEach( function( done ) {
			
			this.unloadCount = 0;
			
			this.loader.emitter.on('unload', function( e ) {
				
				this.unloadCount++
				this.unloadedSlug = e.slug;
				this.unloadedManifest = e.manifest;
				this.unloadedGraph = e.graph;
				
				done();
				
			}.bind(this));
			
			this.loader.load( 'level1' );
			this.loader.load( 'level2' );
			
		});
		
		it("provides the manifest", function() {
			
			expect( this.unloadedManifest ).toBe( manifests.level1 );
			
		});
		
		it("provides the slug", function() {
			
			expect( this.unloadedSlug ).toEqual( "level1" );
			
		});
		
		it("only unloads if a level has already been loaded", function() {
			
			expect( this.unloadCount ).toEqual( 1 );
			
		});
	});
	
});