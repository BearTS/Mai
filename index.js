// load env file (contains important keys)
require('dotenv').config();

const fs = require('fs');

const Client = require(`${process.cwd()}/struct/Client`);
const config = require(`${process.cwd()}/config`);
const client = new Client(config);

const express     = require('express');
const application = express();
const bodyparser  = require('body-parser');

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
client.listentoProcessEvents([
  'unhandledRejection',
  'uncaughtException'
], { ignore: false });

application.use(bodyparser.json());

application.post('/guilds', (req, res, next) => {
  if (req.header("Authorization")?.trim() !== process.env.API_TOKEN.trim()){
      req.status(403).json({ status: 403 });
      next();
  }}, (req, res) => {
  if (!Array.isArray(req.body.ids)){
      return res.status(400).send({ status: '400' });
  } else if (req.body.ids.some(x => typeof x !== 'string')){
      return res.status(400).send({ status: '400' });
  };
  const response = req.body.ids.map(x => client.guilds.cache.has(x));
  return res.status(200).send(response);
});

application.listen(1600);
client.login();
