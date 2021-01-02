const text = require(`${process.cwd()}/util/string`);

module.exports = async (client, guild) => {

  /*===============WELCOME TO THE GUILD_CREATE EVENT=============
    This function runs everytime the bot leaves a guild
    from discord after the ready event is fired.
  =============================================================*/

  /*=====================================================
     Declare variables
  =====================================================*/
  const owner = await client.users.fetch(guild.ownerID)
  .then(owner => owner.tag)
  .catch(() => '<Unfetched Data>');

  const logo = '<:leave:794918240651706389>';
  const members = text.commatize(guild.memberCount);
  const message = `${logo} : **${members}** members, owned by **${owner}**`;
  //===================================================//

  /*======================================================
     Sends a notification to a log channel (if available)
     that the bot has left a server
  ======================================================*/
  await client.channels.cache.get(client.config.channels?.logs).createWebhook(guild.name, {
    avatar: guild.iconURL({ format: 'png', dynamic: true, size: 128 })
  })
  .then(webhook => Promise.all([webhook.send(message), webhook]))
  .then(([_, webhook]) => webhook.delete())
  .catch(() => {});
  //=====================================================//

  // add more functions on guildDelete event callback function...

  return;
};
