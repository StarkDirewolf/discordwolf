module.exports = {
	
	createGame: function (mode) {
		let game;
		
		switch (mode) {
			case "OneNight":
				game = {assignRoles: OneNight.assignRoles,
				checkVictory: OneNight.checkVictory,
				startNight: true};
				break;
		}
		
		return game;
	}
}

const roles = require('./OneNightRoles.js');
const Teams = require('./Teams.js');

const OneNight = {	
	// Takes a players objects and sets them a One Night role each
	assignRoles: function (playersObj) {
		let invalidComp = true;
		let roleList = [];
		let roleQueue = [];
		let playerList = playersObj.allPlayers;
		
		while (invalidComp) {
			invalidComp = false;
			
			playerList.forEach(p => {
			let invalid = true;
			let role;
			
			if (roleQueue.length > 0) {
				role = roleQueue.pop();
				console.log(role.name + " has been added from queue");
			} else {
			
				while (invalid){
					invalid = false;
					role = roles.getRole("random");
					
					console.log(role.name + " randomly generated");
					
					if (role.max >= 1 && roleList.filter(r => r === role).length === role.max) {
						invalid = true;
						console.log("There are too many " + role.name + "s - trying again");
					}
					if (role.max !== 1 && (((roleList.filter(r => r === role).length + 1) / playerList.length) > role.max)) {
						invalid = true;
						console.log("There are too many " + role.name + "s - trying again");
					}
					// Check if minimum number of the role can be added
					if (!invalid && typeof(role.needs) !== "undefined")  {
						if ((playerList.length - roleList.length) >= role.needs) {
							for (i = 1; i < role.needs; i++) {
								roleQueue.push(roles.getRole(role.name));
							}
							console.log("Queued " + (role.needs - 1) + " " + role.name);
						} else {
							invalid = true;
							console.log("There aren't enough spaces left for " + role.name);
						}
					}					
				}
			}
			
			roleList.push(role);
			
			});
			
			if (roleList.filter(p => p.victory !== "village").length === 0) {
				console.log("Invalid team comp - retrying");
				roleList = [];
				invalidComp = true;
			}
		}
		
		shuffleArray(roleList);
		for (let i = 0; i < playerList.length; i++) {
			playerList[i].role = roleList[i];
			console.log(playerList[i].name + " is a " + roleList[i].name);
		}
		
		return roleList.sort((a, b) => a.order > b.order ? 1 : -1);
	},
	
	checkVictory: function (playersObj) {
		playersObj.calculateVictories();
		return true;
	}
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}