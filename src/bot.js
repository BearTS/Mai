const { readdirSync } = require('fs');
const { join } = require('path');

for (const file of readdirSync(join(__dirname, 'struct/Extends'))){
  require(join(__dirname, 'struct/Extends', file))
};

const Client = require('./struct/Client');

const activity = {
    name: 'https://mai-san.ml/',
    type: 'COMPETING'
};

const dbConfig = {
    useUnifiedTopology: true,
    connectTimeoutMS: 10000,
    useNewUrlParser: true,
    autoIndex: false,
    poolSize: 5,
    family: 4
};

const client = new Client({
    presence: activity,
    database: dbConfig,
    messageCacheLifetime: 43200,
    messageSweepInterval: 43200,
    allowedMentions: { parse: [ 'users' ]},
    shards: 'auto',

    prefix: '!m',
    owner: '545427431662682112'
});


client.database?.init();
client.musicPlayer?.init();
client.commands.load({ includeSlash: true });
//Only loads the slash commands on client, to load on specific guild, use guild#loadSlashCommands
client.loadEvents();

client.login();
