const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// let rest;
// process.argv.forEach(arg => {
// 	if (arg === '--dev') {
// 		rest = new REST().setToken(devToken);
// 	} else if (arg === '--prod') {
// 		rest = new REST().setToken(prodToken);
// 	}
// });

// // Construct and prepare an instance of the REST module
// // const rest = new REST().setToken(token);

// // and deploy your commands!
// (async () => {
// 	try {
// 		console.log(`Started refreshing ${commands.length} application (/) commands.`);

// 		// The put method is used to fully refresh all commands in the guild with the current set
// 		const data = await rest.put(		
// 			Routes.applicationGuildCommands(clientId, guildId),
// 			// Routes.applicationCommands(clientId),
// 			{ body: commands },
// 		);

// 		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
// 	}
// 	catch (error) {
// 		// And of course, make sure you catch and log any errors!
// 		console.error(error);
// 	}
// })();

// Function to deploy commands
async function deployCommands(commands, token, clientId, guildId = 0) {
	const rest = new REST().setToken(token);

	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);

			let data;
			// The put method is used to fully refresh all commands in the guild with the current set
			if (guildId === 0) {
				data = await rest.put(
					Routes.applicationCommands(clientId),
					{ body: commands },
				);
			} else {
				data = await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: commands },
				);
			}

			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			// Catch and log any errors
			console.error(error);
		}
	})();
}
// Determine the environment and deploy commands accordingly
process.argv.forEach(arg => {
	if (arg === '--dev') {
		const { token, clientId, guildId } = require('./configDev.json');

		deployCommands(commands, token, clientId, guildId);
	} else if (arg === '--prod') {
		const { token, clientId, guildId } = require('./configProd.json');

		deployCommands(commands, token, clientId, guildId);
	} else if (arg === '--global'){
		const { token, clientId, guildId } = require('./configProd.json');

		deployCommands(commands, token, clientId, 0);
	}
});