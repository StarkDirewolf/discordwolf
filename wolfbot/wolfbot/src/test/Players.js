var assert = require('assert');
const Players = require('../Players.js');
const Role = require('../OneNightRoles.js');

let players;

describe('Players Object', function () {
    afterEach(function () {
        players.flush();
        players = undefined;
    });
    it('Creating', function () {
        assert.ok(players = new Players.Players());
    });
    it('Adding players and finding by ID', function () {
        assert.ok(players = new Players.Players());
        players.addNewPlayer("ID1", "test1");
        players.addNewPlayer("ID2", "test2");
        players.addNewPlayer("ID3", "test3");
        assert.strictEqual(players.findPlayerIndexByID("ID1"), 0);
        assert.strictEqual(players.findPlayerIndexByID("ID2"), 1);
        assert.strictEqual(players.findPlayerIndexByID("ID3"), 2);
    });
    it('Adding players with invalid characters and finding by ID', function () {
        assert.ok(players = new Players.Players());
        players.addNewPlayer("ID4", "tes_`}t4??_~@%$=");
        players.addNewPlayer("ID5", String.raw`tes*}/\$>?t5*}>?`);
        assert.strictEqual(players.findPlayerIndexByID("ID4"), 0);
        assert.strictEqual(players.findPlayerIndexByID("ID5"), 1);
    })
    it('Finding players by name', function () {
        assert.ok(players = new Players.Players());
        players.addNewPlayer("ID1", "test1");
        players.addNewPlayer("ID2", "test2");
        players.addNewPlayer("ID3", "test3");
        players.addNewPlayer("ID4", "tes_`}t4??_~@%$=");
        players.addNewPlayer("ID5", String.raw`tes*}/\$>?t5*}>?`);
        assert.strictEqual(players.findPlayerFromName("test1").name, "test1");
        assert.strictEqual(players.findPlayerFromName("test2").name, "test2");
        assert.strictEqual(players.findPlayerFromName("test3").name, "test3");
        assert.strictEqual(players.findPlayerFromName("test4").name, "test4");
        assert.strictEqual(players.findPlayerFromName("test5").name, "test5");
    });
    it('Removing players', function () {
        assert.ok(players = new Players.Players());
        players.addNewPlayer("ID1", "test1");
        players.addNewPlayer("ID2", "test2");
        players.addNewPlayer("ID3", "test3");
        players.addNewPlayer("ID4", "tes_`}t4??_~@%$=");
        players.addNewPlayer("ID5", String.raw`tes*}/\$>?t5*}>?`);
        players.addNewPlayer("toRemove", "sad");
        assert.strictEqual(players.findPlayerIndexByID("toRemove"), 5);
        players.removePlayer("toRemove");
        assert.strictEqual(players.findPlayerIndexByID("toRemove"), -1);
    });
});

