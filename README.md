# discordjs-gundam_smash

Welcome to `discordjs-gundam_smash`, the source code for the `Gundam Smash!` Discord bot.

## Author
This repository is maintained by [variable-formation](https://github.com/variable-formation).

## Description
Gundam Smash! is a Discord bot built with discord.js. It contains a game called "Gundam Smash!"

## Repository Structure
```
discordjs-gundam_smash
├── LICENSE
├── changelogs
│ └── 1-0-0-beta.md
├── package-lock.json
├── package.json
└── src
├── commands
│ ├── game
│ │ ├── gundams.json
│ │ ├── mobile_weapons.db
│ │ ├── mobile_weapons.json
│ │ └── smash.js
│ └── utility
│ └── ping.js
├── events
│ ├── interactionCreate.js
│ └── ready.js
├── index.js
└── register-commands.js
```


## Dependencies
This project has the following primary dependencies:
- `discord.js` version ^14.13.0
- `sqlite3` version ^5.1.6

You can view the full list of dependencies in the [package.json](./package.json) file.

## Setup
1. Clone the repository to your local machine.
2. Navigate to the repository directory and run `npm install` to install the necessary dependencies.
3. Configure your bot token and other necessary environment variables.
4. Start the bot using `npm start`.

## License
This project is licensed under the `Unlicense`. For more information, see the [LICENSE](./LICENSE) file.

## Contributing
If you'd like to contribute, feel free to fork the repository, make your changes, and submit a pull request. If you have any questions, don't hesitate to reach out!


Check out the support server [here](https://discord.gg/Vdd5r7sq)!
