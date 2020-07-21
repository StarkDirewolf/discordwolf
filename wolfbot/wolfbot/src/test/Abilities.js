var assert = require('assert');
const Abilities = require('../Abilities.js');
const Players = require('../Players.js');

let players;
let player1, player2, player3, iPlayer1;

describe('parseVotes', function () {
    beforeEach(function () {
        players = new Players.Players();
        player1 = players.addNewPlayer("1", "Player 1");
        player2 = players.addNewPlayer("2", "Player 2");
        player3 = players.addNewPlayer("3", "Player 3");
        iPlayer1 = players.addInactiveRole();
    })
    it('Player 1 can vote for 2', function () {
        assert.ok(Abilities.parseVote(player1, "Player2", players));
        assert.deepEqual(player1.votingFor, player2);
    });
    it('Player 1 can vote for themself', function () {
        assert.ok(Abilities.parseVote(player1, "Player1", players));
        assert.deepEqual(player1.votingFor, player1);
    });
    it("Player 1 can't vote for inactive", function () {
        assert.ok(Abilities.parseVote(player1, "Player2", players));
        Abilities.parseVote(player1, "InactiveRole1", players);
        Abilities.parseVote(player1, "Inactive Role 1", players);
        Abilities.parseVote(player1, "1", players);
        assert.deepEqual(player1.votingFor, player2);
    });
    it("Player 1 can change from player 2 to 3", function () {
        assert.ok(Abilities.parseVote(player1, "Player2", players));
        assert.ok(Abilities.parseVote(player1, "Player3", players));
        assert.deepEqual(player1.votingFor, player3);
    });
    it("Players can all vote for each other", function () {
        assert.ok(Abilities.parseVote(player1, "Player2", players));
        assert.ok(Abilities.parseVote(player2, "Player3", players));
        assert.ok(Abilities.parseVote(player3, "Player1", players));
        assert.deepEqual(player1.votingFor, player2);
        assert.deepEqual(player2.votingFor, player3);
        assert.deepEqual(player3.votingFor, player1);
    });
    it("Players can all vote for player 3", function () {
        assert.ok(Abilities.parseVote(player1, "Player3", players));
        assert.ok(Abilities.parseVote(player2, "Player3", players));
        assert.ok(Abilities.parseVote(player3, "Player3", players));
        assert.deepEqual(player1.votingFor, player3);
        assert.deepEqual(player2.votingFor, player3);
        assert.deepEqual(player3.votingFor, player3);
    });
});
