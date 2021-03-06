module.exports.run = async (bot, message, args, tools, data) => {
	// Variables
	const { config, discord, superagent } = tools;
	// Code
	let image = await superagent.get('https://randomfox.ca/floof');
	const e = new discord.RichEmbed()
		.setTitle('Random Fox!')
		.setColor(config.colors.secondary)
		.setImage(image.body.image);
	message.channel.send(e);
};

module.exports.config = {
	cmd: {
		main: 'fox',
		aliases: []
	},
	info: {
		name: 'Fox',
		usage: 'fox',
		aliases: '',
		description: 'Get a random picture of a fox.'
	},
	module: {
		main: 'images',
		sub: 'animals'
	},
	settings: {
		dm: false,
		restrictions: 0, // 0 - Everyone, 1 - Admin, 2 - Guild Owner, 3 - Dev Team
		premium: false,
		permissions: {
			bot: ['SEND_MESSAGES'],
			user: []
		}
	}
};