describe('Player Object', function () {
    beforeEach(function () {
        players = new Players.Players();
        players.addNewPlayer("ID1", "test1");
        players.addNewPlayer("ID2", "test2");
        players.addNewPlayer("ID3", "test3");
        players.addNewPlayer("ID4", "test4");
        players.addNewPlayer("ID5", "test5");
    });
    afterEach(function () {
        players.flush();
        players = undefined;
    });
    describe('Original setting', function () {
        it('Setting roles', function () {
            assert.ok(players.findPlayerFromName("test1").role = Role.getRole("Villager"));
            assert.ok(players.findPlayerFromName("test2").role = Role.getRole("Werewolf"));
            assert.ok(players.findPlayerFromName("test3").role = Role.getRole("Troublemaker"));
            assert.ok(players.findPlayerFromName("test4").role = Role.getRole("Seer"));
            assert.ok(players.findPlayerFromName("test5").role = Role.getRole("Hunter"));
        });
        describe('Manipulating roles', function () {
            beforeEach(function () {
                players.findPlayerFromName("test1").role = Role.getRole("Villager");
                players.findPlayerFromName("test2").role = Role.getRole("Werewolf");
                players.findPlayerFromName("test3").role = Role.getRole("Troublemaker");
                players.findPlayerFromName("test4").role = Role.getRole("Seer");
                players.findPlayerFromName("test5").role = Role.getRole("Hunter");
            });
            it('Getting initial role names', function () {
                assert.strictEqual(players.findPlayerFromName("test1").initialRole.name, "Villager");
                assert.strictEqual(players.findPlayerFromName("test2").initialRole.name, "Werewolf");
                assert.strictEqual(players.findPlayerFromName("test3").initialRole.name, "Troublemaker");
                assert.strictEqual(players.findPlayerFromName("test4").initialRole.name, "Seer");
                assert.strictEqual(players.findPlayerFromName("test5").initialRole.name, "Hunter");
            });
            it('Getting current role names', function () {
                assert.strictEqual(players.findPlayerFromName("test1").currentRole.name, "Villager");
                assert.strictEqual(players.findPlayerFromName("test2").currentRole.name, "Werewolf");
                assert.strictEqual(players.findPlayerFromName("test3").currentRole.name, "Troublemaker");
                assert.strictEqual(players.findPlayerFromName("test4").currentRole.name, "Seer");
                assert.strictEqual(players.findPlayerFromName("test5").currentRole.name, "Hunter");
            });
            describe('Setting new roles', function () {
                it('Setting new current roles', function () {
                    assert.ok(players.findPlayerFromName("test1").role = players.findPlayerFromName("test2").initialRole);
                    assert.ok(players.findPlayerFromName("test2").role = players.findPlayerFromName("test3").initialRole);
                    assert.ok(players.findPlayerFromName("test3").role = players.findPlayerFromName("test4").initialRole);
                    assert.ok(players.findPlayerFromName("test4").role = players.findPlayerFromName("test5").initialRole);
                    assert.ok(players.findPlayerFromName("test5").role = players.findPlayerFromName("test1").initialRole);
                });
                describe('Checking new roles', function () {
                    beforeEach(function () {
                        players.findPlayerFromName("test1").role = players.findPlayerFromName("test2").initialRole;
                        players.findPlayerFromName("test2").role = players.findPlayerFromName("test3").initialRole;
                        players.findPlayerFromName("test3").role = players.findPlayerFromName("test4").initialRole;
                        players.findPlayerFromName("test4").role = players.findPlayerFromName("test5").initialRole;
                        players.findPlayerFromName("test5").role = players.findPlayerFromName("test1").initialRole;
                    });
                    it('Checking initial role is the same', function () {
                        assert.strictEqual(players.findPlayerFromName("test1").initialRole.name, "Villager");
                        assert.strictEqual(players.findPlayerFromName("test2").initialRole.name, "Werewolf");
                        assert.strictEqual(players.findPlayerFromName("test3").initialRole.name, "Troublemaker");
                        assert.strictEqual(players.findPlayerFromName("test4").initialRole.name, "Seer");
                        assert.strictEqual(players.findPlayerFromName("test5").initialRole.name, "Hunter");
                    });
                    it('Checking current role is different', function () {
                        assert.strictEqual(players.findPlayerFromName("test1").currentRole.name, "Werewolf");
                        assert.strictEqual(players.findPlayerFromName("test2").currentRole.name, "Troublemaker");
                        assert.strictEqual(players.findPlayerFromName("test3").currentRole.name, "Seer");
                        assert.strictEqual(players.findPlayerFromName("test4").currentRole.name, "Hunter");
                        assert.strictEqual(players.findPlayerFromName("test5").currentRole.name, "Villager");
                    });
                    it('Checking awake werewolf team with new werewolf', function () {
                        players.addNewPlayer("ID6", "test6");
                        players.findPlayerFromName("test6").role = Role.getRole("Werewolf");
                        expectedPlayers = [players.findPlayerFromName("test2"), players.findPlayerFromName("test6")];
                        actualPlayers = players.findAllAwake(Role.getRole("Werewolf").awakeBehaviour);
                        for (i = 0; i < expectedPlayers.length; i++) {
                            assert.strictEqual(expectedPlayers[i].name, actualPlayers[i].name);
                        }
                    });
                });
            });
        });
    });
});

