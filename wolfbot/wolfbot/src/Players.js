/* This file contains everything related to the players
 * in the game - both discord related and game related.
 * There are also functions for accessing and modifying
 * the player lists.
 */

var players = [], graveyard = [];

const Teams = require('./Teams.js');
const Bot = require('./index.js');

// Player constructor
class Player {
    // Discord unique identifier
    #ID;
    // Discord display name
    #name;
    // Channel for the bot to direct message the player
    #dmChannel;
    // How many votes this player has received in the lynch vote
    #votesReceived = 0;
    // The initial role is set once at the start and the role will be copied to current role
    #initialRole;
    // Current role will be the only role to change after the first set and is responsible for
    // pretty much everything except the night behaviour
    #currentRole;
    // Most recent message sent from the bot
    #latestMsg

    constructor(ID, name, dmChannelPromise) {
        this.#ID = ID;
        this.#name = cleanString(name);
        dmChannelPromise.then(c => this.#dmChannel = c);
    }

    get name() {
        return this.#name;
    }

    get ID() {
        return this.#ID;
    }

    set role(role) {
        if (typeof initialRole === "undefined") {
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

    // Sends a new message to the player with an alert
    sendNewDirectMessage(msg) {
        Bot.bot.createMessage(this.#dmChannel.id, msg).then(m => this.#latestMsg = m);
    }

    // Edits the last message with a new line of text, avoiding an alert sound
    addToDirectMessage(msg) {
        lastMsg = this.#latestMsg;
        this.#latestMsg = lastMsg.edit(lastMsg.content + "\n" + msg);
    }
}


class Players {
    #alivePlayers = [];
    #graveyard = [];

    // Creates a player object and adds it to the alive players array
    addNewPlayer(ID, name) {
        this.#alivePlayers.push(new Player(ID, name));
        console.log(name + " (" + ID + ") has been added to the game");
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

    // Returns a list of players with the specified awake behaviour
    findAllAwake(awakeBehaviour) {
        return this.#alivePlayers.filter(e => (e.originalRole.awakeBehaviour === awakeBehaviour));
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
            this.#players.concat(this.#graveyard).forEach(sendNewDirectMessage(messageString));
        } else {
            this.#players.concat(this.#graveyard).forEach(addToDirectMessage(messageString));
        }
    }

    // Sends data to the function that updates if each team has won
    calculateVictories() {
        Teams.calculateVictories(this.#alivePlayers, this.#graveyard);
    }

    // Clears all player data
    flush() {
        this.#graveyard = [];
        this.#alivePlayers = [];
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

module.exports = {
    Players: Players
}