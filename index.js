// load env file (contains important keys)
require('dotenv').config();

const fs = require('fs');

const Client = require(`${process.cwd()}/struct/Client`);
const config = require(`${process.cwd()}/config`);

const client = new Client(config);

const options = {
  bypass: true,
  log: true,
  paths: [
    'action', 'anime', 'bot',
    'core', 'fun', 'moderation', 'music',
    'owner', 'setup', 'social','utility'
  ]
};

client.database?.init();

client.musicPlayer?.init();

client.loadCommands({ parent: 'commands', ...options });

client.loadEvents({ parent: 'events', ...options });

client.defineCollections([ 'discovery', 'economy', 'memes', 'xp' ]);

// let client listen to process events, setting ignore to true will
// ignore errors and not execute the functions from util/processEvents.js.
// Available process events on https://nodejs.org/api/process.html#process_process_events
// client.listentoProcessEvents([
//   'unhandledRejection',
//   'uncaughtException'
// ], { ignore: false });

client.login();
