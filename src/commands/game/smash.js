const {
    EmbedBuilder,
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const mobile_weapons = require('./mobile_weapons.json');

const db = new sqlite3.Database('src/commands/game/mobile_weapons.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});

/**
 * Generates a random integer between 0 and the specified maximum value, inclusive.
 *
 * @param {number} max - The maximum value in the range for the random number generation. 
 *                       The generated number will be between 0 and max, inclusive.
 * @returns {number} A random integer between 0 and max, inclusive.
 *
 * @description
 * This function utilizes the Math.random() function to generate a random number between 0 (inclusive)
 * and 1 (exclusive), and then scales it to the desired range by multiplying it with (max + 1).
 * The use of Math.floor() ensures the result is rounded down to the nearest whole number, 
 * providing an integer within the specified range.
 *
 * Note: The random number generation is pseudo-random and not suitable for cryptographic purposes.
 *
 * Example usage:
 * let randomNumber = randomNum(10);
 * console.log(randomNumber);
 *
 * Example output (may vary due to randomness):
 * 7
 */
function randomNum(max) {
    // Generate a pseudo-random number between 0 (inclusive) and 1 (exclusive).
    // Scale the number to the desired range (0 to max, inclusive).
    // Use Math.floor() to round down to the nearest whole number.
    return Math.floor(Math.random() * (max + 1));
}

/**
 * Selects a random mobile weapon from a collection of mobile weapons described in a JSON array.
 *
 * @param {Array} jsonFile - An array of objects, each representing a mobile weapon with a title and an array of images.
 * @returns {Object} An object containing the name and an array of images of the randomly selected weapon.
 * 
 * @description
 * Each object in the input JSON array must contain at least two properties:
 * - `title`: a string representing the name of the mobile weapon
 * - `images`: an array of strings, each representing a path to an image associated with the mobile weapon
 *
 * The function calculates the total number of mobile weapons in the input JSON array, generates a random
 * index using the `randomNum` function, and then retrieves the mobile weapon's name and array of images 
 * based on this random index.
 *
 * Example input structure:
 * [
 *   { "title": "GN-001 Exia", "images": ["exia_front.png", "exia_back.png"] },
 *   { "title": "GN-002 Dynames", "images": ["dynames_front.png", "dynames_back.png"] },
 *   ...
 * ]
 *
 * Example usage:
 * let weaponsJson = [
 *   { "title": "GN-001 Exia", "images": ["exia_front.png", "exia_back.png"] },
 *   { "title": "GN-002 Dynames", "images": ["dynames_front.png", "dynames_back.png"] },
 *   ...
 * ];
 *
 * let selectedGundam = pickMobileWeapon(gundamsJson);
 * console.log(selectedGundam);
 *
 * Example output (may vary due to randomness):
 * { name: "GN-001 Exia", images: ["exia_front.png", "exia_back.png"] }
 */
function pickMobileWeapon(jsonFile) {
    // Calculate the total number of weapons in the input JSON array.
    let count = jsonFile.length;

    // Generate a random index based on the number of weapons.
    let num = randomNum(count - 1);

    // Retrieve the weapon's name and array of images using the random index.
    let name = jsonFile[num].title;
    let images = jsonFile[num].images;

    // Return an object containing the name and array of images of the randomly selected weapon.
    return { name, images };
}

/**
 * Creates a series of Discord embeds for a set of images, each with a custom title and description.
 *
 * @param {string} name - The name to be included in the title of each embed.
 * @param {Array} images - An array of image URLs to be individually embedded.
 *
 * @returns {Array<EmbedBuilder>} An array of Discord embed objects, one for each image.
 *
 * @description
 * This function iterates over an array of image URLs and creates a Discord embed for each one using 
 * the EmbedBuilder class from the Discord.js library. Each embed is configured with a title 
 * incorporating the provided name, a description indicating the sequence number of the image, 
 * and the image URL itself. The function returns an array of these embed objects, which can be used 
 * to display rich media messages in a Discord bot application.
 *
 * The EmbedBuilder class is a utility from the Discord.js library that simplifies the creation of
 * embed objects for messages in Discord. It provides a fluent interface for setting various properties
 * like title, description, and images.
 *
 * Example usage:
 * const embeds = createEmbeds("Crystal Sword", [
 *   "http://example.com/image1.png",
 *   "http://example.com/image2.png"
 * ]);
 *
 * Example output (simplified representation of embed objects):
 * [
 *   { title: "Would you smash the Crystal Sword?", description: "Page 1 of 2", image: "http://example.com/image1.png" },
 *   { title: "Would you smash the Crystal Sword?", description: "Page 2 of 2", image: "http://example.com/image2.png" }
 * ]
 */
function createEmbeds(name, images) {
    let embeds = [];
    for (image in images) {
        // Instantiate a new EmbedBuilder object from the Discord.js library and set the title, description, and image.
        let embed = new EmbedBuilder()
            .setTitle(`Would you smash the ${name}?`)
            .setDescription(`Page ${parseInt(image) + 1} of ${images.length}`)
            .setImage(images[image]);

        // Add the configured embed object to the list of embeds.
        embeds.push(embed);
    }
    // Return the array of configured embed objects.
    return embeds;
}

/**
 * Asynchronously updates the number of 'smashes' or 'passes' for a given weapon in the database.
 *
 * @param {string} nameLower - The name of the weapon, in lowercase, to be updated in the database.
 * @param {string} voteType - The type of vote to increment. Should be either 'smash' or 'pass'.
 *
 * @returns {Promise} A promise that resolves if the update is successful, or rejects with an error if not.
 *
 * @description
 * This function constructs an SQL query to update the 'SMASHES' or 'PASSES' column in the 'MOBILE_WEAPONS'
 * table of the database for a specific mobile weapon, identified by its name. The function accepts the name
 * of the weapon in lowercase and the type of vote ('smash' or 'pass') to increment. It returns a promise
 * that is resolved upon successful update, or rejected if an error occurs during the database operation.
 *
 * This function assumes the existence of a global `db` object with a `run` method that executes SQL
 * queries against the database. The `db.run` method is assumed to follow the Node.js error-first
 * callback convention.
 *
 * Example usage:
 * await updateDatabase('laser_sword', 'smash')
 *   .then(() => console.log('Database updated successfully'))
 *   .catch(err => console.error('Database update failed:', err));
 */
async function updateDatabase(nameLower, voteType) {
    let updateSQL;
    if (voteType === "smash") {
        updateSQL = `UPDATE MOBILE_WEAPONS SET SMASHES = SMASHES + 1 WHERE NAME = ?`;
    } else if (voteType === "pass") {
        updateSQL = `UPDATE MOBILE_WEAPONS SET PASSES = PASSES + 1 WHERE NAME = ?`;
    }
    return new Promise((resolve, reject) => {
        db.run(updateSQL, [nameLower], function (err) {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * Asynchronously retrieves the number of 'smashes' and 'passes' for a given weapon from the database.
 *
 * @param {string} nameLower - The name of the weapon, in lowercase, for which to retrieve the data.
 *
 * @returns {Promise<Object>} A promise that resolves with an object containing the 'smashes' and 'passes' counts,
 *                            or rejects with an error if the retrieval fails.
 *
 * @description
 * This function constructs an SQL query to select the 'SMASHES' and 'PASSES' columns from the 'MOBILE_WEAPONS'
 * table of the database for a specific weapon, identified by its name. It returns a promise that, upon successful
 * retrieval of data, resolves with an object containing the 'smashes' and 'passes' counts. If there's an error
 * during the database operation, the promise is rejected with that error.
 *
 * The function assumes the existence of a global `db` object with a `get` method that executes SQL
 * queries against the database and retrieves a single row. The `db.get` method is assumed to follow
 * the Node.js error-first callback convention.
 *
 * Example usage:
 * await getSmashesAndPasses('laser_sword')
 *   .then(data => console.log('Smashes:', data.smashes, 'Passes:', data.passes))
 *   .catch(err => console.error('Database retrieval failed:', err));
 */
async function getSmashesAndPasses(nameLower) {
    const getSmashesAndPassesSQL = `SELECT SMASHES, PASSES FROM MOBILE_WEAPONS WHERE NAME = ?`;

    return new Promise((resolve, reject) => {
        db.get(getSmashesAndPassesSQL, [nameLower], (err, row) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                const smashes = row.SMASHES;
                const passes = row.PASSES;
                resolve({ smashes, passes });
            }
        });
    });
}

/**
 * Asynchronously retrieves the number of 'smashes' and 'passes' for a given weapon from the database.
 *
 * @param {string} nameLower - The name of the weapon, in lowercase, for which to retrieve the data.
 *
 * @returns {Promise<Object>} A promise that resolves with an object containing the 'smashes' and 'passes' counts,
 *                            or rejects with an error if the retrieval fails.
 *
 * @description
 * This function constructs an SQL query to select the 'SMASHES' and 'PASSES' columns from the 'MOBILE_WEAPONS'
 * table of the database for a specific weapon, identified by its name. It returns a promise that, upon successful
 * retrieval of data, resolves with an object containing the 'smashes' and 'passes' counts. If there's an error
 * during the database operation, the promise is rejected with that error.
 *
 * The function assumes the existence of a global `db` object with a `get` method that executes SQL
 * queries against the database and retrieves a single row. The `db.get` method is assumed to follow
 * the Node.js error-first callback convention.
 *
 * Example usage:
 * await getSmashesAndPasses('laser_sword')
 *   .then(data => console.log('Smashes:', data.smashes, 'Passes:', data.passes))
 *   .catch(err => console.error('Database retrieval failed:', err));
 */
async function getSmashesAndPasses(nameLower) {
    const getSmashesAndPassesSQL = `SELECT SMASHES, PASSES FROM MOBILE_WEAPONS WHERE NAME = ?`;

    return new Promise((resolve, reject) => {
        db.get(getSmashesAndPassesSQL, [nameLower], (err, row) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                const smashes = row.SMASHES;
                const passes = row.PASSES;
                resolve({ smashes, passes });
            }
        });
    });
}


// Module exports for a Discord slash command.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('smash') // Set the command name to 'smash'.
        .setDescription('Would you smash this Gundam?'), // Set the command description.

    // Asynchronous function to be executed when the slash command is used.
    async execute(interaction) {
        // Pick a random Mobile Weapon and get its name and images.
        let { name, images } = pickMobileWeapon(mobile_weapons);
        let nameLower = name.toLowerCase(); // Convert the name to lower case.

        // Create embeds for the Mobile Weapon.
        let embeds = createEmbeds(name, images);
        let embedsLength = embeds.length; // Get the number of embeds created.
        let resultsEmbed = new EmbedBuilder(); // Create a new embed builder for the results.

        // Generate custom IDs for the buttons.
        let smashButtonId = `${nameLower}-smash`;
        let passButtonId = `${nameLower}-pass`;
        const PAGE_BACK_BUTTON_ID = 'page-back';
        const PAGE_FORWARD_BUTTON_ID = 'page-forward';
        const AGAIN_BUTTON_ID = 'again';
        const QUIT_BUTTON_ID = 'quit';

        // Initialize variables for the result, number of smashes, and passes.
        let result = "";
        let smashes = 0;
        let passes = 0;

        // Create button builders for the 'smash' and 'pass' options.
        let smashButton = new ButtonBuilder()
            .setCustomId(smashButtonId)
            .setLabel('Smash')
            .setStyle(ButtonStyle.Success);

        let passButton = new ButtonBuilder()
            .setCustomId(passButtonId)
            .setLabel('Pass')
            .setStyle(ButtonStyle.Danger);

        // Create button builders for navigation and game actions.
        const BACK_BUTTON = new ButtonBuilder()
            .setCustomId(PAGE_BACK_BUTTON_ID)
            .setLabel("Previous Page")
            .setEmoji("◀️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true); // Initially disabled.

        const FORWARD_BUTTON = new ButtonBuilder()
            .setCustomId(PAGE_FORWARD_BUTTON_ID)
            .setLabel("Next Page")
            .setEmoji("▶️")
            .setStyle(ButtonStyle.Primary);

        const AGAIN_BUTTON = new ButtonBuilder()
            .setCustomId(AGAIN_BUTTON_ID)
            .setLabel('Play Again')
            .setStyle(ButtonStyle.Success);

        const QUIT_BUTTON = new ButtonBuilder()
            .setCustomId(QUIT_BUTTON_ID)
            .setLabel('Quit')
            .setStyle(ButtonStyle.Danger);

        // Create an action row for the game action buttons.
        const gameActions = new ActionRowBuilder()
            .setComponents(BACK_BUTTON.setDisabled(false), AGAIN_BUTTON, QUIT_BUTTON, FORWARD_BUTTON.setDisabled(false));

        // Create an action row for the voting action buttons.
        const voteActions = new ActionRowBuilder();
        if (embedsLength > 1) {
            voteActions.setComponents(BACK_BUTTON, smashButton, passButton, FORWARD_BUTTON);
        } else {
            voteActions.setComponents(BACK_BUTTON.setDisabled(true), smashButton, passButton, FORWARD_BUTTON.setDisabled(true));
        }

        // Defer the reply to the user interaction.
        let response = await interaction.deferReply({
            ephemeral: true, // Make the response visible only to the user.
        });

        // Edit the deferred reply with the initial game message.
        response = await interaction.editReply({
            content: ":eyes:", // Content of the message.
            embeds: [embeds[0]], // Display the first embed.
            components: [voteActions], // Include the voting action buttons.
            fetchReply: true // Fetch the reply for potential further use.
        });

        // Define a filter function for the message component collector.
        // This function will determine which interactions should be collected based on customId and user ID.
        const filter = (i) => [
            PAGE_BACK_BUTTON_ID,       // ID for the 'back' button.
            PAGE_FORWARD_BUTTON_ID,    // ID for the 'forward' button.
            AGAIN_BUTTON_ID,           // ID for the 'again' button.
            QUIT_BUTTON_ID,            // ID for the 'quit' button.
            smashButtonId,             // Dynamically generated ID for the 'smash' button.
            passButtonId,              // Dynamically generated ID for the 'pass' button.
        ].includes(i.customId) && i.user.id === interaction.user.id; // Check if the interaction customId is one of the specified IDs and if the interaction was initiated by the same user.

        // Create a message component collector to handle button interactions.
        const collector = response.createMessageComponentCollector({
            filter: filter,                 // Use the defined filter function to filter interactions.
            componentType: ComponentType.Button, // Specify that we're collecting button interactions.
            time: 30_000,                  // Set the time in milliseconds before the collector automatically stops (15 seconds).
            idle: 30_000,                  // Set the idle time in milliseconds before the collector stops due to inactivity (15 seconds).
            dispose: true,                 // If set to true, 'dispose' events will be emitted when a user interacts with a component, removing it from the collector.
        });

        // Initialize the current page index.
        let currentPage = 0;

        // Event listener for the 'collect' event, which is emitted whenever a new interaction is collected.
        collector.on('collect', async (i) => {
            // Reset the collector's timer whenever a new interaction is collected.
            // This ensures the collector remains active as long as there's user interaction.
            collector.resetTimer({
                time: 30_000,   // Reset the time to 15 seconds.
                idle: 30_000,   // Reset the idle time to 15 seconds.
            });
            // Check if the user clicked the 'back' button and is on the second page.
            if (i.customId === PAGE_BACK_BUTTON_ID && currentPage === 1) {
                currentPage--; // Decrement the current page index.

                // Disable the 'back' button as the user is now on the first page, and enable the 'forward' button.
                voteActions.components[0].setDisabled(true);
                voteActions.components[3].setDisabled(false);

                // Update the interaction to show the previous page's embed.
                await i.update({
                    content: ":eyes:",
                    embeds: [embeds[currentPage]],
                    components: [voteActions],
                });
            } else if (i.customId === PAGE_FORWARD_BUTTON_ID && currentPage === (embedsLength - 2)) {
                currentPage++; // Increment the current page index.

                // Enable the 'back' button and disable the 'forward' button as the user is now on the last page.
                voteActions.components[0].setDisabled(false);
                voteActions.components[3].setDisabled(true);

                // Update the interaction to show the next page's embed.
                await i.update({
                    content: ":eyes:",
                    embeds: [embeds[currentPage]],
                    components: [voteActions],
                });
            } else if ((i.customId === PAGE_BACK_BUTTON_ID || i.customId === PAGE_FORWARD_BUTTON_ID) && currentPage >= 0 && currentPage < embedsLength - 1) {
                // If the user clicked either 'back' or 'forward' button and is not on the first or last page.
                if (i.customId === PAGE_BACK_BUTTON_ID) {
                    currentPage--; // Decrement the current page index.
                } else if (i.customId === PAGE_FORWARD_BUTTON_ID) {
                    currentPage++; // Increment the current page index.
                }

                // Enable both 'back' and 'forward' buttons as the user is now in-between pages.
                voteActions.components[0].setDisabled(false);
                voteActions.components[3].setDisabled(false);

                // Update the interaction to show the current page's embed.
                await i.update({
                    content: ":eyes:",
                    embeds: [embeds[currentPage]],
                    components: [voteActions],
                });
            };


            // Check if the interaction custom ID matches the 'smash' button ID.
            if (i.customId === smashButtonId) {
                try {
                    // Attempt to update the database to register a 'smash' vote.
                    await updateDatabase(nameLower, "smash");
                } catch (err) {
                    // If there's an error during the database update, log it and update the interaction to show an error message.
                    console.error(`DATABASE UPDATE ERROR: ${err.message}`);
                    await i.update({
                        content: "Something went wrong! Please try again later.",
                        components: [],
                        embeds: [],
                    });

                    // Stop the collector due to the error and set the play flag to false.
                    collector.stop("error");
                }

                // Retrieve the updated smashes and passes count for the current item from the database.
                result = await getSmashesAndPasses(nameLower);
                smashes = result.smashes;
                passes = result.passes;

                // Disable the game action buttons after voting.
                gameActions.components[0].setDisabled(true);
                gameActions.components[3].setDisabled(true);

                // Update the results embed with the voting results and current item image.
                resultsEmbed.setTitle(`Here's how other people voted on the ${name}!`);
                resultsEmbed.setFields(
                    {
                        name: "🟢 Smashes",
                        value: `${smashes}`,
                        inline: true,
                    },
                    {
                        name: "🔴 Passes",
                        value: `${passes}`,
                        inline: true,
                    },
                );
                resultsEmbed.setImage(images[currentPage]);

                // Update the interaction to show the user's vote and the results embed.
                await i.update({
                    content: "You voted smash!",
                    embeds: [resultsEmbed],
                    components: [gameActions],
                });
            } else if (i.customId === passButtonId) {
                try {
                    // Attempt to update the database to register a 'pass' vote.
                    await updateDatabase(nameLower, "pass");
                } catch (err) {
                    // If there's an error during the database update, log it and update the interaction to show an error message.
                    console.error(`DATABASE UPDATE ERROR: ${err.message}`);
                    await i.update({
                        content: "Something went wrong! Please try again later.",
                        components: [],
                        embeds: [],
                    });

                    // Stop the collector due to the error.
                    collector.stop("error");
                }

                // Retrieve the updated smashes and passes count for the current item from the database.
                result = await getSmashesAndPasses(nameLower);
                smashes = result.smashes;
                passes = result.passes;

                // Disable the game action buttons after voting.
                gameActions.components[0].setDisabled(true);
                gameActions.components[3].setDisabled(true);

                // Update the results embed with the voting results and current item image.
                resultsEmbed.setTitle(`Here's how other people voted on the ${name}!`);
                resultsEmbed.setFields(
                    {
                        name: "🟢 Smashes",
                        value: `${smashes}`,
                        inline: true,
                    },
                    {
                        name: "🔴 Passes",
                        value: `${passes}`,
                        inline: true,
                    },
                );
                resultsEmbed.setImage(images[currentPage]);

                // Update the interaction to show the user's vote and the results embed.
                await i.update({
                    content: "You voted pass!",
                    embeds: [resultsEmbed],
                    components: [gameActions],
                });
            }


            // Check the custom ID of the interaction to determine the action.
            if (i.customId === AGAIN_BUTTON_ID) {
                // Reset the current page index.
                currentPage = 0;

                // Randomly pick a new mobile weapon from the array of mobile weapons.
                result = pickMobileWeapon(mobile_weapons);
                // Extract the name and images of the picked weapon.
                name = result.name;
                images = result.images;
                // Convert the weapon name to lowercase for consistent ID handling.
                nameLower = name.toLowerCase();

                // Create Discord embeds for each image associated with the picked weapon.
                embeds = createEmbeds(name, images);
                // Store the total number of embeds created.
                embedsLength = embeds.length;

                // Set custom IDs for the 'smash' and 'pass' buttons using the weapon name.
                smashButtonId = `${nameLower}-smash`;
                passButtonId = `${nameLower}-pass`;

                // Update the 'smash' and 'pass' buttons with the new custom IDs.
                smashButton.setCustomId(smashButtonId);
                passButton.setCustomId(passButtonId);

                // Disable navigation buttons if there is only one embed, enable otherwise.
                if (embedsLength > 1) {
                    voteActions.components[0].setDisabled(true);
                    voteActions.components[3].setDisabled(false);
                } else {
                    voteActions.components[0].setDisabled(true);
                    voteActions.components[3].setDisabled(true);
                }

                // Update the interaction with the first embed and updated components.
                await i.update({
                    content: ":eyes:",
                    embeds: [embeds[0]],
                    components: [voteActions],
                });
            } else if (i.customId === QUIT_BUTTON_ID) {
                // If the 'Quit' button was pressed, update the interaction to show a farewell message.
                await i.update({
                    content: "Thanks for playing!",
                    embeds: [],
                    components: [],
                });

                // Stop the collector with the reason 'quit'.
                collector.stop("quit");
            }
        });

        // Set up a 'collector' event listener for the 'end' event.
        collector.on('end', () => {
            // Initialize a variable to hold the message content that will be used to edit the interaction reply.
            let messageContent;

            // Determine the message content based on the reason the collector ended.
            switch (collector.endReason) {
                case 'time':
                    // When the collector ends due to time expiration.
                    messageContent = "You've timed out!";
                    break;
                case 'idle':
                    // When the collector ends due to inactivity.
                    messageContent = "You've timed out!";
                    break;
                case 'error':
                    // When the collector ends due to an error.
                    messageContent = "There's been an error! Please try again later.";
                    break;
                default:
                    // Default message when the collector ends without any of the specified reasons.
                    messageContent = "Thanks for playing!";
            }

            // Edit the original interaction reply with the determined message content.
            interaction.editReply({ content: messageContent, components: [] })
                .then(() => console.log(`Collector Stopped: ${collector.endReason}`)) // Log the reason the collector stopped.
                .catch(console.error); // Catch and log any errors that occur during the interaction edit.
        });
    }
};
