const assert = require('assert');
const Roles = require('../OneNightRoles.js');

describe('Role creation', function () {
    it('Random', function () {
        assert.ok(Roles.getRole("Random"));
    });
    it('Villager', function () {
        const villager = Roles.getRole("Villager");
        assert.ok(villager);
        assert.strictEqual(villager.name, "Villager");
    })
});

describe('Team information', function () {
    it('Team exists', function () {
        const villager = Roles.getRole("Villager");
        assert.ok(villager.team);
    });
    it('Villager team name', function () {
        const villager = Roles.getRole("Villager");
        assert.strictEqual(villager.team.name, "Villager");
    });
});