const profile = require('../../models/Profile');

module.exports = {
  name: 'xpreset',
  aliases: [ 'resetxp', 'resetserverxp' ],
  guildOnly: true,
  adminOnly: true,
  rankcommand: true,
  group: 'setup',
  description: 'Resets the xp of all users for this server',
  requiresDatabase: true,
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'xpreset'
  ],
  run: async (client, message ) => {

    await message.channel.send(`This will **reset** all experience points in this server (Action irreversible). Continue?`);
    const collector = message.channel.createMessageCollector( res => message.author.id === res.author.id);

    const continued = await new Promise(resolve => {
      setTimeout(()=> collector.stop('TIMEOUT'), 30000);
      collector.on('collect', message => {
        if (['y','yes'].includes(message.content.toLowerCase())) return resolve(true);
        if (['n','no'].includes(message.content.toLowerCase())) return resolve(false);
      }).on('end', () => resolve(false));
    });

    if (!continued){
      return message.channel.send(`\\❌ **${message.author.tag}**, cancelled the xpreset command!`);
    };


    return profile.updateMany({'data.xp.id': message.guild.id }, {
      $pull: { 'data.xp' : { id: message.guild.id }}
    }, (err, res) => {
      if (err){
        return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
      } else if (res.nModified == 0){
        return message.channel.send(`\\❌ **${message.author.tag}**, this server has no xp data to be cleared of!`);
      } else {
        return message.channel.send(`\\✔️ **${message.author.tag}**, this server's xp has been reset. (Cleared **${res.nModified}** xpdocs)`);
      };
    });
  }
};