describe('Advanced Players functions', function () {
    beforeEach(function () {
        players = new Players.Players();
        players.addNewPlayer("ID1", "test1");
        players.addNewPlayer("ID2", "test2");
        players.addNewPlayer("ID3", "test3");
        players.addNewPlayer("ID4", "test4");
        players.addNewPlayer("ID5", "test5");
        players.findPlayerFromName("test1").role = Role.getRole("Villager");
        players.findPlayerFromName("test2").role = Role.getRole("Werewolf");
        players.findPlayerFromName("test3").role = Role.getRole("Troublemaker");
        players.findPlayerFromName("test4").role = Role.getRole("Seer");
        players.findPlayerFromName("test5").role = Role.getRole("Hunter");
    });
    afterEach(function () {
        players.flush();
        players = undefined;
    });
    it('Moving to graveyard', function () {
        players.moveToGraveyard(players.findPlayerFromName("test1"));
        players.moveToGraveyard(players.findPlayerFromName("test4"));
        assert.strictEqual(players.findPlayerIndexByID("ID1"), -1);
        assert.strictEqual(players.findPlayerIndexByID("ID4"), -1);
    });
    it('Checking victory conditions', function () {
        players.calculateVictories();
        assert.strictEqual(players.findPlayerFromName("test2").hasWon, true);
        assert.strictEqual(players.findPlayerFromName("test3").hasWon, false);
    });
    it('Checking victory conditions after role swaps', function () {
        players.findPlayerFromName("test2").role = players.findPlayerFromName("test1").initialRole;
        players.calculateVictories();
        assert.strictEqual(players.findPlayerFromName("test2").hasWon, true);
        assert.strictEqual(players.findPlayerFromName("test3").hasWon, true);
    });
    it('Checking victory conditions after role swaps 2', function () {
        players.findPlayerFromName("test2").role = players.findPlayerFromName("test1").initialRole;
        players.findPlayerFromName("test3").role = players.findPlayerFromName("test2").initialRole;
        players.calculateVictories();
        assert.strictEqual(players.findPlayerFromName("test2").hasWon, false);
        assert.strictEqual(players.findPlayerFromName("test3").hasWon, true);
    });
    //it('Checking for each function', function () {
    //    const func = function (player) {
    //        players.moveToGraveyard(player);
    //    };
    //    players.forEachAlive(func);
    //    assert.strictEqual(players.findPlayerIndexByID("ID1"), -1);
    //    assert.strictEqual(players.findPlayerIndexByID("ID3"), -1);
    //    assert.strictEqual(players.findPlayerIndexByID("ID5"), -1);
    //    assert.notstrictEqual(players.findPlayerIndexByID("ID2"), -1);
    //    assert.notstrictEqual(players.findPlayerIndexByID("ID4"), -1);
    //});
});

describe('Inactive roles', function () {
    beforeEach(function () {
        players = new Players.Players();
    });
    afterEach(function () {
        players.flush();
        players = undefined;
    });
    it('Adding and checking a role', function () {
        players.addSpecificInactiveRole(Role.getRole("Villager"));
        assert.strictEqual(players.findInactiveRole(1).role.name, "Villager");
    });
    it('Adding multiple roles', function () {
        players.addSpecificInactiveRole(Role.getRole("Werewolf"));
        players.addSpecificInactiveRole(Role.getRole("Tanner"));
        assert.strictEqual(players.findInactiveRole(1).currentRole.name, "Werewolf");
        assert.strictEqual(players.findInactiveRole(2).currentRole.name, "Tanner");
    });
    it('Changing roles around', function () {
        players.addSpecificInactiveRole(Role.getRole("Werewolf"));
        players.addSpecificInactiveRole(Role.getRole("Tanner"));
        players.findInactiveRole(1).role = Role.getRole("Villager");
        players.findInactiveRole(2).role = Role.getRole("Troublemaker");
        assert.strictEqual(players.findInactiveRole(1).currentRole.name, "Villager");
        assert.strictEqual(players.findInactiveRole(2).currentRole.name, "Troublemaker");
        assert.strictEqual(players.findInactiveRole(1).initialRole.name, "Werewolf");
        assert.strictEqual(players.findInactiveRole(2).initialRole.name, "Tanner");
    });
});