var Background = function( graph, properties ) {
	
	this.color = properties.color || 0xfacade;
	this.speed = properties.speed || 1;
};

Background.prototype = {
	
	setColor : function( color ) {
		this.color = color;
	}
	
};

module.exports = Background;