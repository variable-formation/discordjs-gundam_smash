const {
	SlashCommandBuilder,
} = require('discord.js');

// Module exports for a Discord slash command.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping') // Set the command name to 'ping'.
        .setDescription('Replies with Pong!'), // Set the command description.

    // Asynchronous function to be executed when the slash command is used.
    async execute(interaction, client) {
        // Send an initial reply to the user interaction and make it visible only to the user (ephemeral).
        await interaction.reply({ content: '...Pinging!', ephemeral: true }).then(i => {
            // Edit the initial reply to include the bot and API latency times.
            i.edit("🏓 Pong!\n" + '```' + `Bot Latency: ${i.createdTimestamp - interaction.createdTimestamp}ms.\nAPI Latency: ${interaction.client.ws.ping}ms.` + "```");
        });
    }
};