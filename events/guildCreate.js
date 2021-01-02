const guilds = require(`${process.cwd()}/models/GuildProfile`);
const consoleUtil = require(`${process.cwd()}/util/console`);
const text = require(`${process.cwd()}/util/string`);

module.exports = (client, guild) => guilds.findById(guild.id, async (err, doc) => {

  /*===============WELCOME TO THE GUILD_CREATE EVENT=============
    This function runs everytime the bot receives any guild payload
    from discord after the ready event is fired.
  =============================================================*/

  /*=====================================================
     Declare variables
  =====================================================*/
  const owner = await client.users.fetch(guild.ownerID)
  .then(owner => owner.tag)
  .catch(() => '<Unfetched Data>');

  const logo = '<:Enter:794918219835637760>';
  const members = text.commatize(guild.memberCount);
  const message = `${logo} : **${members}** members, owned by **${owner}**`;
  //====================================================//


  /*======================================================
     Check the validity of database connection and save
     new guild profile.
  ======================================================*/
  if (err){
    client.channels.cache.get(client.config.channels.debug)?.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
  } else {
    if (!doc){
      doc = await new guilds({ _id: guild.id }).save();
    };
    client.guildProfiles.set(guild.id, doc);
  };
  //====================================================//



  /*======================================================
     Sends a notification to a log channel (if available)
     that the bot has joined a server
  ======================================================*/
  await client.channels.cache.get(client.config.channels?.logs)?.createWebhook(guild.name, {
    avatar: guild.iconURL({ format: 'png', dynamic: true, size: 128 })
  })
  .then(webhook => Promise.all([webhook.send(message), webhook]))
  .then(([_, webhook]) => webhook.delete())
  .catch(() => {});
  //=====================================================//

  // add more functions on message guildCreate callback function...

  return;
});
