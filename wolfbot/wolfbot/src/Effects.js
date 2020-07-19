// This file holds all the functions relating to abilities - processing targets as well as effects

//const Players = require('./Players.js');

var parseAction = function (action, string, playersObj) {
	const targets = processTargets(action.player, string, action.action, playersObj);

	if (typeof (targets) !== "undefined") {
		activeAction.action.effect(action.player, targets, playersObj);
		return true;
	}

	return false;
}

var parseVote = function (player, string, playersObj) {
	const action = { player: player, action: voteAction };

	return parseAction(action, string, playersObj);

}

const voteAction = {
	targets: [{ number: 1, filterFunc: target.active }],
	effect: voteEffect
}

const target = {
	inactive = function (stringArray, player, playersObj) {
		let returnPlayerArray;
		stringArray.forEach(str => {
			let target = playersObj.findInactiveRoleFromNumber(w);
			if (typeof (target) !== "undefined") {
				returnPlayerArray.push(target);
			}
		})
		return returnPlayerArray;
	},

	active = function (stringArray, player, playersObj) {
		let returnPlayerArray;
		stringArray.forEach(str => {
			let target = playersObj.findPlayerFromName(w);
			if (typeof (target) !== "undefined") {
				returnPlayerArray.push(target);
			}
		})
		return returnPlayerArray;
	},

	any = function (stringArray, player, playersObj) {
		let returnPlayerArray;
		returnPlayerArray = inactive(stringArray, player, playersObj);
		returnPlayerArray.push(active(stringArray, player, playersObj));
		return returnPlayerArray;
	},

	otherActive = function (stringArray, player, playersObj) {
		let returnPlayerArray;
		returnPlayerArray = active(stringArray, player, playersObj);
		for (var i = returnPlayerArray.length - 1; i > -1; i--) {
			if (returnPlayerArray[i] === player) {
				returnPlayerArray.splice(i, 1);
			}
		}
		return returnPlayerArray;
	}
}

function processTargets(player, string, action, playersObj) {
    console.log("Processing for targets - " + player.name + ": " + string);

	const words = string.split(" ");

	let targetArray = action.targets.filterFunc(words, player, playersObj);

	if (targetArray.length === targets.number) {
		return targetArray;
	}
}

var voteEffect = function (player, targets, playersObj) {
	player.votingFor = targets[0];
}


function roleEffectProcessor(player, targets, effect) {

	switch (effect) {

		case "scry":
			if (areAnySentineled(targets)) break;
			actionEffect(player, targets, "reveal");
			player.actionListener = undefined;
			break;

		case "vote":
			player.dayVote = targets[0];
			console.log(player.name + ": " + "is voting for " + targets[0].name);
			break;

		case "trouble":
			if (areAnySentineled(targets)) break;
			actionEffect(player, targets, "swap2");
			player.actionListener = undefined;
			break;

		case "steal":
			if (areAnySentineled(targets)) break;
			actionEffect(player, [targets[0]], "reveal");
			actionEffect(player, [targets[0], player], "swap2");
			player.actionListener = undefined;
			break;

		case "drunk":
			player.actionListener = undefined;
			if (areAnySentineled(targets)) break;
			actionEffect(player, [targets[0], player], "swap2");
			break;
	}
}

function actionEffect(player, targets, effect) {

	switch (effect) {

		case "reveal":
			targets.forEach(target => {
				let msg = target.name + " is a " + target.role.name;
				console.log(player.name + ": " + msg);
				createNewGameMsg(player, msg);
			});
			break;

		case "swap2":
			let role1 = targets[0].role;
			let role2 = targets[1].role;
			targets[0].role = role2;
			targets[1].role = role1;
			let msg = targets[0].name + " has been swapped with " + targets[1].name + ".";
			console.log(player.name + ": " + msg);
			createNewGameMsg(player, msg);
			break;
	}
}

module.exports = {
	parseAction: parseAction,
	parseVote: parseVote,
	target: target
}