// Import required modules.
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Initialize a new Discord client instance with the specified intents.
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Initialize a new collection to store commands.
client.commands = new Collection();

// Define the path where the command folders are located.
const foldersPath = path.join(__dirname, 'commands');
// Read the directories (command folders) within the specified path.
const commandFolders = fs.readdirSync(foldersPath);

// Iterate through each folder in the command folders.
for (const folder of commandFolders) {
	// Define the path for each command folder.
	const commandsPath = path.join(foldersPath, folder);
	// Read all JavaScript files within the command folder.
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	// Iterate through each command file.
	for (const file of commandFiles) {
		// Define the full path for each command file.
		const filePath = path.join(commandsPath, file);
		// Require (import) the command module.
		const command = require(filePath);
		
		// Check if the command has the required 'data' and 'execute' properties.
		if ('data' in command && 'execute' in command) {
			// Add the command to the client's command collection.
			client.commands.set(command.data.name, command);
		}
		else {
			// Log a warning if the command file is missing required properties.
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Define the path where the event files are located.
const eventsPath = path.join(__dirname, 'events');
// Read all JavaScript files within the events folder.
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Iterate through each event file.
for (const file of eventFiles) {
	// Define the full path for each event file.
	const filePath = path.join(eventsPath, file);
	// Require (import) the event module.
	const event = require(filePath);
	
	// Check if the event should be handled once or multiple times.
	if (event.once) {
		// Handle the event once if specified.
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		// Handle the event multiple times (every time it occurs).
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log the client in using the specified token from the config file.
client.login(token);