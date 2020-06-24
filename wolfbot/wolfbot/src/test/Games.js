var assert = require('assert');
const Players = require('../Players.js');
const GameFactory = require('../Games.js');

let threePlayers, fourPlayers, fivePlayers;
let game = GameFactory.createGame("OneNight");

describe('One Night Random Role Assigning', function () {
    before(function () {
        threePlayers = new Players.Players();
        fourPlayers = new Players.Players();
        fivePlayers = new Players.Players();

        threePlayers.addNewPlayer("ID1", "test1");
        threePlayers.addNewPlayer("ID2", "test2");
        threePlayers.addNewPlayer("ID3", "test3");

        fourPlayers.addNewPlayer("ID4", "test4");
        fourPlayers.addNewPlayer("ID5", "test5");
        fourPlayers.addNewPlayer("ID6", "test6");
        fourPlayers.addNewPlayer("ID7", "test7");

        fivePlayers.addNewPlayer("ID8", "test8");
        fivePlayers.addNewPlayer("ID9", "test9");
        fivePlayers.addNewPlayer("ID10", "test10");
        fivePlayers.addNewPlayer("ID11", "test11");
        fivePlayers.addNewPlayer("ID12", "test12");
    });
    it('Three players', function () {
        assert.ok(game.assignRoles(threePlayers));
    });
    it('Four players', function () {
        assert.ok(game.assignRoles(fourPlayers));
    });
    it('Five players', function () {
        assert.ok(game.assignRoles(fivePlayers));
    });
});
