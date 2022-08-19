'use strict';

const { error, warn, info, success } = require('./utils/console.js');
for (const errorEvent of ['uncaughtException', 'unhandledRejection', 'rejectionHandled']){
    process.on(errorEvent, err => {
        switch(err.code){
            case 'MODULE_NOT_FOUND':
                console.error(error, 'MissingDependency', `${err.message.split('\n')[0]}. Please install required dependencies via 'npm install <package-name>'`);
                break;
            default: console.error(error, err.code || err.name, err.stack)
        };
    });
};

require('dotenv').config();
require('moment-duration-format');
require('moment-timezone');

const Client = require('./structures/Client.js');

const { join } = require('path');
const { readdirSync } = require('fs');
const { registerFont } = require('canvas');
const { GatewayIntentBits, Partials } = require('discord.js');

/** FONT REGISTRATION BLOCK ====>
 * Registers the fonts stored at assets/fonts to be used by
 * the canvas module throughout the project
 */
const fontCollection = readdirSync(join(__dirname, 'assets/fonts'));
for (const font of fontCollection) {
    const [ family, weight ] = font.split(/.(t|o)tf/i)[0].split(' ');
    registerFont(join(__dirname, 'assets/fonts', font), {
        family: family.split('-').join(' '),
        weight: weight?.toLowerCase()
    });
    continue;
};

/**
 * Instantiation of Client
 * @type {Client}
 * @desc Only use required and permitted GatewayIntent and Partials
 * Comment out lines which are not needed. Please refer to the
 * official documentation which intent/partials does what.
 */
const client = new Client({
    partials: [
        // Partials.User,
        // Partials.Channel,
        // Partials.GuildMember,
        Partials.Message,
        // Partials.Reaction,
        // Partials.GuildScheduledEvent,
        // Partials.ThreadMember
    ],
    intents: [
        GatewayIntentBits.Guilds,
        // GatewayIntentBits.GuildMembers,
        // GatewayIntentBits.GuildBans,
        // GatewayIntentBits.GuildEmojisAndStickers,
        // GatewayIntentBits.GuildIntegrations,
        // GatewayIntentBits.GuildWebhooks,
        // GatewayIntentBits.GuildInvites,
        // GatewayIntentBits.GuildVoiceStates,
        // GatewayIntentBits.GuildPresences,
        // GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.GuildMessageReactions,
        // GatewayIntentBits.GuildMessageTyping,
        // GatewayIntentBits.DirectMessages,
        // GatewayIntentBits.DirectMessageReactions,
        // GatewayIntentBits.DirectMessageTyping,
        // GatewayIntentBits.MessageContent,
        // GatewayIntentBits.GuildScheduledEvents
    ]
});

client.login();
