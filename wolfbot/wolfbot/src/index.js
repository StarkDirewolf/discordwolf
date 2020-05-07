const eris = require('eris');
const { BOT_OWNER_ID, BOT_TOKEN, LOG_CHANNEL_ID, PREFIX, BOT_ID } = require('../config.json');

const bot = new eris.CommandClient(BOT_TOKEN, {}, {
	prefix: PREFIX,
	description: "A wolfy Discord bot",
	owner: "Robb"
});

const INVITE_DUR = 10000;


var chan, startMsg;
var gameStarted = false, inviteOpen = false;
const GameFactory = require('./Games.js');


// Add the start command for players to start the game open invite
bot.registerCommand("start", (msg) => {
	if (inviteOpen || gameStarted) return;
	players = [];
	inactiveRoles = [{name: "1"}, {name: "2"}, {name: "3"}];
	graveyard = [];
	
	// Adjust this if putting in other game modes
	game = GameFactory.createGame("OneNight");
	console.log("One Night selected");
	
	console.log("Open invite started");
	
	chan = msg.channel;
	
	startMsg = bot.createMessage(chan.id, {
		embed: {
		title: "One Night Werewolf",
		description: "Who wants to play?",
		author: {
			name: msg.author.username, 
			icon_url: msg.author.avatarURL
		},
		color: 0x008000, // Color, either in hex (show), or a base-10 integer,
		}
	});	

	// Add reaction buttons for users to click
	startMsg.then(s => s.addReaction("🐺")
		.catch((err) => {console.log(err)})); 
	
	startMsg.then(s => s.addReaction("▶️")
		.catch((err) => {console.log(err)}));
	
	startMsg.then(s => s.addReaction("⏹️")
		.catch((err) => {console.log(err)}));
		
	setTimeout(() => {inviteTimer(10)},
		inviteDur - 10000);
});

// Function that is repeatedly called to show timer
function inviteTimer(time) {
	
	let inviteTimerReact;
	
	switch(time) {
		
		case 10:
			inviteTimerReact = "🔟";
			break;
			
		case 9:
			inviteTimerReact = "9️⃣";
			break;
			
		case 8:
			inviteTimerReact = "8️⃣";
			break;
		
		case 7:
			inviteTimerReact = "7️⃣";
			break;
		
		case 6:
			inviteTimerReact = "6️⃣";
			break;
		
		case 5:
			inviteTimerReact = "5️⃣";
			break;
		
		case 4:
			inviteTimerReact = "4️⃣";
			break;
		
		case 3:
			inviteTimerReact = "3️⃣";
			break;
		
		case 2:
			inviteTimerReact = "2️⃣";
			break;
		
		case 1:
			inviteTimerReact = "1️⃣";
			break;
		
		case 0:
			setTimeout(() => closeInvite(), 2000);
			setTimeout(() => startGame(), 2000);
			return;

	}
	
	startMsg.then(s => s.addReaction(inviteTimerReact)
				.catch((err) => {console.log(err)}));
				
	setTimeout(() => startMsg.then(s => {
		s.removeReaction(inviteTimerReact)
			.catch((err) => {console.log(err)});
		inviteTimer(time - 5);
	}), 5000);
}

// Function for starting the first round of the game
function closeInvite() {
	console.log("Open invite ended");
}


// Different words that can be used for starting a game
bot.registerCommandAlias("play", "start");
bot.registerCommandAlias("game", "start");

// Behaviour for open invite buttons
bot.on("messageReactionAdd", (msg, emoji, userID) => {
	if (gameStarted) return;
	if (userID == BOT_ID) return;
	
	startMsg.then(s => {
		if (msg.id == s.id && emoji.name == "🐺") {
			console.log(userID + " has joined");
			
			const player = {ID: userID,
			name: cleanString(bot.users.find(e => e.id === userID).username),
			votes: 0};
			
			players.push(player);
			console.log("Player count: " + players.length);
			
			// Remove the moderator's reaction if the first player just joined
			if (players.length == 1)
				msg.removeReaction("🐺");
		}});
});

