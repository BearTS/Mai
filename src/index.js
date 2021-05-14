require('dotenv').config();

const { join }            = require('path');
const { ShardingManager } = require('discord.js');

const express     = require('express');
const application = express();
const bodyparser  = require('body-parser');

const path    = join(__dirname, 'bot.js');
const token   = process.env.DISCORD_TOKEN;
const manager = new ShardingManager(path, { token });


manager.on('shardCreate', shard => {
  console.log(`\x1b[35m[SHARD_${shard.id}] \x1b[32m[MAI_SHARDMANAGR]\x1b[0m: Launched shard \x1b[32m${shard.id}\x1b[0m`);;
  return;
});

process.on('unhandledRejection', err => {
  console.log(`\x1b[35m[MAIN_PS] \x1b[33m[MAI_UPR_WARNING]\x1b[0m: ${err.message}\x1b[0m`);
});

manager.spawn();

application.use(bodyparser.json());
application.use((req, res, next) => req.header("Authorization")?.trim() !== process.env.API_TOKEN.trim() ? res.status(403).json({ status: 403 }) : next());
application.post('/guilds', (req, res) => {
  if (!Array.isArray(req.body.ids)){
    return res.status(400).send({ status: '400' });
  } else if (req.body.ids.some(x => typeof x !== 'string')){
    return res.status(400).send({ status: '400' });
  };
  return manager.broadcastEval(`${JSON.stringify(req.body.ids)}.map(id => [id, this.guilds.cache.has(id)])`).then(evaled => {
    const response = Object.fromEntries(req.body.ids.map(x => [x, false ]));
    for (const shardResult of evaled){
      for (const [id, bool] of shardResult){
        if (bool === false) continue;
        response[id] = bool;
      };
    };
    res.status(200).send(response);
  }).catch(console.error);
});

application.listen(1600, () => {
  console.log(`Server is running on port 1600!`);
});
