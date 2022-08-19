'use strict';

const { readdirSync } = require('fs');
const { join } = require('path');
const { Collection, SlashCommandBuilder } = require('discord.js');

const { error, info, warn, styles, colors: { foreground: cf }} = require('../utils/console.js');

module.exports = class Commands {
    constructor(client){
        const dir = join(__dirname, '../commands/');

        this.client = client;
        this.cache = new Collection();

        console.info(info, 'Reading Commands on', dir);
        try {
            if (readdirSync(dir).length){
                for (const command of readdirSync(dir)){
                    if (command.split('.').pop() !== 'js'){
                        console.warn(warn, 'InvalidFileType', `Skipping '${cf.cyan}${command}${styles.reset}' as it is not a valid javascrip file!`);
                        continue;
                    };

                    let file;
                    try {
                        file = require(join(dir, command));
                    } catch (e) {
                        console.error(error, 'CommandReadError', e.message, 'at' ,e.stack.split(/\r|\n/)[0]);
                        continue;
                    };

                    const Command = file.builder;

                    if (!Command || !(Command instanceof SlashCommandBuilder)){
                        console.warn(warn, 'MissingRequiredData', `Skipping '${cf.red}${command}${styles.reset}' as it has no known builder!`)
                        continue;
                    };

                    if (!Command.name || !Command.description){
                        console.warn(warn, 'MissingRequiredData', `Skipping '${cf.red}${command}${styles.reset}' as it is missing a name or description!`);
                        continue;
                    };

                    this.cache.set(Command.name, file);
                };
                console.info(info, 'Loaded', this.cache.size, 'commands to cache, skipping', readdirSync(dir).length - this.cache.size, 'file(s)!');
            } else {
                console.warn(warn, `MissingFiles`, `No files found on 'commands' folder!`)
            };
        } catch (e) {
            console.error(error, 'CommandReadError', e.message);
            process.exit(1);
        };


        // handler
        this.client.on('interactionCreate', interaction => {
            if (!interaction.isCommand()) return;

            try {
                return this.evoke(interaction);
            } catch (e) {
                console.error(error, 'ApplicationCommandEvokeError', e.message, /*e.stack*/) // <-- e.stack = debug purposes
            };
        });
    };

    evoke(interaction){
        const Command = this.cache.get(interaction.commandName);
        if (!Command) throw new Error(`Cannot find command '${interaction.commandName}' on local cache.`);
        return Command.run(this.client, interaction);
    };

    // commands with owner property will always be ignored unless specified otherwise
    deploy(GuildResolvable, filter = prop => !prop.owner){
        return this.applicationCommands.set(this.cache.filter(filter).map(x => x.builder), this.client.guilds.resolveId(GuildResolvable));
    };

    reset(){
        return this.applicationCommands.set([]);
    };

    // <BaseClient>#application#commands          --> discord.js application commands manager
    // <BaseClient>#commands#applicationCommands  --> same thing but <BaseClient>#commands has local cache
    get applicationCommands(){
        return this.client.application.commands;
    };
    get applicationCommandsCache(){
        return this.applicationCommands.cache;
    };
};
