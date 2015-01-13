module.exports = {
	
	components : {
		
		overshadow : {
			function : require('../components/camera'),
			properties : {
				z: -10
			}
		},
		
		mouse : {
			construct : require('../components/mouse'),
			properties : {
				speed: 5
			}
		},
		
		winMessage : "You've won."
		
	}
	
}