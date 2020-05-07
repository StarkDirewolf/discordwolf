/* This file mostly contains Team data:
 * Name = Team name
 * Colour = Team colour to show by role cards
 * hasWon = boolean as to whether the team has won or not
 * CalculateWin_ON = logic for setting hasWon
 * 
 * There is also a that checks if each team has won and gives them the appropriate hasWon values
 */


var vicFunc = function (players, graveyard) {

	// Calculates all the needed data to work out all the victories
	const data = {
		wolfNum: players.filter(p => p.role.team === WerewolfTeam && p.role.name !== "Minion").length,
		deadMinionNum: graveyard.filter(p => p.role.name === "Minion").length,
		deadWolfNum: graveyard.filter(p => p.role.team === WerewolfTeam && p.role.name !== "Minion").length,
		isThereMinion: players.concat(graveyard).some(p => p.role.name === "Minion"),
		isThereLoneMinion: function () { return this.isThereMinion && ((this.wolfNum + this.deadWolfNum) === 0) },
		isThereDeadTanner: graveyard.some(p => p.role.team === TannerTeam),
		graveyardSize: graveyard.length
	}

	WerewolfTeam.calculateWin_ON(data);
	VillagerTeam.calculateWin_ON(data);
	TannerTeam.calculateWin_ON(data);

};

//function Team(teamName, colour, ONVictory) {
//	this.name = teamName;
//	this.colour = colour;
//	this.calculateWin_ON = ONVictory;

//	// After calculating victories, this will be a boolean for if the team has won or not
//	this.hasWon = undefined;
//}

//=============================================================================================================

var WerewolfTeam = {

	name: "Werewolf",
	colour: 0xf000ff,

	// Checks if the werewolf team has won in One Night
	calculateWin_ON: function (data) {

		// If there is a dead tanner, wolves lose
		if (data.isThereDeadTanner) this.hasWon = false;

		// If there is a wolf in the game and no dead wolf, wolves win
		else if (data.deadWolfNum === 0 && data.wolfNum > 0) this.hasWon = true;

		// If there is a minion and no wolves, they only win if they get somebody killed
		else if (data.isThereLoneMinion() && (data.graveyardSize > data.deadMinionNum)) this.hasWon = true;

		else this.hasWon = false;
	}

};

var VillagerTeam = {

	name: "Villager",
	colour: 0x008000,

	// Checks if the villager team has won in One Night
	calculateWin_ON: function (data) {

		// If a wolf has died
		if (data.deadWolfNum > 0) this.hasWon = true;

		// If nobody has died and there are no wolves
		else if (data.graveyardSize === 0 && data.wolfNum === 0) this.hasWon = true;

		// If there is a lone minion, village only win if they kill nobody except potentially the minion
		else if (data.isThereLoneMinion() && data.graveyardSize === data.deadMinionNum) this.hasWon = true;

		else this.hasWon = false;
	}

};

var TannerTeam = {

	name: "Tanner",
	colour: 0xffe700,

	// Checks if the tanner team has won in One Night
	calculateWin_ON: function (data) {

		if (data.isThereDeadTanner) this.hasWon = true;

		else this.hasWon = false;
	}
};

module.exports = {

	werewolf: WerewolfTeam,
	villager: VillagerTeam,
	tanner: TannerTeam,

	// Needs to be called before checking if teams have won. Pass alive players and dead players as two arrays
	calculateVictories: vicFunc
};