module.exports = {
	
	title: "Level 1 - Adventures in the Unknown",
	
	components : {
		
		camera : {
			function : require('../components/camera'),
			properties : {
				z: -50
			}
		},
		
		background : {
			construct : require('../components/background'),
			properties : {
				color: 0xb4da55
			}
		},
		
		info : {
			object : require('../components/info')
		},
		
		overshadow : {
			function : require('../components/camera'),
			properties : {
				z: -50
			}
		},
		
		winMessage : "You win at life."
		
	}
	
}