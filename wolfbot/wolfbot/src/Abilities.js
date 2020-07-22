// This file holds all the functions relating to abilities - processing targets as well as Abilities

//const Players = require('./Players.js');

const target = {
	inactive: function (stringArray, player, playersObj) {
		let returnPlayerArray = [];
		stringArray.forEach(str => {
			let target = playersObj.findInactiveRoleFromNumber(str);
			if (typeof (target) !== "undefined" && !returnedPlayerArray.includes(target)) {
				returnPlayerArray.push(target);
			}
		})
		return returnPlayerArray;
	},

	active: function (stringArray, player, playersObj) {
		let returnPlayerArray = [];
		stringArray.forEach(str => {
			let target = playersObj.findPlayerFromName(str);
			if (typeof (target) !== "undefined" && !returnedPlayerArray.includes(target)) {
				returnPlayerArray.push(target);
			}
		})
		return returnPlayerArray;
	},

	any: function (stringArray, player, playersObj) {
		let returnPlayerArray = [];
		returnPlayerArray = inactive(stringArray, player, playersObj);
		returnPlayerArray.push(active(stringArray, player, playersObj));
		return returnPlayerArray;
	},

	otherActive: function (stringArray, player, playersObj) {
		let returnPlayerArray = [];
		returnPlayerArray = active(stringArray, player, playersObj);
		for (var i = returnPlayerArray.length - 1; i > -1; i--) {
			if (returnPlayerArray[i] === player) {
				returnPlayerArray.splice(i, 1);
			}
		}
		return returnPlayerArray;
	}
}

const Effects = {
	vote: function (player, targets) {
		player.votingFor = targets[0];
	},

	swap2: function (player, targets) {
		let role1 = targets[0].role;
		let role2 = targets[1].role;
		targets[0].role = role2;
		targets[1].role = role1;
		let msg = targets[0].name + " has been swapped with " + targets[1].name + ".";
		console.log(player.name + ": " + msg);
		player.sendNewDirectMessage(msg);
	},

	reveal: function (player, targets) {
		targets.forEach(target => {
			let msg = target.name + " is a " + target.role.name;
			console.log(player.name + ": " + msg);
			player.sendNewDirectMessage(msg);
		});
	}
}

var parseAction = function (player, action, string, playersObj) {
	let targets = processTargets(player, string, action, playersObj);

	if (typeof (targets) !== "undefined") {
		action.effect(player, targets);
		return true;
	}

	return false;
}

var parseVote = function (player, string, playersObj) {

	return parseAction(player, voteAction, string, playersObj);

}

const voteAction = {
	targets: [{ number: 1, filterFunc: target.active }],
	effect: Effects.vote
}


function processTargets(player, string, action, playersObj) {
    console.log("Processing for targets - " + player.name + ": " + string);

	const words = string.split(" ");

	let targetArray;

	action.targets.forEach(t => {
		let targetArray2 = t.filterFunc(words, player, playersObj);

		if (typeof(targetArray2) !== 'undefined' && targetArray2.length === t.number) {
			targetArray = targetArray2;
		}
	});

	return targetArray;
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