// Behaviour for leaving the game before it starts
bot.on("messageReactionRemove", (msg, emoji, userID) => {
	if (userID == BOT_ID) return;
	
	startMsg.then(s => {
		if (msg.id == s.id && emoji.name == "🐺") {
			console.log(userID + " has left");
			players.splice(findPlayerIndexByID(userID), 1);
			console.log("Player count: " + players.length);
		}});
});

//function findPlayerIndexByID (userID) {
//	for (let i = 0; i < players.length; i += 1) {
//		if (players[i].ID == userID) return i;
//	}
//	console.log("user ID not found");
//	return -1;
//}

// --------------------- Running the actual game

function startGame() {	
	gameStarted = true;
	
	const roleList = game.assignRoles(players.concat(inactiveRoles));
	const nightPlayerNames = getNamesFromList(roleList.filter(role => role.nightWait === true));
	const passivePlayerNames = getNamesFromList(roleList.filter(role => role.nightWait === false));
	
	//players.sort((a, b) => a.role.order > b.role.order ? 1 : -1);
	players.forEach(e => {
		e.channel = bot.getDMChannel(e.ID);
		
		let embedData = {
			title: "One Night Werewolf",
			description: e.role.intro,
			color: e.role.team.colour,
			image: e.role.img,
			fields: [{
					name: "Night Roles:",
					value: nightPlayerNames
				},
				{
					name: "Passive Roles:",
					value: passivePlayerNames
				},
				{
					name: "Players:",
					value: getNamesFromList(players)
				}]
		};
		
		e.gameMsg = e.channel.then(c => bot.createMessage(c.id, {embed: embedData}));
	});
	
	console.log(players);
	
	if (game.startNight === true) {
		runNight();
	} else {
		runDay();
	}
}

function runNight() {
	console.log("Starting night:");
	let waitTime = Math.random() * maxNightWait;

	sortedPlayerQueue = players.slice();
	sortedPlayerQueue.sort((a, b) => a.originalRole.order > b.originalRole.order ? -1 : 1);
	
	setTimeout(() => nightCommandListener(sortedPlayerQueue.pop()), (waitTime < minNightWait) ? minNightWait : waitTime);
	
}

function nightCommandListener(player) {	
	const role = player.originalRole;
	const awake = role.awakeBehaviour;	
	
	console.log("Checking for " + player.name + " night actions");
	
	// First check if the role is given any night information by default
	if (typeof(awake) !== "undefined") {
		
		const otherAwake = findOtherAwakeRoles(player, awake);
		
		switch (awake) {
			
			case "wolf":
				if (otherAwake.length > 0) {
					const msg = "Wolf friends: " + getNamesFromList(otherAwake);
					createNewGameMsg(player, msg);
					console.log(player.name + ": " + msg);
				}
				break;
				
			case "insomniac":
				if (isSentineled(player)) break;
				const msg  = "You wake up. Looks like you're " + indefArticle(player.role.name) + ".";
				createNewGameMsg(player, msg);
				console.log(player.name + ": " + msg);
				break;
				
			case "minion":
				const awakeWolves = findAllAwake("wolf");
				if (awakeWolves.length > 0) {
					const msg = "Wolf friends: " + getNamesFromList(awakeWolves);
					createNewGameMsg(player, msg);
					console.log(player.name + ": " + msg);
				} else {
					const msg = "You can't find any wolf friends! If you're alone, you need to weaken the village by getting somebody killed";
					createNewGameMsg(player, msg);
					console.log(player.name + ": " + msg);
				}
				break;
				
			case "mason":
				let masonMsg;
				if (otherAwake.length > 0) {
					masonMsg = "Mason friends: " + getNamesFromList(otherAwake);
				} else {
					masonMsg = "You are... a lonely mason 😢";
				}
				createNewGameMsg(player, masonMsg);
				console.log(player.name + ": " + masonMsg);
				break;
		}
	}
	
	// Check for actions that the role actively does

	const actions = role.actions;
	if (typeof(actions) !== "undefined") {

	console.log(player.name + " has an action");

		actions.forEach(action => {
			if (checkActionCondition(action)) {
				
				console.log("Action is valid");
				
				// Tells user of their night action
				const msg = action.msg;
				if (typeof(msg) !== "undefined") {
					createNewGameMsg(player, msg);
					console.log(player.name + ": " + msg);
				}
				
				player.actionListener = {targets: action.targets, effect: action.effect};

			}
		})
		
		
	}
	
	checkToProceedNight();
	
}

