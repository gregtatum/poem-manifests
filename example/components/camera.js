module.exports = function camera( graph, properties ) {
	
	var position = [
		properties.x || 0,
		properties.y || 0,
		properties.z || 0
	];
	
	return {
		position : position
	}
	
};