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

const Game = require('./index.js');
const players = Game.players;
const graveyard = Game.graveyard;

function WerewolfTeam() {
	
	// Checks if the werewolf team has won
	const hasWon_ON = function () {
		const wolfNum = players.filter(p => p.role.victory === "wolf" && p.role.name !== "Minion").length;
		const deadMinionNum = graveyard.filter(p => p.role.name === "Minion").length;
		const deadWolfNum = graveyard.filter(p => p.role.victory === "wolf" && p.role.name !== "Minion").length;
		const isThereLoneMinion = players.concat(graveyard).some(p => p.role.name === "Minion") && (wolfNum + deadWolfNum) === 0;
		
		// If there is a dead tanner, wolves lose
		if (graveyard.some(p => p.role.victory === "tanner")) return false;
		
		// If there is a wolf in the game and no dead wolf, wolves win
		if (deadWolfNum === 0 && wolfNum > 0) return true;
		
		// If there is a minion and no wolves, they only win if they get somebody killed
		if (isThereLoneMinion && (graveyard.length > deadMinionNum)) return true;
		
		return false;
	}
	
	return new Team("Werewolf", 0xf000ff, hasWon_ON);
}

function Team (teamName, colour, ONVictory) {
	this.name = teamName;
	this.colour = colour;
	this.hasWon_ON = ONVictory;
}