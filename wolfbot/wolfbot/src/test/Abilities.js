var assert = require('assert');
const Abilities = require('../Abilities.js');
const Players = require('../Players.js');

let players;
let player1, player2, player3, iPlayer1;
let action;

describe('Processing Targets', function () {
    beforeEach(function () {
        players = new Players.Players();
        player1 = players.addNewPlayer("1", "Player 1");
        player2 = players.addNewPlayer("2", "Player 2");
        player3 = players.addNewPlayer("3", "Player 3");
        iPlayer1 = players.addInactiveRole();
    });
    it('Inactive', function () {
        action.targets = [{ number: 1, filterFunc: Abilities.target.inactive }];
        targets = processTargets(player1, "1", action, players);
        assert.deepEqual(targets[0], iPlayer1, "Can't target inactive player");
        targets = processTargets(player1, "Player2", action, players);
        assert.deepEqual(typeof (targets), "undefined", "Incorrectly gets a target for Player2");
        targets = processTargets(player1, "Player1", action, players);
        assert.deepEqual(typeof (targets), "undefined", "Incorrectly gets a target for self");
    });
    it('Active', function () {
        action.targets = [{ number: 1, filterFunc: Abilities.target.active }];
        targets = processTargets(player1, "1", action, players);
        assert.deepEqual(typeof (targets), "undefined", "Incorrectly gets a target inactive player");
        targets = processTargets(player1, "Player2", action, players);
        assert.deepEqual(targets[0], player2, "Can't target player 2");
        targets = processTargets(player1, "Player1", action, players);
        assert.deepEqual(targets[0], player1, "Can't target self");
        targets = processTargets(player1, "Player1 Player2", action, players);
        assert.deepEqual(typeof (targets), "undefined", "Incorrectly targeted 2 players");
    });
    it('Any', function () {
        action.targets = [{ number: 1, filterFunc: Abilities.target.any }];
        targets = processTargets(player1, "1", action, players);
        assert.deepEqual(targets[0], iPlayer1, "Can't target inactive player");
        targets = processTargets(player1, "Player2", action, players);
        assert.deepEqual(targets[0], player2, "Can't target player 2");
        targets = processTargets(player1, "Player1", action, players);
        assert.deepEqual(targets[0], player1, "Can't target self");
        targets = processTargets(player1, "Player1 Player2", action, players);
        assert.deepEqual(typeof (targets), "undefined", "Incorrectly targeted 2 players");

        action.targets = [{ number: 2, filterFunc: Abilities.target.any }];
        targets = processTargets(player1, "Player1", action, players);
        assert.deepEqual(typeof (targets), "undefined", "Incorrectly gets a single target");
        targets = processTargets(player1, "Player1 Player2", action, players);
        assert.deepEqual(targets[0], player1, "Multi-target failed - 1");
        assert.deepEqual(targets[1], player2, "Multi-target failed - 2");
        targets = processTargets(player1, "Player1 Player1", action, players);
        assert.deepEqual(typeof (targets), "undefined", "Incorrectly targeted same player twice");
    });
    it('Other Active', function () {
        action.targets = [{ number: 1, filterFunc: Abilities.target.otherActive }];
        targets = processTargets(player1, "1", action, players);
        assert.deepEqual(typeof (targets), "undefined", "Incorrectly gets a target inactive player");
        targets = processTargets(player1, "Player2", action, players);
        assert.deepEqual(targets[0], player2, "Can't target player 2");
        targets = processTargets(player1, "Player1", action, players);
        assert.deepEqual(typeof (targets), "undefined", "Incorrectly targets self");
        targets = processTargets(player1, "Player1 Player2", action, players);
        assert.deepEqual(typeof (targets), "undefined", "Incorrectly targeted 2 players");
    });
});

describe('parseVotes', function () {
    beforeEach(function () {
        players = new Players.Players();
        player1 = players.addNewPlayer("1", "Player 1");
        player2 = players.addNewPlayer("2", "Player 2");
        player3 = players.addNewPlayer("3", "Player 3");
        iPlayer1 = players.addInactiveRole();
    });
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
