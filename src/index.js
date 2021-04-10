require('dotenv').config();
const { join } = require('path');
const { ShardingManager } = require('discord.js');

const path = join(__dirname, 'bot.js');
const token = process.env.DISCORD_TOKEN;
const totalShards = 'auto';
const manager = new ShardingManager(path, { token, totalShards });

manager.on('shardCreate', shard => {
  return console.log(`\x1b[32m[MAI_SHARD]\x1b[0m: Launched shard \x1b[32m${shard.id}\x1b[0m`);
});

manager.spawn(this.totalShards, 15000);
