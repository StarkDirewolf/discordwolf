module.exports = {
	
	createGame: function (mode) {
		let game;
		
		switch (mode) {
			case "OneNight":
				game = {assignRoles: OneNight.assignRoles,
				//killResult: OneNight.killResult,
				checkVictory: OneNight.checkVictory,
				startNight: true};
				break;
		}
		
		return game;
	}
}

const roles = require('./OneNightRoles.js');

const OneNight = {	
	// Takes an array of players and sets them a One Night role each
	assignRoles: function (playerList) {
		let invalidComp = true;
		let roleList = [];
		let roleQueue = [];
		
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
					role = roles.createRole("random");
					
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
								roleQueue.push(roles.createRole(role.name));
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
			playerList[i].originalRole = roleList[i];
			console.log(playerList[i].name + " is a " + roleList[i].name);
		}
		
		return roleList.sort((a, b) => a.order > b.order ? 1 : -1);
	},
	
	/* killResult: function (killList) {
		let wolves = 0, villagers = 0;
		killList.forEach(p => {
			if (p.role.victory === "village") villagers += 1;
			else if (p.role.victory === "wolf") wolves += 1;
		});
		return {type: "ONend", data: {deadWolves: wolves, deadVillagers: villagers}};
	}, */
	
	checkVictory: function (players, graveyard) {
		console.log(players);
		let wolfNum = players.filter(p => p.role.victory === "wolf" && p.role.name !== "Minion").length;
		let deadMinionNum = graveyard.filter(p => p.role.name === "Minion").length;
		let deadWolfNum = graveyard.filter(p => p.role.victory === "wolf" && p.role.name !== "Minion").length;
		let isThereLoneMinion = players.concat(graveyard).some(p => p.role.name === "Minion") && (wolfNum + deadWolfNum) === 0;
		let winningTeams = [];
		
		if (deadWolfNum > 0
		|| (graveyard.length === 0 && wolfNum === 0)
		|| (isThereLoneMinion && graveyard.length === deadMinionNum)) {
			winningTeams.push("village");
		}
		
		if (graveyard.some(p => p.role.victory === "tanner")) {
			winningTeams.push("tanner");
		}
		
		if (((deadWolfNum === 0 && wolfNum > 0)
			|| (isThereLoneMinion && (graveyard.length > deadMinionNum)))
			&& !winningTeams.some(team => team === "tanner")) {
			winningTeams.push("wolf");
		}
		
		return winningTeams;
	}
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}