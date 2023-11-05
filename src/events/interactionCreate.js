// Import the Events object from the discord.js library.
const { Events } = require('discord.js');

// Module exports for an event handler.
module.exports = {
    name: Events.InteractionCreate, // Specify the name of the event to handle (in this case, InteractionCreate).

    // Asynchronous function to be executed when the specified event is triggered.
    async execute(interaction) {
        // Check if the interaction is a slash command (chat input command).
        if (interaction.isChatInputCommand()) {
            // Retrieve the command object from the collection of commands using the command name.
            const command = interaction.client.commands.get(interaction.commandName);

            // If no command matches the interaction command name, log an error and exit.
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            // Try to execute the command associated with the interaction.
            try {
                await command.execute(interaction);
            } catch (error) { // Catch and log any errors that occur during command execution.
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        }
    },
};
