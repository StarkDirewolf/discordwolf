// This file holds all the functions relating to abilities - processing targets as well as effects

const Players = require('./Players.js');

function processTargets(player, msg) {
    console.log("Processing for targets - " + player.name + ": " + msg.content);

	const words = msg.content.split(" ");

	let others = [], inactive = [], active = [], any = [];

	words.forEach(w => {
		let target = Players.findPlayerFromName(w);
		let inactiveTarget = Players.findInactiveRoleFromNumber(w);

		if (typeof(target) !== "undefined") {
			console.log(w + " is a player name");
			any.push(target);
			active.push(target);
			if (Players.findPlayerFromName(msg.author.username) !== target) {
				others.push(target);
			}
		}

		else if (typeof(inactiveTarget) !== "undefined") {
			console.log(w + " is an inactive role");
			any.push(inactiveTarget);
			inactive.push(inactiveTarget);
		}
	});

	player.actionListener.targets.forEach(t => {

		if (stopChecking) return;

		console.log("Checking for " + t.number + " " + t.type + " targets");

		switch (t.type) {

			case "inactive":
				if (inactive.length === t.number) {
					return inactive;
				}
				break;

			case "active":
				if (active.length === t.number) {
					return active;
				}
				break;

			case "any":
				if (any.length === t.number) {
					return any;
				}
				break;

			case "others":
				if (others.length === t.number) {
					return others;
				}
				break;
		}
	});
}