module.exports = async (bot, message, svr) => {
	const { userGuildStrut, userGlobalStrut, config } = bot.tools;
	let public = {},
		server = {};

	/* GLOBAL */
	try {
		public = await userGlobalStrut.findOne({ id: message.author.id });
	} catch (err) {
		console.log(err);
	}

	if (public == undefined || public == null) {
		let newConfig = new userGlobalStrut({
			id: message.author.id,
			name: message.author.username,
			review: [],
			crystals: 0,
			premium: {
				end: 0,
				original: 0,
				purchased: []
			}
		});
		newConfig.save();
		public = newConfig;
	}

	/* GUILD */
	if (message.channel.type !== 'dm') {
		try {
			server = await userGuildStrut.findOne({
				id: message.author.id,
				guild: message.guild.id
			});
		} catch (err) {
			console.log(err);
		}

		if (server == undefined || server == null) {
			let newConfig = new userGuildStrut({
				id: message.author.id,
				name: message.author.username,
				guild: message.guild.id,
				eco: {
					cash: parseInt(svr.main.economy.default.cash),
					bank: parseInt(svr.main.economy.default.bank),
					net:
						parseInt(svr.main.economy.default.cash) +
						parseInt(svr.main.economy.default.bank)
				},
				level: {
					xp: 0,
					level: 0
				}
			});
			newConfig.save();
			server = newConfig;
		}
		let data = { global: public, guild: server };
		return data;
	} else {
		let data = { global: public };
		return data;
	}
};
