/* This file contains everything related to the players
 * in the game - both discord related and game related.
 * There are also functions for accessing and modifying
 * the player lists.
 */

// Player constructor
class Player {
    // Discord unique identifier
    #ID;
    // Discord display name
    #name;
    // Channel for the bot to direct message the player
    #dmChannel;
    // Who this player is currently voting for
    #votingFor
    // How many votes this player has received in the lynch vote
    #votesReceived = 0;
    // The initial role is set once at the start and the role will be copied to current role
    #initialRole;
    // Current role will be the only role to change after the first set and is responsible for
    // pretty much everything except the night behaviour
    #currentRole;
    // Most recent message sent from the bot
    #latestMsg;
    // Message that holds the timer to update
    #timerMsg;

    #Bot = require('./index.js');


    constructor(ID, name, dmChannelPromise) {
        this.#ID = ID;
        this.#name = cleanString(name);
        if (typeof dmChannelPromise === 'undefined') {
            console.log("No direct message channel for " + name);
        } else {
            dmChannelPromise.then(c => this.#dmChannel = c);
        }
    }

    get name() {
        return this.#name;
    }

    get ID() {
        return this.#ID;
    }

    set role(role) {
        if (typeof this.#initialRole === "undefined") {
            this.#initialRole = role;
        }
        this.#currentRole = role;
    }

    get initialRole() {
        return this.#initialRole;
    }

    get currentRole() {
        return this.#currentRole;
    }

    get role() {
        return this.#currentRole;
    }

    get hasWon() {
        return this.#currentRole.team.hasWon;
    }

    set votingFor(player) {
        this.#votingFor = player;
    }

    get votingFor() {
        return this.#votingFor;
    }

    addOneVote() {
        this.#votesReceived = this.#votesReceived + 1;
    }

    get votesReceived() {
        return this.#votesReceived
    }

    // Sends a new message to the player with an alert
    sendNewDirectMessage(msg) {
        //Bot.createMessage(this.#dmChannel.id, msg);
        this.#Bot.bot.createMessage(this.#dmChannel.id, msg).then(m => this.#latestMsg = m);
    }

    // Edits the last message with a new line of text, avoiding an alert sound
    addToDirectMessage(msg) {
        lastMsg = this.#latestMsg;
        this.#latestMsg = lastMsg.edit(lastMsg.content + "\n" + msg);
    }

    // Creates a timer and sends it as a new direct message to the player
    createTimer(timerDurMs) {
        this.#Bot.bot.createMessage(this.#dmChannel.id, getTimeRemainingString(timerDurMs)).then(m => this.#timerMsg = m);
    }

    // Edits the timer message to display the new time left
    updateTimer(ms) {
        this.#timerMsg.edit(getTimeRemainingString(ms));
    }

    getRoleRevealString(pastTense) {
        return pastTense ? this.name + " was a " + role.name : this.name + " is a " + role.name;
    }

    sendVictoryMessage() {
        if (typeof (this.#dmChannel) !== undefined) {
            let msg = (this.role.team.hasWon) ? "You WIN!" : "You lose :(";
            this.sendNewDirectMessage(msg);
        }
    }
}


class Players {
    #alivePlayers = [];
    #graveyard = [];
    #inactiveRoles = [];
    #nightQueue = [];

    #Teams = require('./Teams.js');
    #Utils = require('./Utils.js');

    // Creates a player object and adds it to the alive players array
    addNewPlayer(ID, name, dmChan) {
        this.#alivePlayers.push(new Player(ID, name, dmChan));
        console.log(name + " (" + ID + ") has been added to the game");
    }

    createNightQueue() {
        this.#nightQueue = this.#alivePlayers.splice();
        this.#nightQueue.sort((a, b) => a.role.order > b.role.order ? -1 : 1);
    }

    getNextPlayerForNight() {
        return this.#nightQueue.pop();
    }

    // Adds an inactive role player object and returns it
    addInactiveRole() {
        const i = this.#inactiveRoles.length + 1;
        let playerObj = new Player(i, "Inactive Role " + i);
        this.#inactiveRoles.push(playerObj);
        console.log("Inactive role " + i + " added");
        return playerObj;
    }

    // Creates a player object, gives it a role, and adds it to the inactive roles array
    addSpecificInactiveRole(role) {
        let playerObj = this.addInactiveRole();
        playerObj.role = role;
        console.log("Inactive role given the role " + role.name);
    }

    // Gets the inactive role at the specified index - 1 so that it starts at 1
    findInactiveRole(i) {
        return this.#inactiveRoles[i - 1];
    }

    // Finds a player by their discord ID and removes them from the alive players array, returning the removed player
    removePlayer(ID) {
        let playerAsList = this.#alivePlayers.splice(this.findPlayerIndexByID(ID), 1);
        return playerAsList[0];
    }

    // Finds a player's index from the given Discord ID from the alive players array
    findPlayerIndexByID (userID) {
        for (let i = 0; i < this.#alivePlayers.length; i += 1) {
            if (this.#alivePlayers[i].ID === userID) return i;
        }
        console.log("ERROR: User ID not found");
        return -1;
    }

    // Finds a player from the given name from the alive players array
    findPlayerFromName (name) {
        for (let player of this.#alivePlayers) {
            if (player.name.toLowerCase() === name.toLowerCase()) return player;
        }
    }

    // Finds a player from the given name from the alive players array
    findInactiveRoleFromNumber(num) {
        for (let player of this.#inactiveRoles) {
            if (player.ID === num) return player;
        }
    }

    findPlayerByID(userID) {
        return this.allPlayers.find(p => p.userID === userID);
    }

    // Returns a list of players with the specified awake behaviour
    findAllAwake(awakeBehaviour) {
        return this.#alivePlayers.filter(e => (e.initialRole.awakeBehaviour === awakeBehaviour));
    }

    // Moves player to the graveyard array
    moveToGraveyard(player) {
        this.#graveyard.push(this.removePlayer(player.ID));
        console.log(player.name + " has been moved to the graveyard");
    }

    //// Private helper function
    //forEachHelper(list, func) {
    //    list.forEach(p => func(p));
    //}

    //// Does a function to each alive player
    //forEachAlive(func) {
    //    this.forEachHelper(this.#alivePlayers, func);
    //}

    //// Does a function to each dead player
    //forEachDead(func) {
    //    this.forEachHelper(this.#graveyard, func);
    //}

    //// Does a function on each player, dead or alive
    //forEachPlayer(func) {
    //    this.forEachAlive(func);
    //    this.forEachDead(func);
    //}

    // Sends a message to each player, dead or alive
    sendMessageToAll(messageString, asNewMsgBool) {
        if (asNewMsgBool) {
            this.allPlayers.forEach(sendNewDirectMessage(messageString));
        } else {
            this.allPlayers.forEach(addToDirectMessage(messageString));
        }
    }

    // Sends data to the function that updates if each team has won
    calculateVictories() {
        this.#Teams.calculateVictories(this.#alivePlayers, this.#graveyard);
    }

    //a Creates a timer for each alive player and sends it to them as a direct message
    createTimers(timerDurMs) {
        this.#alivePlayers.forEach(p => p.createTimer(timerDurMs));
    }

    // Updates the timer for each alive player
    updateTimers(ms) {
        this.#alivePlayers.forEach(p => p.updateTimer(ms));
    }

    // Clears all player data
    flush() {
        this.#graveyard = [];
        this.#alivePlayers = [];
        this.#inactiveRoles = [];
    }

    getAliveNames() {
        return Utils.getNamesFromArray(this.#alivePlayers);
    }

    getVoteStrings() {
        const str = [];
        this.#alivePlayers.forEach(p => {
            const msg = (typeof (p.votingFor) === "undefined") ? p.name + " didn't vote" : p.name + " voted for " + p.votingFor.name;
            str.push(msg);
        });
    }

    getMostVoted(minVotesNeeded) {
        this.#alivePlayers.filter(p => typeof(p.votingFor) !== "undefined").forEach(p => p.votingFor.addOneVote());
        let highest = 0;
        this.#alivePlayers.forEach(p => {
            if (p.votesReceived > highest) highest = p.votesReceived
        });
        if (highest >= minVotesNeeded) {
            return this.#alivePlayers.filter(p => p.votesReceived === highest);
        }
    }

