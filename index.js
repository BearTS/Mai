// load env file (contains important keys)
require('dotenv').config();

const Client = require(`${process.cwd()}/struct/Client`);
const config = require(`${process.cwd()}/config`);

const client = new Client(config);

const options = {
  bypass: true,
  log: true,
  paths: [
    'action', 'anime', 'bot',
    'core', 'fun', 'games',
    'moderation', 'owner',
    'setup', 'social','utility'
  ]
};

if (client.database){
  client.database.init();
} else {
  // Do nothing..
};

client.loadCommands({ parent: 'commands', ...options });

client.loadEvents({ parent: 'events', ...options });

client.defineCollections([ 'discovery', 'memes', 'xp' ]);

// let client listen to process events, setting ignore to true will
// ignore errors and not execute the functions from util/processEvents.js.
// Available process events on https://nodejs.org/api/process.html#process_process_events
client.listentoProcessEvents([
  'unhandledRejection',
  'uncaughtException'
], { ignore: false });

client.login();
