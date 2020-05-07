var assert = require('assert');
const Players = require('../Players.js');
const Role = require('../OneNightRoles.js');

let players;

describe('Players Object', function () {
    after(function () {
        players.flush();
    });
    it('Creating', function () {
        assert.ok(players = new Players.Players());
    });
    it('Adding players', function () {
        players.addNewPlayer("ID1", "test1");
        players.addNewPlayer("ID2", "test2");
        players.addNewPlayer("ID3", "test3");
    });
    it('Adding players with invalid characters', function () {
        players.addNewPlayer("ID4", "tes_`}t4??_~@%$=");
        players.addNewPlayer("ID5", String.raw`tes*}/\$>?t5*}>?`);
    })
    it('Finding player indexes by ID', function () {
        assert.equal(players.findPlayerIndexByID("ID1"), 0);
        assert.equal(players.findPlayerIndexByID("ID2"), 1);
        assert.equal(players.findPlayerIndexByID("ID3"), 2);
        assert.equal(players.findPlayerIndexByID("ID4"), 3);
        assert.equal(players.findPlayerIndexByID("ID5"), 4);
    });
    it('Finding player by name', function () {
        assert.equal(players.findPlayerFromName("test1").name, "test1");
        assert.equal(players.findPlayerFromName("test2").name, "test2");
        assert.equal(players.findPlayerFromName("test3").name, "test3");
        assert.equal(players.findPlayerFromName("test4").name, "test4");
        assert.equal(players.findPlayerFromName("test5").name, "test5");
    });
    it('Removing players', function () {
        players.addNewPlayer("toRemove", "sad");
        assert.equal(players.findPlayerIndexByID("toRemove"), 5);
        players.removePlayer("toRemove");
        assert.equal(players.findPlayerIndexByID("toRemove"), -1);
    });
});

describe('Player Object', function () {
    before(function () {
        players.addNewPlayer("ID1", "test1");
        players.addNewPlayer("ID2", "test2");
        players.addNewPlayer("ID3", "test3");
        players.addNewPlayer("ID4", "test4");
        players.addNewPlayer("ID5", "test5");
    });
    after(function () {
        players.flush();
    });
    it('Original setting', function () {
        it('Setting roles', function () {
            assert.ok(players.findPlayerFromName("test1").role = Role.getRole("Villager"));
            assert.ok(players.findPlayerFromName("test2").role = Role.getRole("Werewolf"));
            assert.ok(players.findPlayerFromName("test3").role = Role.getRole("Troublemaker"));
            assert.ok(players.findPlayerFromName("test4").role = Role.getRole("Seer"));
            assert.ok(players.findPlayerFromName("test5").role = Role.getRole("Hunter"));
        });
        it('Getting initial role names', function () {
            assert.equal(players.findPlayerFromName("test1").initialRole.name, "Villager");
            assert.equal(players.findPlayerFromName("test2").initialRole.name, "Werewolf");
            assert.equal(players.findPlayerFromName("test3").initialRole.name, "Troublemaker");
            assert.equal(players.findPlayerFromName("test4").initialRole.name, "Seer");
            assert.equal(players.findPlayerFromName("test5").initialRole.name, "Hunter");
        });
        it('Getting current role names', function () {
            assert.equal(players.findPlayerFromName("test1").currentRole.name, "Villager");
            assert.equal(players.findPlayerFromName("test2").currentRole.name, "Werewolf");
            assert.equal(players.findPlayerFromName("test3").currentRole.name, "Troublemaker");
            assert.equal(players.findPlayerFromName("test4").currentRole.name, "Seer");
            assert.equal(players.findPlayerFromName("test5").currentRole.name, "Hunter");
        });
    });
    it('Setting new roles', function () {
        it('Setting new current roles', function () {
            assert.ok(players.findPlayerFromName("test1").currentRole = player.findPlayerFromName("test2").initialRole);
            assert.ok(players.findPlayerFromName("test2").currentRole = player.findPlayerFromName("test3").initialRole);
            assert.ok(players.findPlayerFromName("test3").currentRole = player.findPlayerFromName("test4").initialRole);
            assert.ok(players.findPlayerFromName("test4").currentRole = player.findPlayerFromName("test5").initialRole);
            assert.ok(players.findPlayerFromName("test5").currentRole = player.findPlayerFromName("test1").initialRole);
        });
        it('Checking initial role is the same', function () {
            assert.equal(players.findPlayerFromName("test1").initialRole.name, "Villager");
            assert.equal(players.findPlayerFromName("test2").initialRole.name, "Werewolf");
            assert.equal(players.findPlayerFromName("test3").initialRole.name, "Troublemaker");
            assert.equal(players.findPlayerFromName("test4").initialRole.name, "Seer");
            assert.equal(players.findPlayerFromName("test5").initialRole.name, "Hunter");
        });
        it('Checking current role is different', function () {
            assert.equal(players.findPlayerFromName("test1").currentRole.name, "Werewolf");
            assert.equal(players.findPlayerFromName("test2").currentRole.name, "Troublemaker");
            assert.equal(players.findPlayerFromName("test3").currentRole.name, "Seer");
            assert.equal(players.findPlayerFromName("test4").currentRole.name, "Hunter");
            assert.equal(players.findPlayerFromName("test5").currentRole.name, "Villager");
        });
        it('Checking awake werewolf team with new werewolf', function () {
            assert.ok(players.addNewPlayer("ID6", "test6"));
            assert.ok(players.findPlayerFromName("test6").role = Role.getRole("Werewolf"));
            expectedPlayers = [players.findPlayerFromName("test6"), players.findPlayerFromName("test2")]
            assert.equal(players.findAllAwake("wolf"), expectedPlayers);
        });
    });
});

