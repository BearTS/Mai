const Client = require(`${process.cwd()}/struct/Client`);
const config = require(`${process.cwd()}/config`);

const client = new Client(config);

const options = {
  bypass: true,
  log: true,
  paths: [
    'action', 'anime', 'bot',
    'core', 'fun', 'moderation',
    'owner', 'setup', 'social','utility'
  ]
};

client.database?.init();

// Test errors on commands#load
client.loadCommands({ parent: 'commands', ...options });

// Test errors on events#load
client.loadEvents({ parent: 'events', ...options });

// Test errors on client#precollections
client.defineCollections([ 'discovery', 'economy', 'memes', 'xp' ]);
