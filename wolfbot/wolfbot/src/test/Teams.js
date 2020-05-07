var assert = require('assert');
const Teams = require('../Teams.js');
const Roles = require('../OneNightRoles.js');

let villagerTeam = Teams.villager;
let tannerTeam = Teams.tanner;
let werewolfTeam = Teams.werewolf;

describe('Villager information', function () {
    it('Getting object', function () {
        assert.ok(villagerTeam);
    });
    it('Checking name', function () {
        assert.equal(villagerTeam.name, "Villager");
    });
});

describe('Werewolf information', function () {
    it('Getting object', function () {
        assert.ok(werewolfTeam);
    });
    it('Checking name', function () {
        assert.equal(werewolfTeam.name, "Werewolf");
    });
});

describe('Tanner information', function () {
    it('Getting object', function () {
        assert.ok(tannerTeam);
    });
    it('Checking name', function () {
        assert.equal(tannerTeam.name, "Tanner");
    });
});

describe('Victory conditions DEPEND: OneNightRoles.js', function () {
    let tanner = { role: Roles.getRole("Tanner") };
    let villager = { role: Roles.getRole("Villager") };
    let werewolf = { role: Roles.getRole("Werewolf") };
    let werewolf2 = { role: Roles.getRole("Werewolf") };
    let troublemaker = { role: Roles.getRole("Troublemaker") };
    let minion = { role: Roles.getRole("Minion") };

    describe('1: Alive: Tanner, Villager, Werewolf/ Dead: Werewolf', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([tanner, villager, werewolf], [werewolf2]);
        });
        it('Living tanner loses', function () {
            assert.equal(tanner.role.team.hasWon, false);
        });
        it('Living villager wins', function () {
            assert.equal(villager.role.team.hasWon, true);
        });
        it('Dead wolf loses', function () {
            assert.equal(werewolf2.role.team.hasWon, false);
        });
        it('Living wolf loses', function () {
            assert.equal(werewolf.role.team.hasWon, false);
        });
    });

    describe('2: Alive: Villager, Troublemaker, Werewolf/ Dead: Werewolf, Tanner', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([villager, troublemaker, werewolf], [werewolf2, tanner]);
        });
        it('Living villager wins', function () {
            assert.equal(villager.role.team.hasWon, true);
        });
        it('Living troublemaker wins', function () {
            assert.equal(troublemaker.role.team.hasWon, true);
        });
        it('Living werewolf loses', function () {
            assert.equal(werewolf.role.team.hasWon, false);
        });
        it('Dead werewolf loses', function () {
            assert.equal(werewolf.role.team.hasWon, false);
        });
        it('Dead tanner wins', function () {
            assert.equal(tanner.role.team.hasWon, true);
        });
    });

    describe('3: Alive: Villager, Troublemaker, Werewolf, Minion/ Dead: Tanner', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([villager, troublemaker, werewolf, minion], [tanner]);
        });
        it('Living villager loses', function () {
            assert.equal(villager.role.team.hasWon, false);
        });
        it('Living troublemaker loses', function () {
            assert.equal(troublemaker.role.team.hasWon, false);
        });
        it('Living werewolf loses', function () {
            assert.equal(werewolf.role.team.hasWon, false);
        });
        it('Living minion loses', function () {
            assert.equal(minion.role.team.hasWon, false);
        });
        it('Dead tanner wins', function () {
            assert.equal(tanner.role.team.hasWon, true);
        });
    });

    describe('4: Alive: Troublemaker, Werewolf, Minion/ Dead: Tanner, Villager', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([troublemaker, werewolf, minion], [tanner, villager]);
        });
        it('Dead villager loses', function () {
            assert.equal(villager.role.team.hasWon, false);
        });
        it('Living troublemaker loses', function () {
            assert.equal(troublemaker.role.team.hasWon, false);
        });
        it('Living werewolf loses', function () {
            assert.equal(werewolf.role.team.hasWon, false);
        });
        it('Living minion loses', function () {
            assert.equal(minion.role.team.hasWon, false);
        });
        it('Dead tanner wins', function () {
            assert.equal(tanner.role.team.hasWon, true);
        });
    });

    describe('5: Alive: Troublemaker, Minion/ Dead: Tanner, Villager', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([troublemaker, minion], [tanner, villager]);
        });
        it('Dead villager loses', function () {
            assert.equal(villager.role.team.hasWon, false);
        });
        it('Living troublemaker loses', function () {
            assert.equal(troublemaker.role.team.hasWon, false);
        });
        it('Living minion loses', function () {
            assert.equal(minion.role.team.hasWon, false);
        });
        it('Dead tanner wins', function () {
            assert.equal(tanner.role.team.hasWon, true);
        });
    });

    describe('6: Alive: Villager, Troublemaker, Minion/ Dead: Tanner', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([troublemaker, minion, villager], [tanner]);
        });
        it('Living villager loses', function () {
            assert.equal(villager.role.team.hasWon, false);
        });
        it('Living troublemaker loses', function () {
            assert.equal(troublemaker.role.team.hasWon, false);
        });
        it('Living minion loses', function () {
            assert.equal(minion.role.team.hasWon, false);
        });
        it('Dead tanner wins', function () {
            assert.equal(tanner.role.team.hasWon, true);
        });
    });

    describe('7: Alive: Tanner, Troublemaker, Minion/ Dead: Villager', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([troublemaker, minion, tanner], [villager]);
        });
        it('Living villager loses', function () {
            assert.equal(villager.role.team.hasWon, false);
        });
        it('Living troublemaker loses', function () {
            assert.equal(troublemaker.role.team.hasWon, false);
        });
        it('Living minion wins', function () {
            assert.equal(minion.role.team.hasWon, true);
        });
        it('Living tanner loses', function () {
            assert.equal(tanner.role.team.hasWon, false);
        });
    });

    describe('8: Alive: Villager, Tanner, Troublemaker, Minion/ Dead: None', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([troublemaker, minion, tanner, villager], []);
        });
        it('Living villager wins', function () {
            assert.equal(villager.role.team.hasWon, true);
        });
        it('Living troublemaker wins', function () {
            assert.equal(troublemaker.role.team.hasWon, true);
        });
        it('Living minion loses', function () {
            assert.equal(minion.role.team.hasWon, false);
        });
        it('Living tanner loses', function () {
            assert.equal(tanner.role.team.hasWon, false);
        });
    });

    describe('9: Alive: Tanner, Troublemaker/ Dead: Villager, Minion', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([troublemaker, tanner], [minion, villager]);
        });
        it('Dead villager loses', function () {
            assert.equal(villager.role.team.hasWon, false);
        });
        it('Living troublemaker loses', function () {
            assert.equal(troublemaker.role.team.hasWon, false);
        });
        it('Dead minion wins', function () {
            assert.equal(minion.role.team.hasWon, true);
        });
        it('Living tanner loses', function () {
            assert.equal(tanner.role.team.hasWon, false);
        });
    });

    describe('10: Alive: Tanner/ Dead: Villager, Minion, Troublemaker', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([tanner], [villager, minion, troublemaker]);
        });
        it('Dead villager loses', function () {
            assert.equal(villager.role.team.hasWon, false);
        });
        it('Dead troublemaker loses', function () {
            assert.equal(troublemaker.role.team.hasWon, false);
        });
        it('Dead minion wins', function () {
            assert.equal(minion.role.team.hasWon, true);
        });
        it('Living tanner loses', function () {
            assert.equal(tanner.role.team.hasWon, false);
        });
    });

    describe('11: Alive: Tanner, Werewolf, Werewolf/ Dead: Villager, Minion, Troublemaker', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([tanner, werewolf, werewolf2], [villager, minion, troublemaker]);
        });
        it('Dead villager loses', function () {
            assert.equal(villager.role.team.hasWon, false);
        });
        it('Dead troublemaker loses', function () {
            assert.equal(troublemaker.role.team.hasWon, false);
        });
        it('Dead minion wins', function () {
            assert.equal(minion.role.team.hasWon, true);
        });
        it('Living werewolf wins', function () {
            assert.equal(werewolf.role.team.hasWon, true);
        });
        it('Living werewolf wins', function () {
            assert.equal(werewolf2.role.team.hasWon, true);
        });
        it('Living tanner loses', function () {
            assert.equal(tanner.role.team.hasWon, false);
        });
    });

    describe('12: Alive: Villager, Troublemaker, Tanner, Werewolf, Werewolf/ Dead: Minion', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([villager, troublemaker, tanner, werewolf, werewolf2], [minion]);
        });
        it('Living villager loses', function () {
            assert.equal(villager.role.team.hasWon, false);
        });
        it('Living troublemaker loses', function () {
            assert.equal(troublemaker.role.team.hasWon, false);
        });
        it('Dead minion wins', function () {
            assert.equal(minion.role.team.hasWon, true);
        });
        it('Living werewolf wins', function () {
            assert.equal(werewolf.role.team.hasWon, true);
        });
        it('Living werewolf wins', function () {
            assert.equal(werewolf2.role.team.hasWon, true);
        });
        it('Living tanner loses', function () {
            assert.equal(tanner.role.team.hasWon, false);
        });
    });

    describe('13: Alive: Villager, Troublemaker, Tanner, Minion/ Dead: Werewolf', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([villager, troublemaker, tanner, minion], [werewolf]);
        });
        it('Living villager wins', function () {
            assert.equal(villager.role.team.hasWon, true);
        });
        it('Living troublemaker wins', function () {
            assert.equal(troublemaker.role.team.hasWon, true);
        });
        it('Living minion loses', function () {
            assert.equal(minion.role.team.hasWon, false);
        });
        it('Dead werewolf loses', function () {
            assert.equal(werewolf.role.team.hasWon, false);
        });
        it('Living tanner loses', function () {
            assert.equal(tanner.role.team.hasWon, false);
        });
    });

    describe('14: Alive: Villager, Troublemaker, Tanner, Minion, Werewolf/ Dead: None', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([villager, troublemaker, tanner, minion, werewolf], []);
        });
        it('Living villager loses', function () {
            assert.equal(villager.role.team.hasWon, false);
        });
        it('Living troublemaker loses', function () {
            assert.equal(troublemaker.role.team.hasWon, false);
        });
        it('Living minion wins', function () {
            assert.equal(minion.role.team.hasWon, true);
        });
        it('Living werewolf wins', function () {
            assert.equal(werewolf.role.team.hasWon, true);
        });
        it('Living tanner loses', function () {
            assert.equal(tanner.role.team.hasWon, false);
        });
    });

    describe('15: Alive: Villager, Troublemaker, Tanner, Minion/ Dead: None', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([villager, troublemaker, tanner, minion], []);
        });
        it('Living villager wins', function () {
            assert.equal(villager.role.team.hasWon, true);
        });
        it('Living troublemaker wins', function () {
            assert.equal(troublemaker.role.team.hasWon, true);
        });
        it('Living minion loses', function () {
            assert.equal(minion.role.team.hasWon, false);
        });
        it('Living tanner loses', function () {
            assert.equal(tanner.role.team.hasWon, false);
        });
    });

    describe('16: Alive: Villager, Troublemaker, Tanner/ Dead: None', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([villager, troublemaker, tanner], []);
        });
        it('Living villager wins', function () {
            assert.equal(villager.role.team.hasWon, true);
        });
        it('Living troublemaker wins', function () {
            assert.equal(troublemaker.role.team.hasWon, true);
        });
        it('Living tanner loses', function () {
            assert.equal(tanner.role.team.hasWon, false);
        });
    });

    describe('17: Alive: Villager, Troublemaker/ Dead: None', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([villager, troublemaker], []);
        });
        it('Living villager wins', function () {
            assert.equal(villager.role.team.hasWon, true);
        });
        it('Living troublemaker wins', function () {
            assert.equal(troublemaker.role.team.hasWon, true);
        });
    });

    describe('18: Alive: Villager, Troublemaker/ Dead: Tanner', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([villager, troublemaker], [tanner]);
        });
        it('Living villager loses', function () {
            assert.equal(villager.role.team.hasWon, false);
        });
        it('Living troublemaker loses', function () {
            assert.equal(troublemaker.role.team.hasWon, false);
        });
        it('Dead tanner wins', function () {
            assert.equal(tanner.role.team.hasWon, true);
        });
    });
});