describe('Advanced Players functions', function () {
    beforeEach(function () {
        players.addNewPlayer("ID1", "test1");
        players.addNewPlayer("ID2", "test2");
        players.addNewPlayer("ID3", "test3");
        players.addNewPlayer("ID4", "test4");
        players.addNewPlayer("ID5", "test5");
        assert.ok(players.findPlayerFromName("test1").role = Role.getRole("Villager"));
        assert.ok(players.findPlayerFromName("test2").role = Role.getRole("Werewolf"));
        assert.ok(players.findPlayerFromName("test3").role = Role.getRole("Troublemaker"));
        assert.ok(players.findPlayerFromName("test4").role = Role.getRole("Seer"));
        assert.ok(players.findPlayerFromName("test5").role = Role.getRole("Hunter"));
    });
    afterEach(function () {
        players.flush();
    });
    it('Moving to graveyard', function () {
        players.moveToGraveyard(players.findPlayerFromName("test1"));
        players.moveToGraveyard(players.findPlayerFromName("test4"));
        assert.equal(players.findPlayerIndexByID("ID1"), -1);
        assert.equal(players.findPlayerIndexByID("ID4"), -1);
    });
    describe('Checking victory conditions', function () {
        it('Calcuting', function () {
            players.calculateVictories();
        });
        it('Checking', function () {
            assert.equal(players.findPlayerFromName("test2").hasWon, true);
            assert.equal(players.findPlayerFromName("test3").hasWon, false);
        });
    });
    //it('Checking for each function', function () {
    //    const func = function (player) {
    //        players.moveToGraveyard(player);
    //    };
    //    players.forEachAlive(func);
    //    assert.equal(players.findPlayerIndexByID("ID1"), -1);
    //    assert.equal(players.findPlayerIndexByID("ID3"), -1);
    //    assert.equal(players.findPlayerIndexByID("ID5"), -1);
    //    assert.notEqual(players.findPlayerIndexByID("ID2"), -1);
    //    assert.notEqual(players.findPlayerIndexByID("ID4"), -1);
    //});
});