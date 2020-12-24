const text = require(`${process.cwd()}/util/string`);

module.exports = async (client, guild) => {
  if (client.config.channels.logs){
    const owner = await client.users.fetch(guild.ownerID);
    const channel = client.channels.cache.get(client.config.channels.logs);
    if (!channel){
      return;
    } else {
      channel.send(`**LEAVE** \`[ ${guild.id} ]\` **${guild.name}** (Owned by **${owner.tag}**): ${text.commatize(guild.memberCount)} members.`)
      .catch(() => {});
    };
  };
}
