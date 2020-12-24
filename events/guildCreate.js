const guilds = require(`${process.cwd()}/models/GuildProfile`);
const consoleUtil = require(`${process.cwd()}/util/console`);
const text = require(`${process.cwd()}/util/string`);

module.exports = (client, guild) => guilds.findById(guild.id, async (err, doc) => {

  const debug = client.channels.cache.get(client.config.channels.debug);
  const owner = await client.users.fetch(guild.ownerID);

  if (err && debug){
    return debug.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
  } else if (!doc){
    doc = await new guilds({ _id: guild.id }).save();
  };

  client.guildProfiles.set(guild.id, doc);

  if (client.config.channels.logs){
    const channel = client.channels.cache.get(client.config.channels.logs);
    if (!channel){
      return;
    } else {
      channel.send(`**JOIN** \`[ ${guild.id} ]\` **${guild.name}** (Owned by **${owner.tag}**): ${text.commatize(guild.memberCount)} members.`)
      .catch(() => {});
    };
  };
});
