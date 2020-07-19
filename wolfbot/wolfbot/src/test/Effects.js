var assert = require('assert');
const Effects = require('../Effects.js');
const Players = require('../Players.js');

let players = new Players.Players();
let player1, player2, player3, iPlayer1;

describe('parseVotes', function () {
    before(function () {
        player1 = players.addNewPlayer("1", "Player 1");
        player2 = players.addNewPlayer("2", "Player 2");
        player3 = players.addNewPlayer("3", "Player 3");
        iPlayer1 = players.addInactiveRole();
    })
    it('Player 1 can vote for 2', function () {
        Effects.parseVote(player1, "Player 2", players);
        assert.deepEqual(player1.votingFor, player2);
    });
});