function runDay() {
	console.log("Starting day:");
	
	players.forEach(p => {
		createNewGameMsg(p, "Night is over! Once time is up, the most recent name you have said will be your vote." + "\nPlayers: " + getNamesFromList(players));
		p.actionListener = {effect: "vote", targets: [{number: 1, type: "active"}]};
		createDayTimer(p);
	});
	
	dayTimerFunction(dayDur);
}

function countVote() {
	createNewMsgEach("Day is over...");
	
	players.forEach(player => player.actionListener = undefined);
	
	// ON Hunter
	players.filter(p => p.role.name === "Hunter").forEach(p => p.hunterTarget = p.dayVote);
	
	players.forEach(p => setTimeout(() => {
		if (typeof(p.dayVote) === "undefined") {
			addLineToEachPlayer(p.name + " didn't vote.");
		} else {
			addLineToEachPlayer(p.name + " voted for " + p.dayVote.name + ".");
		}
	}, 2000 * (1 + players.indexOf(p))));
	
	players.filter(p => typeof(p.dayVote) !== "undefined").forEach(p => p.dayVote.votes += 1);
	players.sort((a, b) => a.votes > b.votes ? -1 : 1);
	let highestVote = players[0].votes;
	let mostVoted = players.filter(p => p.votes === highestVote);
	
	if (highestVote < 2) {
		setTimeout(() => addLineToEachPlayer("\nNobody is lynched :(\n"), (players.length + 2) * 2000);
		mostVoted.splice(1);
	} else {
		setTimeout(() => {
			let killNames = mostVoted.map(p => p.name);
			if (killNames.length > 1) {
				
			}
			else {
				addLineToDeadAndAlive("\n" + killNames[0] + " is lynched!");
			}
			addLineToDeadAndAlive(mostVoted.reduce((acc, cur) => acc + "\n" + cur.name + " is lynched!", ""));
			kill(mostVoted);
		}, (players.length + 2) * 2000);
	}
	
	setTimeout(() => {
		if (!checkVictory()) runNight();
		}, (players.length + 3 + mostVoted.length) * 2000);
}

function checkVictory() {
	let winningTeams = game.checkVictory(players, graveyard);
	let time = 2000;
	
	if (winningTeams === false) return false;
	
	setTimeout(() => addLineToDeadAndAlive("GAME OVER!\nVillage:"), time += 2000);
	players.forEach(p => setTimeout(() => addLineToDeadAndAlive(p.name + " is a " + p.role.name + "."), time += 2000));
	inactiveRoles.forEach(p => setTimeout(() => addLineToDeadAndAlive("Inactive role " + p.name + " is a " + p.role.name + "."), time += 2000));
	time += 2000;
	players.forEach(p => setTimeout(() => createNewGameMsg(p, "You " + ((winningTeams.some(team => p.role.victory === team)) ? "WIN" : "LOSE") + "!"), time));
	graveyard.forEach(p => setTimeout(() => createNewGameMsg(p, "You " + ((winningTeams.some(team => p.role.victory === team)) ? "WIN" : "LOSE") + "!"), time));
	gameStarted = false;
	return true;
}

async function kill(list) {
	//list.forEach(p => players.splice(players.indexOf(p), 1));
	let time = 0;
	list.forEach(kill => {
		setTimeout(() => addLineToDeadAndAlive("\n" + kill.name + " is dead! They were a " + kill.role.name + ".\n"), time += 2000);
		graveyard.push(kill);
		players.splice(players.indexOf(kill), 1);
		if (kill.role.name === "Hunter" && typeof(kill.hunterTarget) !== "undefined") {
			let hunterTarget = kill.hunterTarget;
			
			// Checks if they are about to die / have died already
			if (list.concat(graveyard).some(p => p === hunterTarget)) {
				setTimeout(() => addLineToDeadAndAlive("An arrow flies off..."), 1500);
			} else {
				setTimeout(() => {
				addLineToDeadAndAlive("THEY SHOT " + hunterTarget.name.toUpperCase() + "!");
				kill(hunterTarget);
				}, 1500);
			}
		}
	});
	
	/* let result = game.killResult(list);
	
	switch (result.type) {
		
		case "ONend":
		
			addLineToEachPlayer("");
			list.forEach(kill => {
				graveyard.push(kill);
				players.splice(players.indexOf(kill), 1);
				addLineToEachPlayer(kill.name + " is lynched! They were a " + kill.role.name + ".");
				});
			addLineToEachPlayer("");
			break;
	} */
}