    get allPlayers() {
        return this.#alivePlayers.concat(this.#inactiveRoles).concat(this.#graveyard);
    }

    get length() {
        return this.#alivePlayers.length + this.#graveyard.length;
    }

    sendRoleMessage(roleList) {

        const nightRoleNames = this.#Utils.getNamesFromArray(roleList.filter(role => role.nightWait === true));
        const passiveRoleNames = this.#Utils.getNamesFromArray(roleList.filter(role => role.nightWait === false));

        this.#alivePlayers.forEach(p => {
            let embedData = {
                title: "One Night Werewolf",
                description: p.role.intro,
                color: p.role.team.colour,
                image: p.role.img,
                fields: [{
                    name: "Night Roles:",
                    value: nightRoleNames
                },
                {
                    name: "Passive Roles:",
                    value: passiveRoleNames
                },
                {
                    name: "Players:",
                    value: this.#Utils.getNamesFromArray(this.#alivePlayers)
                }]
            };
            p.sendNewDirectMessage({ embed: embedData });
        });
    }

    calculateVictories() {
        this.#Teams.calculateVictories(this.#alivePlayers, this.#graveyard);
    }

    getAllAliveRoleStrings() {
        return this.#alivePlayers.concat(this.#inactiveRoles).map(p => p.getRoleRevealString(false));
    }

    sendAllVictoryMessages() {
        this.allPlayers.forEach(p => p.sendVictoryMessage());
    }

    moveToGraveyard(player) {
        this.#alivePlayers.splice(this.#alivePlayers.indexOf(player));
        this.#graveyard.push(player);
    }
} 

// Cleans a string from invalid characters - used for a player's name when they join
function cleanString(str) {
    const cleanStr = str.replace(/[^a-zA-Z0-9]/g, '');
    console.log(str + " cleaned to " + cleanStr);
    return cleanStr;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getTimeRemainingString(ms) {
    return "Time remaining: " + ms2Mins(ms);
}

function ms2Mins(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

module.exports = {
    Players: Players
}