// Import the Events object from the discord.js library.
const { Events } = require('discord.js');

// Module exports for an event handler.
module.exports = {
    name: Events.ClientReady, // Specify the name of the event to handle (in this case, ClientReady).
    once: true, // Indicate that this event should only be handled once.

    // Function to be executed when the specified event is triggered.
    execute(client) {
        // Log a message to the console indicating the bot is ready and displaying its tag.
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
