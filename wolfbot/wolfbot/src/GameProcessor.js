// This file brings together everything to run the game

var sortedPlayerQueue = [];
var game;
var playersObj;
var activeAction;
const { DAY_DUR, MAX_NIGHT_WAIT, MIN_NIGHT_WAIT} = require('./gameconfig.json');

const Players = require('./Players.js');
const GameFactory = require('./Games.js');

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

    setTimeout(() => processNight(playersObj.sortedPlayerQueue.pop()), (waitTime < MIN_NIGHT_WAIT) ? MIN_NIGHT_WAIT : waitTime);

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

    checkToProcessNight();
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
    gameMode: gameModeFunc
};