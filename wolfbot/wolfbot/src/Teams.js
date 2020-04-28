module.exports = {
	
	werewolf: werewolfObj,
	villager: villagerObj,
	tanner: tannerObj,
	calculateVictories: calculateVictories()
}

const Game = require('./index.js');
const players = Game.players;
const graveyard = Game.graveyard;

const werewolfObj = WerewolfTeam();
const villagerObj = VillagerTeam();
const tannerObj = TannerTeam();

function calculateVictories() {

	// Calculates all the needed data to work out all the victories
	const data = {
		wolfNum: players.filter(p => p.role.victory === "wolf" && p.role.name !== "Minion").length,
		deadMinionNum: graveyard.filter(p => p.role.name === "Minion").length,
		deadWolfNum: graveyard.filter(p => p.role.victory === "wolf" && p.role.name !== "Minion").length,
		isThereLoneMinion: players.concat(graveyard).some(p => p.role.name === "Minion") && (wolfNum + deadWolfNum) === 0,
		isThereDeadTanner: graveyard.some(p => p.role.victory === "tanner")
	}

	werewolf.calculateWin_ON(data);
	villager.calculateWin_ON(data);
	tanner.calculateWin_ON(data);

}


function Team(teamName, colour, ONVictory) {
	this.name = teamName;
	this.colour = colour;
	this.calculateWin_ON = ONVictory;

	// After calculating victories, this will be a boolean for if the team has won or not
	this.hasWon_ON = undefined;
}

//=============================================================================================================

function WerewolfTeam() {
	
	// Checks if the werewolf team has won in One Night
	const calculateWin_ON = function (data) {
		
		// If there is a dead tanner, wolves lose
		if (data.isThereDeadTanner) this.hasWon_ON = false;
		
		// If there is a wolf in the game and no dead wolf, wolves win
		if (data.deadWolfNum === 0 && data.wolfNum > 0) this.hasWon_ON = true;
		
		// If there is a minion and no wolves, they only win if they get somebody killed
		if (data.isThereLoneMinion && (graveyard.length > data.deadMinionNum)) this.hasWon_ON = true;
		
		this.hasWon_ON = false;
	}
	
	return new Team("Werewolf", 0xf000ff, hasWon_ON, calculateWin_ON);
}

function VillagerTeam() {

	// Checks if the villager team has won in One Night
	const calculateWin_ON = function (data) {

		// If a wolf has died
		if (data.deadWolfNum > 0) this.hasWon_ON = true;

		// If nobody has died and there are no wolves
		if (graveyard.length === 0 && data.wolfNum === 0) this.hasWon_ON = true;

		// If there is a lone minion, village only win if they kill nobody except potentially the minion
		if (data.isThereLoneMinion && graveyard.length === data.deadMinionNum) this.hasWon_ON = true;

		this.hasWon_ON = false;
	}

	return new Team("Villager", 0x008000, hasWon_ON, calculateWin_ON); 
}

function TannerTeam() {

	// Checks if the tanner team has won in One Night
	const calculateWin_ON = function (data) {

		if (data.isThereDeadTanner) this.hasWon_ON = true;

		this.hasWon_ON = false;
	}

	return new Team("Tanner", 0xffe700, calculateWin_ON); 

}