const assert = require('assert');
const Roles = require('../OneNightRoles.js');

describe('Role creation', function () {
    it('Random', function () {
        assert.ok(Roles.createRole("Random"));
    });
    it('Villager', function () {
        const villager = Roles.createRole("Villager");
        assert.ok(villager);
        assert.equal(villager.name, "Villager");
    })
});

describe('Team information', function () {
    it('Team exists', function () {
        const villager = Roles.createRole("Villager");
        assert.ok(villager.team);
    });
    it('Villager team name', function () {
        const villager = Roles.createRole("Villager");
        assert.equal(villager.team.name, "Villager");
    });
});