module.exports.run = async (bot, message, args, tools, data) => {
	// Functions
	function getCommands(ne) {
		let modules = [];
		bot.commands.forEach(cmd => {
			modules.push(cmd.config.module.main);
		});
		modules = unique(modules);

		if (!config.staff.developers.includes(message.author.id)) {
			modules.splice(modules.indexOf('developer'), 1);
		}
		modules.forEach(md => {
			if (md === '') {
				return;
			}
			let subModules = [];
			bot.commands.forEach(cmd => {
				if (cmd.config.module.main === md) {
					subModules.push(cmd.config.module.sub);
				}
			});

			subModules = unique(subModules);
			let description;
			subModules.forEach(smd => {
				if (
					smd === 'hidden' &&
					!config.staff.developers.includes(message.author.id)
				) {
					return;
				} else if (description) {
					description =
						description +
						`\n${capitalize(smd)} \n> ${getSubCommands(md, smd).join(
							'     |     '
						)}`;
				} else {
					description = `${capitalize(smd)} \n> ${getSubCommands(md, smd).join(
						'     |     '
					)}`;
				}
			});
			ne.addField(`__${capitalize(md)}__`, description);
		});
	}

	function getSubCommands(md, smd) {
		let commands = [];
		bot.commands.forEach(cmd => {
			if (cmd.config.module.main == md) {
				if (cmd.config.module.sub == smd) {
					commands.push(cmd.config.cmd.main);
				} else {
					return;
				}
			} else {
				return;
			}
		});
		return commands;
	}

	const filter = (reaction, user) => {
		return reaction.emoji.name === '📑' && user.id === message.author.id;
	};
	// Variables
	const { discord, config, errorWarn, unique, capitalize } = tools;
	// Code
	const e = new discord.RichEmbed()
		.setTitle(`${config.info.bot.name}'s Command list`)
		.setDescription(
			'If you would like to get the full command list please click the :bookmark: reaction below to receive the dm with all the commands.'
		)
		.setColor(config.colors.main)
		.setFooter(
			"This message will delete it's self in 60 seconds, please react before then."
		);
	let msg = await message.channel.send(e);
	await msg.react('📑');

	msg
		.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
		.then(async collected => {
			const reaction = collected.first();
			if (message.channel.type !== 'dm') {
				message.delete();
			}
			msg.delete();
			if (reaction) {
				if (reaction.emoji.name === '📑') {
					const ne = new discord.RichEmbed()
						.setTitle(`${config.info.bot.name}'s Command list`)
						.setColor(config.colors.main);
					getCommands(ne);
					message.author.send(ne).catch(error => {
						return errorWarn(
							message,
							'Please allow messages from server members in your privacy tab in settings, to receive the command list.'
						);
					});
				} else {
					return;
				}
			} else {
				return;
			}
		});
};

module.exports.config = {
	cmd: {
		main: 'command-list',
		aliases: ['cmd-list']
	},
	info: {
		name: 'Command List',
		usage: 'command-list',
		aliases: 'cmd-list',
		description: 'List all the commands on the bot.'
	},
	module: {
		main: 'information',
		sub: 'bot'
	},
	settings: {
		dm: true,
		restrictions: 0, // 0 - Everyone, 1 - Admin, 2 - Guild Owner, 3 - Dev Team
		premium: false,
		permissions: {
			bot: ['SEND_MESSAGES'],
			user: []
		}
	}
};
