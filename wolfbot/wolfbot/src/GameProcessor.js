// This file brings together everything to run the game

var game;
var playersObj;
var day = false;
var activeAction;
const { DAY_DUR, MAX_NIGHT_WAIT, MIN_NIGHT_WAIT} = require('./gameconfig.json');

const GameFactory = require('./Games.js');
const Abilities = require('./Abilities.js');

var gameRunning = false;

var startGameFunction = function (players) {
    gameRunning = true;
    playersObj = players;

    playersObj.addInactiveRole();
    playersObj.addInactiveRole();
    playersObj.addInactiveRole();

    const roleList = game.assignRoles(playersObj.allPlayers);
    playersObj.sendRoleMessage(roleList);

    if (game.startNight === true) {
        runNight();
    } else {
        runDay();
    }
};

function runNight() {
    console.log("Starting night:");

    playersObj.createNightQueue();

    let waitTime = Math.random() * MAX_NIGHT_WAIT;

    setTimeout(() => processNight(playersObj.getNextPlayerForNight()), (waitTime < MIN_NIGHT_WAIT) ? MIN_NIGHT_WAIT : waitTime);

}

function processNight(player) {
    const role = player.role;
    const awakeFunc = role.awakeBehaviour;

    console.log("Checking for " + player.name + " night actions");

    if (typeof (awake) !== "undefined") {
        awakeFunc(player, playersObj);
    }

    const actions = role.actions;

    if (typeof (actions) !== "undefined") {
        actions.forEach(action => {
            if (typeof (action.condition) !== "undefined" && action.condition(playersObj)) {
                const msg = action.msg;
                player.sendNewDirectMessage(msg);
                console.log(player.name + ": " + msg);

                activeAction = { player: player, action: action };
            }
        });
    }

    checkToProceedNight();
}

var processActionInput = function (userID, string) {
    if (!isGameRunning()) return;

    const player = playersObj.findPlayerByID(userID);

    if (day) {
        return Abilities.parseVote(player, string, playersObj);
    }
    if (typeof (activeAction) !== "undefined") {
        if (player === activeAction.player) {
            const valid = Abilities.parseAction(activeAction, string, playersObj);

            if (valid) {
                activeAction = undefined;
                return valid;
            }
        }
    }

    return false;
}


function runDay() {
    console.log("Starting day:");

    const msg = "Night is over! Once time is up, the most recent name you have said will be your vote." + "\nPlayers: " + playersObj.getAliveNames();
    playersObj.sendMessageToAll(msg, true);
    day = true;
    playersObj.createTimers(DAY_DUR);

    dayTimerFunction(DAY_DUR);
}

function dayTimerFunction(time) {

    if (time >= 0) {
        playersObj.updateTimers(time);
    }

    if (time < -1000) {
        countVote();
        return;
    }

    time -= 5000;
    setTimeout(() => dayTimerFunction(time), 5000);
}

function countVote() {
    playersObj.sendMessageToAll("Day is over...", true);

    day = false;

    const voteStrs = playersObj.getVoteStrings();

    voteStrs.forEach(e => {
        setTimeout(() => playersObj.sendMessageToAll(e, false), 2000 * (1 + voteStrs.indexOf(e)));
    });

    const votedPlayers = playersObj.getMostVoted(2);

    if (typeof (votedPlayers) === "undefined") {
        setTimeout(() => playersObj.sendMessageToAll("\nNobody is lynched :(\n", false), (voteStrs.length + 2) * 2000);
    } else {
        votedPlayers.forEach(p => {
            setTimeout(() => {
                playersObj.sendMessageToAll("\n" + p.name + " is lynched!", false);
                killPlayer(p);
            }, (voteStrs.length + 2 + votedPlayers.indexOf(p)) * 2000);
        });
    }

    setTimeout(() => {
        if (!checkVictory()) runNight();
    }, (voteStrs.length + 3 + votedPlayers.length) * 2000);

}

var killPlayer = function (kill) {
    playersObj.sendMessageToAll(kill.getRoleRevealString(true), false);

    kill.role.onDeath(playersObj, player);
    playersObj.moveToGraveyard(kill);
}

function checkVictory() {
    let gameOver = game.checkVictory(playersObj);
    let time = 2000;

    if (gameOver === false) return false;

    setTimeout(() => playersObj.sendMessageToAll("GAME OVER!\nVillage:", false), time += 2000);
    playersObj.getAllAliveRolesStrings().forEach(str => setTimeout(() => playersObj.sendMessageToAll(str, false), time += 2000));
    time += 2000;
    setTimeout(() => playersObj.sendAllVictoryMessages(), time);

    gameRunning = false;
    return true;
}

var isGameRunning = function () {
    return gameRunning;
}

var gameModeFunc = function (string) {
    game = GameFactory.createGame(string);
    console.log(string + " mode selected");
}

module.exports = {
    start: startGameFunction,
    isGameRunning: isGameRunning,
    gameMode: gameModeFunc,
    killPlayer: killPlayer,
    processActionInput: processActionInput
}