function dayTimerFunction(time) {
	
	if (time >= 0) {
		updateDayTimer(time);
	}
	
	if (time < -1000) {
		countVote();
		return;
	}
	
	time -= 5000;
	setTimeout(() => dayTimerFunction(time), 5000);
}

function actionListenerProcess (player, msg) {
	console.log(player.name + ": " + msg.content);
		
	const words = msg.content.split(" ");
	
	let others = [], inactive = [], active = [], any = [];
	
	words.forEach(w => {
		if (w === "1" || w === "2" || w === "3") {
			console.log(w + " is an inactive role");
			any.push(w);
			inactive.push(w);
		}
		else if (players.some(e => e.name.toLowerCase() === w.toLowerCase())) {
			console.log(w + " is a player name");
			any.push(w);
			active.push(w);
			if (msg.author.username.toLowerCase() !== w.toLowerCase()) {
				others.push(w);
			}
		}
	});
	
	let stopChecking = false;
	player.actionListener.targets.forEach(t => {

		if (stopChecking) return;
		
		console.log("Checking for " + t.number + " " + t.type + " targets");

		switch (t.type) {
			
			case "inactive":
				if (inactive.length === t.number) {
					actionEffectController(player, inactive, msg);
					stopChecking = true;
				}
				break;
				
			case "active":
				if (active.length === t.number) {
					actionEffectController(player, active, msg);
					stopChecking = true;
				}
				break;
				
			case "any":
				if (any.length === t.number) {
					actionEffectController(player, any, msg);
					stopChecking = true;
				}
				break;
				
			case "others":
				if (others.length === t.number) {
					actionEffectController(player, others, msg);
					stopChecking = true;
				}
				break;
		}
	});
};

bot.on("messageCreate", (msg) => {
	players.filter(player => typeof(player.actionListener) !== "undefined").forEach(player => {
	
		player.channel.then(c => {
			if (msg.author.id === player.ID && c.id === msg.channel.id) actionListenerProcess(player, msg);
		});
		
	})	
});

