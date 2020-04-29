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
    let tanner = { role: Roles.createRole("Tanner") };
    let villager = { role: Roles.createRole("Villager") };
    let werewolf = { role: Roles.createRole("Werewolf") };
    let werewolf2 = { role: Roles.createRole("Werewolf") };
    describe('Alive: Tanner, Villager, Werewolf Dead: Werewolf', function () {
        it('Calculating victories', function () {
            Teams.calculateVictories([tanner, villager, werewolf], [werewolf2]);
        });
        it('Living tanner loses', function () {
            assert.equal(tanner.role.team.hasWon_ON, false);
        });
        it('Living villager wins', function () {
            assert.equal(villager.role.team.hasWon_ON, true);
        });
        it('Dead wolf loses', function () {
            assert.equal(werewolf2.role.team.hasWon_ON, false);
        });
        it('Living wolf loses', function () {
            assert.equal(werewolf.role.team.hasWon_ON, false);
        });
    });
});