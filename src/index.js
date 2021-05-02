require('dotenv').config();
const { join } = require('path');
const { ShardingManager } = require('discord.js');

const path = join(__dirname, 'bot.js');
const token = process.env.DISCORD_TOKEN;
const manager = new ShardingManager(path, { token });

manager.on('shardCreate', shard => {
  console.log(`\x1b[35m[SHARD_${shard.id}] \x1b[32m[MAI_SHARD]\x1b[0m: Launched shard \x1b[32m${shard.id}\x1b[0m`);
  process.once('unhandledRejection', err => {
    console.log(`\x1b[35m[SHARD_${shard.id}] \x1b[31m[MAI_UPR_ERROR]\x1b[0m: ${err.message}\x1b[0m`);
  });
  return;
});

manager.spawn();
