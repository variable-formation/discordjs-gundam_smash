const {
	SlashCommandBuilder,
} = require('discord.js');

// Module exports for a Discord slash command.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite') // Set the command name to 'ping'.
        .setDescription('Generates an invite so that Gundam Smash! can be added to your server.'), // Set the command description.
    
    // Asynchronous function to be executed when the slash command is used.
    async execute(interaction) {
        interaction.reply({ content: "https://discord.com/api/oauth2/authorize?client_id=1170765354339942553&permissions=68608&scope=bot", ephemeral: true });
    }
};