// New role effects should be added here
function actionEffectController(player, targetNames, msg) {
	console.log(player.name + " targeted " + targetNames);
	msg.addReaction("👍")
		.catch((err) => {console.log(err)});

	let targets = targetNames.map(name => findPlayerFromName(name));

	roleEffectProcessor(player, targets, player.actionListener.effect);
	
	checkToProceedNight();
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

// New role conditions should be added here
function checkActionCondition(action) {
	const cond = action.condition;
	if (typeof(cond) === "undefined") return true;
	switch (cond) {
		
		case "always":
			return true;
			break;
			
		case "one wolf":
			if (findAllAwake("wolf").length === 1) return true;
			break;
	}
	return false;
}

function checkToProceedNight() {
	
	// If there are still night actions left
	if (sortedPlayerQueue.length > 0) {
		
		// Run any that don't need to wait
		if (sortedPlayerQueue[sortedPlayerQueue.length - 1].originalRole.nightWait === false) {
			nightCommandListener(sortedPlayerQueue.pop());
		}
		
		// Run any that do need to wait if there are no actions ongoing
		else if (!players.some(p => typeof(p.actionListener) !== "undefined")) {
			nightCommandListener(sortedPlayerQueue.pop());
		}
	}
	
	// If all night actions are done
	else if (!players.some(p => typeof(p.actionListener) !== "undefined")) {
		runDay();
	}
}

//function createDayTimer(player) {
//	player.timerMsg = player.channel.then(c => bot.createMessage(c.id, getTimeRemainingString(dayDur)));
//}

//function updateDayTimer(ms) {
//	players.forEach(p => p.timerMsg.then(msg => msg.edit(getTimeRemainingString(ms))));
//}

//function getTimeRemainingString(ms) {
//	return "Time remaining: " + ms2Mins(ms);
//}

//function findPlayerFromName(name) {
//	for (player of players) {
//		console.log(player);
//		if (player.name.toLowerCase() === name.toLowerCase()) return player;
//	}
//	for (player of inactiveRoles) {
//		if (player.name.toLowerCase() === name.toLowerCase()) return player;
//	}
//	console.log("ERROR: Couldn't find " + name + " in list of players");
//}

//function ms2Mins(millis) {
//  var minutes = Math.floor(millis / 60000);
//  var seconds = ((millis % 60000) / 1000).toFixed(0);
//  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
//}

//function createNewGameMsg(player, string) {
//	player.gameMsg = player.channel.then(c => bot.createMessage(c.id, string));
//}

//function createNewMsgEach(string) {
//	players.forEach(p => createNewGameMsg(p, string));
//}

//function findAllAwake(awakeBehaviour) {
//	return players.filter(e => (e.originalRole.awakeBehaviour === awakeBehaviour));
//}

//function findOtherAwakeRoles(player, awakeBehaviour) {
//	return findAllAwake(awakeBehaviour).filter(e => e.ID !== player.ID);
//}

//function addLineToMessage(player, msg) {
//	player.gameMsg.then(e => player.gameMsg = e.edit(e.content + "\n" + msg));
//}

//function addLineToEachPlayer(msg) {
//	players.forEach(player => player.gameMsg.then(e => {
//	player.gameMsg = e.edit(e.content + "\n" + msg);
//	}));
//}

//function addLineToDeadAndAlive(msg) {
//	players.concat(graveyard).forEach(player => player.gameMsg.then(e => {
//	player.gameMsg = e.edit(e.content + "\n" + msg);
//	}));
//}

//function getNamesFromList(playerList) {
//	return playerList.length > 0 ? playerList.reduce((acc, cur) => acc + cur.name + " ", "") : "None";
//}

// Is this actually used?
function countRole(role) {
	return players.filter(e => (e.role === role)).length;
}

//function shuffleArray(array) {
//    for (let i = array.length - 1; i > 0; i--) {
//        const j = Math.floor(Math.random() * (i + 1));
//        [array[i], array[j]] = [array[j], array[i]];
//    }
//}

//function sleep(ms) {
//  return new Promise(resolve => setTimeout(resolve, ms));
//}

//function isVowel(x) {

//    var result;

//    result = x.toUpperCase() === "A" || x === "E" || x === "I" || x === "O" || x === "U";
//    return result;
//}

//function indefArticle(str) {
//	return (isVowel(str.charAt(0)) ? "an " : "a ") + str;
//}

function isSentineled(player) {
	const shield = (typeof(player.hasShield) === "undefined") ? false : true;
	if (shield) {
		const msg = "But " + player.name + " is shielded! Hands off!";
		createNewGameMsg(player, msg);
		console.log(player.name + ": " + msg);
		return true;
	}
	return false;
}

function areAnySentineled(players) {
	let bool = false;
	players.forEach(p => {
		if (isSentineled(p)) bool = true;
	});
	return bool;
}

// Clears out emojis, spaces and some other stuff for names
//function cleanString(str) {
//	const cleanStr = str.replace(/[^a-zA-Z0-9]+/,'');
//	console.log(str + " cleaned to " + cleanStr);
//	return cleanStr;
//}

/* const premiumRole = {
  name: 'Premium Member',
  color: 0x6aa84f,
  hoist: true, // Show users with this role in their own section of the member list.
};

async function updateMemberRoleForDonation(guild, member, donationAmount) {
  // If the user donated more than $10, give them the premium role.
  var bool = (donationAmount >= PREMIUM_CUTOFF);
  console.log(bool);
  var bool2 = Boolean(guild);
  var bool3 = Boolean (member);
  console.log(bool2);
  console.log(bool3);
  if (bool) {
    // Get the role, or if it doesn't exist, create it.
    let role = Array.from(guild.roles.values())
      .find(role => role.name === premiumRole.name);

    if (!role) {
      role = await guild.getRole(premiumRole);
    }

    // Add the role to the user, along with an explanation
    // for the guild log (the "audit log").
    return member.addRole(role.id, 'Donated $10 or more.');
  }
}

bot.registerCommand("ping", "Pong!", { // Make a ping command
// Responds with "Pong!" when someone says "!ping"
    description: "Pong!",
    fullDescription: "This command could be used to check if the bot is up. Or entertainment when you're bored.",
    reactionButtons: [ // Add reaction buttons to the command
        {
            emoji: "⬅",
            type: "edit",
            response: (msg) => { // Reverse the message content
                return msg.content.split().reverse().join();
            }
        },
        {
            emoji: "🔁",
            type: "edit", // Pick a new pong variation
            response: ["Pang!", "Peng!", "Ping!", "Pong!", "Pung!"]
        },
        {
            emoji: "⏹",
            type: "cancel" // Stop listening for reactions
        }
    ],
    reactionButtonTimeout: 30000 // After 30 seconds, the buttons won't work anymore
});

bot.on("messageReactionAdd", (react, emoji, user) => {
	bot.removeMessageReactions(react.channel.id, react.id).catch((err) => {
	console.log(user);
	});
});

bot.on("messageCreate", (msg) => { // When a message is created
    if(msg.content === "!embed") { // If the message content is "!embed"
        bot.createMessage(msg.channel.id, {
            embed: {
                title: "I'm an embed!", // Title of the embed
                description: "Here is some more info, with **awesome** formatting.\nPretty *neat*, huh?",
                author: { // Author property
                    name: msg.author.username,
                    icon_url: msg.author.avatarURL
                },
                color: 0x008000, // Color, either in hex (show), or a base-10 integer
                fields: [ // Array of field objects
                    {
                        name: "Some extra info.", // Field title
                        value: "Some extra value.", // Field
                        inline: true // Whether you want multiple fields in same line
                    },
                    {
                        name: "Some more extra info.",
                        value: "Another extra value.",
                        inline: true
                    }
                ],
                footer: { // Footer text
                    text: "Created with Eris."
                }
            }
        });
    }
});

const commandForName = {};
commandForName['addpayment'] = {
  botOwnerOnly: true,
  execute: (msg, args) => {
    const mention = args[0];
    const amount = parseFloat(args[1]);
    const guild = msg.channel.guild;
    const userId = mention.replace(/<@!(.*?)>/, (match, group1) => group1);
    const member = guild.members.get(userId);
console.log(userId);
    // TODO: Handle invalid arguments, such as:
    // 1. No mention or invalid mention.
    // 2. No amount or invalid amount.

    return Promise.all([
      msg.channel.createMessage(`${mention} paid $${amount.toFixed(2)}`),
      updateMemberRoleForDonation(guild, member, amount),
    ]);
  },
};

bot.on('messageCreate', async (msg) => {
  try {
    const content = msg.content;

    // Ignore any messages sent as direct messages.
    // The bot will only accept commands issued in
    // a guild.
    if (!msg.channel.guild) {
      return;
    }

    // Ignore any message that doesn't start with the correct prefix.
    if (!content.startsWith(PREFIX)) {
      return;
    }

    // Extract the name of the command
    const parts = content.split(' ').map(s => s.trim()).filter(s => s);
    const commandName = parts[0].substr(PREFIX.length);

    // Get the requested command, if there is one.
    const command = commandForName[commandName];
    if (!command) {
      return;
    }

    // If this command is only for the bot owner, refuse
    // to execute it for any other user.
    const authorIsBotOwner = msg.author.id === BOT_OWNER_ID;
    if (command.botOwnerOnly && !authorIsBotOwner) {
      return await msg.channel.createMessage('Hey, only my owner can issue that command!');
    }

    // Separate the command arguments from the command prefix and name.
    const args = parts.slice(1);

    // Execute the command.
    await command.execute(msg, args);
  } catch (err) {
    console.warn('Error handling message create event');
    console.warn(err);
  }
}); */

bot.on('error', err => {
  console.warn(err);
});

bot.connect();

module.exports = {
	bot: bot
}