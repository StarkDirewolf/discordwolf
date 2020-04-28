module.exports = {
	
	createRole: function (msg) {
		msg = msg.toLowerCase();

		switch (msg) {
			
			default:
				return ONRoles.find(r => r.name.toLowerCase() === msg);
				break;
								
			case "random":
				const ONTotalWeights = ONRoles.reduce((total, cur) => total + cur.weight, 0.0);
				let rand = Math.random() * ONTotalWeights;
				let role;
				
				for (i = 0; Math.sign(rand) === 1; i++) {
					rand = rand - ONRoles[i].weight;
					role = ONRoles[i];
				}
				return role;
				break;
		}
	}
}

const Team = require('./Teams.js');

const ONRoles = [

	Villager = {
		name: "Villager",
		team: Team.villager,
		intro: "You are a Villager! Now go find a wolf to kill.",
		order: 0,
		weight: 0.4,
		nightWait: false,
		max: 0.5,
		img: {
			url: "https://cdn.shopify.com/s/files/1/0740/4855/products/villager_2048x.png",
			height: 250,
			width: 200
		}
	},

	Seer = {
		name: "Seer",
		team: Team.villager,
		intro: "You are a Seer! Use your powers of divination to help the village kill a wolf.",
		order: 5,
		weight: 0.8,
		max: 1,
		nightWait: true,
		actions: [{
			msg: "Select one other player or two inactive roles to find out what they are.",
			targets: [{number: 1, type: "others"},
				{number: 2, type: "inactive"}],
			condition: "always",
			effect: "scry"
		}],
		img: {
			url: "https://cdn.shopify.com/s/files/1/0740/4855/products/seer_2048x.png",
			height: 250,
			width: 200
		}
	},

	Werewolf = {
		name: "Werewolf",
		team: Team.werewolf,
		intro: "You are a Werewolf! Don't let a werewolf die.",
		order: 2,
		weight: 10,
		max: 0.28,
		nightWait: true,
		awakeBehaviour: "wolf",
		actions: [{
			msg: "You are the only wolf! You may select an inactive role to be told about.",
			targets: [{number: 1, type: "inactive"}],
			condition: "one wolf",
			effect: "scry"
		}],
		img: {
			url: "https://cdn.shopify.com/s/files/1/0740/4855/products/werewolf_2048x.png",
			height: 250,
			width: 200
		}
	},
	
	Troublemaker = {
		name: "Troublemaker",
		team: Team.villager,
		intro: "You are a Troublemaker! Meddle with some roles and help track down a wolf to kill.",
		order: 7,
		weight: 2,
		max: 1,
		nightWait: true,
		actions: [{
			msg: "Select two other players to swap their roles.",
			targets: [{number: 2, type: "others"}],
			condition: "always",
			effect: "trouble"
		}],
		img: {
			url: "https://cdn.shopify.com/s/files/1/0740/4855/products/troublemaker_2048x.png",
			height: 250,
			width: 200
		}
	},
		
	Robber = {
		name: "Robber",
		team: Team.villager,
		intro: "You are a Robber! Steal someone's role and use your information to win.",
		order: 6,
		weight: 2,
		max: 1,
		nightWait: true,
		actions: [{
			msg: "Select another player. You will be told their role, then your role will be swapped with theirs.",
			targets: [{number: 1, type: "others"}],
			condition: "always",
			effect: "steal"
		}],
		img: {
			url: "https://cdn.shopify.com/s/files/1/0740/4855/products/robber_2048x.png",
			height: 250,
			width: 200
		}
	},
	
 	Hunter = {
		  name: "Hunter",
		  team: Team.villager,
		intro: "You are a Hunter! If you die, whoever you vote for will also die. Shoot that wolf!",
		order: 0,
		weight: 0.4,
		max: 1,
		nightWait: false,
		img: {
			url: "https://cdn.shopify.com/s/files/1/0740/4855/products/hunter_2048x.png",
			height: 250,
			width: 200
		}
	}, 
	
	Tanner = {
		name: "Tanner",
		team: Team.tanner,
		intro: "You are a Tanner! You must die at all costs!",
		order: 0,
		weight: 0.6,
		max: 1,
		nightWait: false,
		img: {
			url: "https://cdn.shopify.com/s/files/1/0740/4855/products/tanner_2048x.png",
			height: 250,
			width: 200
		}
	},

	Drunk = {
		name: "Drunk",
		team: Team.villager,
		intro: "You are a Drunk! Drunks want to kill wolves, but maybe you've just forgotten what you really are...",
		order: 8,
		weight: 0.3,
		max: 1,
		nightWait: true,
		actions: [{
			msg: "Select an inactive role. You will swap your role with whatever you pick, but you won't know what that is.",
			targets: [{number: 1, type: "inactive"}],
			condition: "always",
			effect: "drunk"
		}],
		img: {
			url: "https://cdn.shopify.com/s/files/1/0740/4855/products/drunk_2048x.png",
			height: 250,
			width: 200
		}
	},

	Insomniac = {
		name: "Insomniac",
		team: Team.villager,
		intro: "You are an Insomniac! You'll wake up at the end of the night and check yourself.",
		order: 9,
		weight: 310.4,
		max: 1,
		nightWait: true,
		awakeBehaviour: "insomniac",
		img: {
			url: "https://cdn.shopify.com/s/files/1/0740/4855/products/insomniac_2048x.png",
			height: 250,
			width: 200
		}
	},

	Minion = {
		name: "Minion",
		team: Team.werewolf,
		intro: "You are a Minion! The wolves don't know you but you want them to win. You'll happily give your life for their cause.",
		order: 3,
		weight: 0.7,
		max: 1,
		nightWait: true,
		awakeBehaviour: "minion",
		img: {
			url: "https://cdn.shopify.com/s/files/1/0740/4855/products/Minion_2048x.png",
			height: 250,
			width: 200
		}
	},

	Mason = {
		name: "Mason",
		team: Team.villager,
		intro: "You are a Mason! Work with your mason buddy to take down a wolf.",
		order: 4,
		weight: 0.2,
		max: 2,
		needs: 2,
		nightWait: true,
		awakeBehaviour: "mason",
		img: {
			url: "https://cdn.shopify.com/s/files/1/0740/4855/products/mason_2048x.png",
			height: 250,
			width: 200
		}
	},
	
	Sentinel = {
		name: "Sentinel",
		team: Team.villager,
		intro: "You are a Sentinel! Defend the village and kill a wolf.",
		order: 0,
		weight: 0.2,
		max: 1,
		nightWait: true,
		actions: [{
			msg: "Select another player. Nobody may look at or change this players role.",
			targets: [{number: 1, type: "others"}],
			condition: "always",
			effect: "sentinel"
		}],
		img: {
			url: "https://cdn.shopify.com/s/files/1/0740/4855/products/Sentinel_2048x.png",
			height: 250,
			width: 200
		}
	}
	
]